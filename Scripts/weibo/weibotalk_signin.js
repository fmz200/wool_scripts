/**********
 微博超话签到修改版
 适配新版微博客户端 (16.x+)
 更新时间：2026-09-08

⚠️ 若从旧版升级，请先在BoxJS或代理工具中清空旧cookie（wb_delete_cookie=true），再重新获取。
⚠️ 新版列表请求为POST，必须配置 requires-body=true（QX用script-request-body），否则无法捕获POST body。

🐬作者
@Evilbutcher。 https://github.com/evilbutcher
@toulanboy。https://github.com/toulanboy/scripts
@fmz200 重构代码，支持多账号和青龙环境

📌不定期更新各种签到、有趣的脚本，欢迎star🌟

***********************************
【配置步骤，请认真阅读，每一个细节都很重要】
***********************************
1. 根据你当前的软件，配置好script。由于是远程文件，记得顺便更新文件。
2. 打开微博APP --> 底部栏"我的" --> 中间的"超话社区" --> 底部栏"我的" --> "关注"，弹出通知，提示获取已关注超话列表成功。
3. 点进一个超话页面，手动签到一次。弹出通知，提示获取超话签到链接成功。 若之前所有已经签到，请关注一个新超话进行签到。
4. 回到quanx等软件，关掉获取cookie的rewrite。（loon是关掉获取cookie的脚本）

📌 配置第2个账号方法：第1个账号获取cookie结束后。在微博app中切换到第2个号，进行相同的获取逻辑。

***************************************
【boxjs 订阅， 用于修改脚本配置】
***************************************
box订阅链接：https://raw.githubusercontent.com/toulanboy/scripts/master/toulanboy.boxjs.json
订阅后，可以在box里面进行 cookie清空、通知个数、签到延迟 等设置.

*************************
【Surge 4.2+ 脚本配置】
*************************
微博超话cookie获取 = type=http-request,pattern=^https?://m?api\.weibo\.c(n|om)\/2\/(flowlist|page\/button),requires-body=true,script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/weibo/weibotalk.cookie.js
微博超话 = type=cron,cronexp="5 0  * * *",script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/weibo/weibotalk_signin.js,wake-system=true,timeout=600

*************************
【Loon 2.1+ 脚本配置】
*************************
[script]
cron "5 0 * * *" script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/weibo/weibotalk_signin.js, timeout=600, tag=微博超话
http-request ^https?://m?api\.weibo\.c(n|om)\/2\/(flowlist|page\/button) script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/weibo/weibotalk.cookie.js,requires-body=true, tag=微博超话cookie获取

*************************
【 QX 1.0.10+ 脚本配置 】
*************************
[rewrite_local]
^https?://m?api\.weibo\.c(n|om)\/2\/(flowlist|page\/button) url script-request-body https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/weibo/weibotalk.cookie.js
[task]
5 0 * * * https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/weibo/weibotalk_signin.js, tag=微博超话


[MITM]
hostname = api.weibo.cn, mapi.weibo.com

*************************
【Shadowrocket 脚本配置】
*************************
[Script]
微博超话cookie获取 = type=http-request,pattern=^https?://m?api\.weibo\.c(n|om)\/2\/(flowlist|page\/button),requires-body=true,script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/weibo/weibotalk.cookie.js
微博超话 = type=cron,cronexp="5 0  * * *",script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/weibo/weibotalk_signin.js,wake-system=true,timeout=600

[MITM]
hostname = api.weibo.cn, mapi.weibo.com

*********/

const $ = new Env("微博超话签到");
const isNode = $.isNode();
const notify = isNode ? require('../qinglong/sendNotify') : '';
$.nodeNotifyMsg = []; // nodeJS合并通知

const wb_delete_cookie = isNode ? process.env["wb_delete_cookie"] : $.getdata("wb_delete_cookie");
const wb_msg_max_num = isNode ? process.env["wb_msg_max_num"] : $.getdata("wb_msg_max_num");
const wb_request_time = isNode ? process.env["wb_request_time"] : $.getdata("wb_request_time");
const tokenList = isNode ? process.env["fmz200_weibotalk_token"] : $.getdata("fmz200_weibotalk_token");

const REQUEST_TIMEOUT = 15000; // 单次请求超时15秒

$.delete_cookie = JSON.parse(wb_delete_cookie || false); // 若需要清空cookie，请把它置为true。清空完毕后，请重新置为false.
$.msg_max_num = wb_msg_max_num * 1 || 50; // 一个通知显示30个超话的签到情况
$.interval_time = wb_request_time * 1 || 3000; //【签到间隔，单位ms】，若超话过多，建议填1000ms以上。

!(async () => {
  console.info(`配置参数：delete_cookie=${$.delete_cookie},msg_max_num=${$.msg_max_num},interval_time=${$.interval_time}`);
  if ($.delete_cookie) {
    $.setdata("[]", "fmz200_weibotalk_token");
    await sendMsg("✅已清空cookie，同时已关闭清空功能。\n🔍请按流程开始获取cookie把~", "");
    $.done();
  }
  // 开始签到流程
  if (!tokenList || JSON.parse(tokenList).length === 0) {
    await sendMsg("❌ 请先获取微博超话签到token", "");
    $.done();
  }
  const jsonTokenList = JSON.parse(tokenList);
  console.log(`🌟 账号数 = ${jsonTokenList.length}`);
  for (let i = 0; i < jsonTokenList.length; i++) {
    const token = jsonTokenList[i];
    $.currentToken = token;
    $.userId = token.userId;
    try {
      if (!validateObject(token)) {
        const subMsg = `[${$.userId}]cookie数据不完整，请重新获取！！`;
        if (isNode) {
          $.nodeNotifyMsg.push(subMsg);
        } else {
          $.msg($.name, subMsg, '', {'open-url': '', 'media-url': "https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/chxm1023/weibo.png"});
        }
        continue;
      }
      if (!token.tokenBody) {
        const subMsg = `[${$.userId}]缺少tokenBody(POST请求体)，请重新获取cookie！！`;
        if (isNode) {
          $.nodeNotifyMsg.push(subMsg);
        } else {
          $.msg($.name, subMsg, '');
        }
        continue;
      }
      init_env();
      await get_all_topics();
      console.log(`🌟 get_all_topics 执行完成，共 ${$.name_list.length} 个超话`);
      if ($.name_list.length === 0) {
        const subMsg = `[${$.userId}]未获取到关注的超话，可能token已过期`;
        if (isNode) {
          $.nodeNotifyMsg.push(subMsg);
        } else {
          $.msg($.name, subMsg, '');
        }
        continue;
      }
      for (let j = 0; j < $.name_list.length; j++) {
        await checkin($.id_list[j], $.name_list[j]);
        await $.wait($.interval_time);
      }
      output();
    } catch (e) {
      const errMsg = `[${$.userId}]执行异常: ${e.message || e}`;
      console.log(`❌ ${errMsg}`);
      if (isNode) {
        $.nodeNotifyMsg.push(errMsg);
      } else {
        $.msg($.name, errMsg, '');
      }
    }
    // 账号间延迟，避免请求过快
    if (i < jsonTokenList.length - 1) {
      console.log(`⏳ 账号间延迟 ${$.interval_time}ms...`);
      await $.wait($.interval_time);
    }
  }
  // 汇总通知
  if (isNode) {
    let totalSuccess = 0, totalFail = 0;
    for (const msg of $.nodeNotifyMsg) {
      const m = msg.match(/成功(\d+)个，失败(\d+)个/);
      if (m) { totalSuccess += parseInt(m[1]); totalFail += parseInt(m[2]); }
    }
    const summary = `📊 汇总: ${jsonTokenList.length}个账号, 成功${totalSuccess}个, 失败${totalFail}个`;
    $.nodeNotifyMsg.unshift(summary);
    await sendMsg($.nodeNotifyMsg.join("\n"), "");
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done()
  })

function init_env() {
  console.log(`🌟 清空环境，开始账号 ${$.userId}`)
  $.message = [];
  $.name_list = [];
  $.id_list = [];
  $.val_list = [];
  $.seenIds = new Set();
  $.successNum = 0;
  $.failNum = 0;
  $.allnumber = 0;
}

function output() {
  if (isNode) {
    if ($.message.length === 0) {
      $.nodeNotifyMsg.push(`${$.userId}: 成功0个，失败${$.failNum}\n（无签到结果）\n-------------------------`);
      return;
    }
    const numberedResult = $.message.map((msg, index) => `${index + 1}. ${msg}`).join('\n');
    $.nodeNotifyMsg.push(`${$.userId}: 成功${$.successNum}个，失败${$.failNum}\n${numberedResult}\n-------------------------`);
  } else {
    if ($.message.length === 0) {
      $.msg(`${$.name} [${$.userId}]`, `成功0个，失败${$.failNum}`, '该账号没有签到结果');
      return;
    }
    $.this_msg = "";
    for (let i = 1; i <= $.message.length; ++i) {
      if (i % ($.msg_max_num) === 0) {
        $.msg(`${$.name}${$.userId}: 成功${$.successNum}个，失败${$.failNum}`, `当前第${Math.ceil(i / $.msg_max_num)}页 ，共${Math.ceil($.message.length / $.msg_max_num)}页`, $.this_msg);
        $.this_msg = "";
      }
      $.this_msg += `${$.message[i - 1]}\n`;
    }
    if ($.message.length % ($.msg_max_num) !== 0) {
      $.msg(`${$.name}${$.userId}: 成功${$.successNum}个，失败${$.failNum}`, `当前第${Math.ceil($.message.length / $.msg_max_num)}页 ，共${Math.ceil($.message.length / $.msg_max_num)}页`, $.this_msg);
    }
  }
}

// 获取所有关注的超话（新版API: POST /2/flowlist）
async function get_all_topics() {
  let page = 1;
  let sinceId = '';
  let maxId = '';
  let hasMore = true;
  const maxPages = 10; // 安全限制

  while (hasMore && page <= maxPages) {
    let body = $.currentToken.tokenBody;
    if (page > 1) {
      body = modifyBodyForPagination(body, page, sinceId, maxId);
    }
    if (page > 1 && body === $.currentToken.tokenBody) {
      console.log("❌ 分页body未变化，停止获取后续超话列表");
      break;
    }

    console.log(`🌟 获取超话列表，第${page}页`);
    let response = await postRequest($.currentToken.tokenUrl, $.currentToken.tokenHeaders, body);
    if (!response || !response.body) {
      console.log("❌ 获取超话列表失败，无响应");
      break;
    }

    let obj;
    try {
      obj = JSON.parse(response.body);
    } catch (e) {
      console.log("❌ 解析超话列表响应失败");
      break;
    }

    if (obj.errmsg) {
      const errMsg = `🚨获取超话列表错误，⚠️微博原话：${obj.errmsg}\n🧑账号可能过期了，清空cookie重新获取吧`;
      if (isNode) {
        $.nodeNotifyMsg.push(errMsg);
      } else {
        $.msg($.name, "🚨获取超话列表错误", `⚠️微博原话：${obj.errmsg}\n🧑账号可能过期了，清空cookie重新获取吧`);
      }
      break;
    }

    // 从响应中提取 card_type=8 的超话卡片
    let foundCount = extractTopics(obj);
    console.log(`🌟 第${page}页找到 ${foundCount} 个超话`);

    if (foundCount === 0) {
      if (page === 1) {
        console.log("❌ 第1页未找到超话，可能无关注超话或token已过期");
      }
      hasMore = false;
      break;
    }

    // 检查是否有更多页
    let moreInfo = obj.moreInfo || {};
    if (moreInfo.params && moreInfo.params.since_id) {
      // 兼容两种分页机制：
      // - flowlist: 无 page 参数，仅 since_id 递增
      // - container_timeline_topicsub: page + since_id 同时递增
      const nextPage = parseInt(moreInfo.params.page || '0');
      if (nextPage && nextPage !== page) {
        page = nextPage;
      } else {
        page = page + 1;
      }
      sinceId = moreInfo.params.since_id;
      maxId = moreInfo.params.max_id || '';
    } else {
      hasMore = false;
    }
  }

  $.allnumber = $.name_list.length;
  console.log(`🌟 共获取 ${$.allnumber} 个关注超话`);
}

// 从响应中提取超话信息（card_type=8 的卡片）
function extractTopics(obj) {
  let count = 0;
  if (!obj.items) return count;
  if (!$.seenIds) $.seenIds = new Set();

  for (const item of obj.items) {
    if (item.category !== 'group' || !item.items) continue;

    for (const sub of item.items) {
      if (sub.category !== 'card' || !sub.data) continue;
      const data = sub.data;
      if (data.card_type !== 8) continue;

      // 从 scheme 中提取超话ID: sinaweibo://pageinfo?containerid=100808xxx
      let match = (data.scheme || '').match(/containerid=([a-f0-9]+)/);
      if (!match) continue;

      let id = match[1];
      // 去重：同一超话可能在不同分组中重复出现
      if ($.seenIds.has(id)) {
        console.log(`⏭️ 跳过重复超话: ${data.title_sub || id}`);
        continue;
      }
      $.seenIds.add(id);

      let name = data.title_sub || '';
      let desc = data.desc1 || data.desc || '';

      $.name_list.push(name);
      $.id_list.push(id);
      $.val_list.push(desc);
      count++;
      console.log(name, desc, id);
    }
  }
  return count;
}

// 修改POST body用于分页请求
function modifyBodyForPagination(body, page, sinceId, maxId) {
  let pairs = body.split('&');
  let result = [];
  let foundTaskType = false;
  let addedManualType = false;
  let addedInvokeType = false;
  let foundPage = false;
  let foundSinceId = false;
  let foundMaxId = false;
  let foundPagingType = false;

  for (let pair of pairs) {
    let idx = pair.indexOf('=');
    let key = idx > -1 ? pair.substring(0, idx) : pair;
    let value = idx > -1 ? pair.substring(idx + 1) : '';

    if (key === 'taskType') {
      foundTaskType = true;
      result.push('taskType=loadMore');
      continue;
    }
    if (key === 'manualType') { addedManualType = true; result.push('manualType=scroll'); continue; }
    if (key === 'invokeType') { addedInvokeType = true; result.push('invokeType=manual'); continue; }
    if (key === 'since_id') { foundSinceId = true; result.push('since_id=' + sinceId); continue; }
    // flowlist 不使用 page 参数，移除原有的 page 值
    if (key === 'page') { foundPage = true; continue; }
    // max_id 在 flowlist 中始终为0，保留原值
    if (key === 'max_id') { foundMaxId = true; result.push(pair); continue; }
    if (key === 'pagingType') { foundPagingType = true; result.push('pagingType=cursor'); continue; }
    result.push(pair);
  }

  if (!foundTaskType) result.push('taskType=loadMore');
  if (!addedManualType) result.push('manualType=scroll');
  if (!addedInvokeType) result.push('invokeType=manual');
  if (!foundSinceId) result.push('since_id=' + sinceId);
  if (!foundPagingType) result.push('pagingType=cursor');

  return result.join('&');
}

// POST 请求封装
function postRequest(url, headersStr, body) {
  return new Promise((resolve) => {
    let headers;
    try {
      headers = JSON.parse(headersStr);
    } catch (e) {
      headers = {};
    }
    let request = {
      url: url,
      headers: headers,
      body: body
    };
    let done = false;
    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      console.log(`❌ POST请求超时: ${url.slice(0, 80)}`);
      resolve(null);
    }, REQUEST_TIMEOUT);
    $.post(request, (error, response, data) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (error) {
        console.log(`❌ POST请求失败: ${error}`);
        resolve(null);
      } else {
        resolve(response);
      }
    });
  });
}

// 签到
function checkin(id, name) {
  // 新版fid格式: 100808xxx_-_recommend，替换其中的超话ID部分
  // request_url中的pageid也需同步替换
  let sendCheckinUrl = $.currentToken.checkinurl
    .replace(/fid=[a-f0-9]+/, "fid=" + id)
    .replace(/pageid%3D[a-f0-9]+/, "pageid%3D" + id);

  let headers;
  try {
    headers = JSON.parse($.currentToken.checkinHeaders);
  } catch (e) {
    headers = {};
  }
  let request = {
    url: sendCheckinUrl,
    headers: headers
  };

  return new Promise(resolve => {
    let done = false;
    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      $.failNum += 1;
      $.message.push(`【${name}】：❌签到请求超时`);
      console.log(`【${name}】：❌签到请求超时`);
      resolve();
    }, REQUEST_TIMEOUT);
    $.get(request, (error, response, data) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (error) {
        $.failNum += 1;
        $.message.push(`【${name}】：❌请求失败 ${error}`);
        console.log(`【${name}】：❌请求失败 ${error}`);
        resolve();
        return;
      }
      name = name.replace(/超话/, "")
      if (response.statusCode == 200) {
        let msg_info;
        try {
          msg_info = JSON.parse(response.body);
        } catch (e) {
          $.failNum += 1;
          $.message.push(`【${name}】：❌响应解析失败`);
          console.log(`【${name}】：❌响应解析失败: ${e.message}`);
          resolve();
          return;
        }
        console.log(response.body);
        if (msg_info.hasOwnProperty('errmsg')) {
          $.failNum += 1;
          if (msg_info.errcode == 382004) {
            $.message.push(`【${name}】：✨今天已签到`);
            console.log(`【${name}】：${msg_info.errmsg}`);
          } else {
            $.message.push(`【${name}】：${msg_info.errmsg}`);
            console.log(`【${name}】："发生错误⚠️ 该请求的返回情况如下"`);
          }
        } else if (msg_info.hasOwnProperty('result') && msg_info.result == 1) {
          $.successNum += 1
          $.message.push(`【${name}】：✅${msg_info.button.name}`)
          console.log(`【${name}】：${msg_info.button.name}`);
        } else {
          $.failNum += 1
          $.message.push(`【${name}】：发生错误⚠️`);
          console.log(`【${name}】："发生错误⚠️ 该请求的返回情况如下"`);
          console.log(response.body)
        }
      } else if ((response.statusCode == 418)) {
        $.failNum += 1
        $.message.push(`【${name}】："签到太频繁啦，请稍后再试"`);
        console.log(`【${name}】："签到太频繁啦，请稍后再试"`);
      } else if (response.statusCode == 511) {
        $.failNum += 1;
        $.message.push(`【${name}】："需要身份验证，请稍后再试"`);
        console.log(`【${name}】："需要身份验证，请稍后再试"`);
      } else {
        $.failNum += 1
        $.message.push(`【${name}】：发生错误⚠️`);
        console.log(`【${name}】："发生错误⚠️ 该请求的返回情况如下"`);
        console.log(JSON.stringify(response))
      }
      resolve();
    })
  })
}

// 简单的判断对象的所有属性都不为空，所有属性都符合条件才返回 true
function validateObject(obj) {
  const required = ['userId', 'tokenUrl', 'tokenHeaders', 'tokenBody', 'checkinurl', 'checkinHeaders'];
  return required.every(key =>
    obj[key] !== null &&
    obj[key] !== undefined &&
    (typeof obj[key] !== 'string' || obj[key].trim() !== '')
  );
}

// API start
async function sendMsg(desc, opts) { $.isNode() ? await notify.sendNotify($.name, desc) : $.msg($.name, $.subTitle || "", desc, opts) }
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;"POST"===e&&(s=this.post);const i=new Promise(((e,i)=>{s.call(this,t,((t,s,o)=>{t?i(t):e(s)}))}));return t.timeout?((t,e=1e3)=>Promise.race([t,new Promise(((t,s)=>{setTimeout((()=>{s(new Error("请求超时"))}),e)}))]))(i,t.timeout):i}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.logLevels={debug:0,info:1,warn:2,error:3},this.logLevelPrefixs={debug:"[DEBUG] ",info:"[INFO] ",warn:"[WARN] ",error:"[ERROR] "},this.logLevel="info",this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null,...s){try{return JSON.stringify(t,...s)}catch{return e}}getjson(t,e){let s=e;if(this.getdata(t))try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise((e=>{this.get({url:t},((t,s,i)=>e(i)))}))}runScript(t,e){return new Promise((s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,a]=i.split("@"),n={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"},policy:"DIRECT",timeout:o};this.post(n,((t,e,i)=>s(i)))})).catch((t=>this.logErr(t)))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t||(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce(((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{}),t)[e[e.length-1]]=s),t}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),a=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(a);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.cookie&&void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar)))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",((t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}})).then((t=>{const{statusCode:i,statusCode:o,headers:r,rawBody:a}=t,n=s.decode(a,this.encoding);e(null,{status:i,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:i,response:o}=t;e(i,o,o&&s.decode(o.rawBody,this.encoding))}));break}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let i=require("iconv-lite");this.initGotEnv(t);const{url:o,...r}=t;this.got[s](o,r).then((t=>{const{statusCode:s,statusCode:o,headers:r,rawBody:a}=t,n=i.decode(a,this.encoding);e(null,{status:s,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:s,response:o}=t;e(s,o,o&&i.decode(o.rawBody,this.encoding))}));break}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}queryStr(t){let e="";for(const s in t){let i=t[s];null!=i&&""!==i&&("object"==typeof i&&(i=JSON.stringify(i)),e+=`${s}=${i}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",i="",o={}){const r=t=>{const{$open:e,$copy:s,$media:i,$mediaMime:o}=t;switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{const r={};let a=t.openUrl||t.url||t["open-url"]||e;a&&Object.assign(r,{action:"open-url",url:a});let n=t["update-pasteboard"]||t.updatePasteboard||s;if(n&&Object.assign(r,{action:"clipboard",text:n}),i){let t,e,s;if(i.startsWith("http"))t=i;else if(i.startsWith("data:")){const[t]=i.split(";"),[,o]=i.split(",");e=o,s=t.replace("data:","")}else{e=i,s=(t=>{const e={JVBERi0:"application/pdf",R0lGODdh:"image/gif",R0lGODlh:"image/gif",iVBORw0KGgo:"image/png","/9j/":"image/jpg"};for(var s in e)if(0===t.indexOf(s))return e[s];return null})(i)}Object.assign(r,{"media-url":t,"media-base64":e,"media-base64-mime":o??s})}return Object.assign(r,{"auto-dismiss":t["auto-dismiss"],sound:t.sound}),r}case"Loon":{const s={};let o=t.openUrl||t.url||t["open-url"]||e;o&&Object.assign(s,{openUrl:o});let r=t.mediaUrl||t["media-url"];return i?.startsWith("http")&&(r=i),r&&Object.assign(s,{mediaUrl:r}),console.log(JSON.stringify(s)),s}case"Quantumult X":{const o={};let r=t["open-url"]||t.url||t.openUrl||e;r&&Object.assign(o,{"open-url":r});let a=t["media-url"]||t.mediaUrl;i?.startsWith("http")&&(a=i),a&&Object.assign(o,{"media-url":a});let n=t["update-pasteboard"]||t.updatePasteboard||s;return n&&Object.assign(o,{"update-pasteboard":n}),console.log(JSON.stringify(o)),o}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,i,r(o));break;case"Quantumult X":$notify(e,s,i,r(o));break;case"Node.js":break}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}debug(...t){this.logLevels[this.logLevel]<=this.logLevels.debug&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.debug}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}info(...t){this.logLevels[this.logLevel]<=this.logLevels.info&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.info}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}warn(...t){this.logLevels[this.logLevel]<=this.logLevels.warn&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.warn}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}error(...t){this.logLevels[this.logLevel]<=this.logLevels.error&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.error}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.map((t=>t??String(t))).join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,e,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,e,void 0!==t.message?t.message:t,t.stack);break}}wait(t){return new Promise((e=>setTimeout(e,t)))}done(t={}){const e=((new Date).getTime()-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${e} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
// API end
