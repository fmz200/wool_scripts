/**********
 微博超话签到修改版
 需要12.2.1以下版本抓包
 更新时间：2025-05-27 22:00:00

🐬作者
@Evilbutcher。 https://github.com/evilbutcher
@toulanboy。https://github.com/toulanboy/scripts
@fmz200 重构代码，支持多账号和青龙环境

📌不定期更新各种签到、有趣的脚本，欢迎star🌟

***********************************
【配置步骤，请认真阅读，每一个细节都很重要】
***********************************
1. 根据你当前的软件，配置好script。由于是远程文件，记得顺便更新文件。
2. 打开微博APP --> 底部栏“我的“  -->  中间的”超话社区“  --> 底部栏"我的" --> ”关注“， 弹出通知，提示获取已关注超话链接成功。
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
微博超话cookie获取 = type=http-request,pattern=^https?://m?api\.weibo\.c(n|om)\/2\/(cardlist|page\/button),script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/weibo/weibotalk.cookie.js
微博超话 = type=cron,cronexp="5 0  * * *",script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/weibo/weibotalk.js,wake-system=true,timeout=600

*************************
【Loon 2.1+ 脚本配置】
*************************
[script]
cron "5 0 * * *" script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/weibo/weibotalk.js, timeout=600, tag=微博超话
http-request ^https?://m?api\.weibo\.c(n|om)\/2\/(cardlist|page\/button) script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/weibo/weibotalk.cookie.js,requires-body=false, tag=微博超话cookie获取

*************************
【 QX 1.0.10+ 脚本配置 】 
*************************
[rewrite_local]
^https?://m?api\.weibo\.c(n|om)\/2\/(cardlist|page\/button) url script-request-header https://raw.githubusercontent.com/toulanboy/scripts/master/weibo/weibotalk.cookie.js
[task]
5 0 * * * https://raw.githubusercontent.com/toulanboy/scripts/master/weibo/weibotalk.js, tag=微博超话


[MITM]
hostname = api.weibo.cn

*********/

const $ = new Env("微博超话签到");
const isNode = $.isNode();
const notify = isNode ? require('./sendNotify') : '';
$.nodeNotifyMsg = []; // nodeJS合并通知

const wb_delete_cookie = isNode ? process.env["wb_delete_cookie"] : $.getdata("wb_delete_cookie");
const wb_msg_max_num = isNode ? process.env["wb_msg_max_num"] : $.getdata("wb_msg_max_num");
const wb_request_time = isNode ? process.env["wb_request_time"] : $.getdata("wb_request_time");
const tokenList = isNode ? process.env["fmz200_weibotalk_token"] : $.getdata("fmz200_weibotalk_token");

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
  for (const token of jsonTokenList) {
    $.currentToken = token;
    $.userId = token.userId;
    if (!validateObject(token)) {
      const subMsg = `[${$.userId}]cookie数据不完整，请重新获取！！`;
      if (isNode) {
        $.nodeNotifyMsg.push(subMsg);
      } else {
        $.msg($.name, subMsg, '', {'open-url': '', 'media-url': "https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/chxm1023/weibo.png"});
      }
      continue;
    }
    init_env();
    await get_page_number();
    console.log(`🌟 get_page_number 执行完成`);
    for (let i = 1; i <= $.pagenumber; i++) {
      await get_talk_id(i);
    }
    for (let i in $.name_list) {
      await checkin($.id_list[i], $.name_list[i]);
      await $.wait($.interval_time);
    }
    output();
  }
  if (isNode) await sendMsg($.nodeNotifyMsg.join("\n"), "");
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
  $.successNum = 0;
  $.failNum = 0;
  $.allnumber = 0;
  $.pagenumber = 0;
  $.stopNum = 0;
}

function output() {
  if (isNode) {
    // 带序号版本
    const numberedResult = $.message.map((msg, index) => `${index + 1}. ${msg}`).join('\n');
    $.nodeNotifyMsg.push(`${$.userId}: 成功${$.successNum}个，失败${$.failNum}\n${numberedResult}\n-------------------------`);
  } else {
    $.this_msg = "";
    for (let i = 1; i <= $.message.length; ++i) {
      if (i % ($.msg_max_num) === 0) {
        $.msg(`${$.name}${$.userId}: 成功${$.successNum}个，失败${$.failNum}`, `当前第${Math.ceil(i / $.msg_max_num)}页 ，共${Math.ceil($.message.length / $.msg_max_num)}页`, $.this_msg);
        $.this_msg = "";
      }
      $.this_msg += `${$.message[i - 1]}\n`;
    }
    if ($.message.length % $.msg_max_num !== 0) {
      $.msg(`${$.name}${$.userId}: 成功${$.successNum}个，失败${$.failNum}`, `当前第${Math.ceil((i - 1) / $.msg_max_num)}页 ，共${Math.ceil($.message.length / $.msg_max_num)}页`, $.this_msg);
    }
  }
}

function get_page_number() {
  return new Promise((resolve) => {
    let request = {
      url: $.currentToken.tokenUrl, header: $.currentToken.tokenHeaders
    };
    $.get(request, (error, response, data) => {
      if (error) {
        throw new Error(error);
      }
      let obj = JSON.parse(response.body);
      if (obj.hasOwnProperty('errmsg') || obj.cardlistInfo.total == undefined) {
        if (isNode) {
          $.nodeNotifyMsg.push(`🚨获取页数出现错误，⚠️微博原话：${obj.errmsg}\n🧑账号可能过期了，清空cookie重新获取吧`);
        } else {
          $.msg($.name, "🚨获取页数出现错误", `⚠️微博原话：${obj.errmsg}\n🧑账号可能过期了，清空cookie重新获取吧`);
        }
        $.pagenumber = 0;
        resolve();
        return;
      }
      $.allnumber = obj.cardlistInfo.total;
      console.log("当前已关注超话" + $.allnumber + "个");
      $.pagenumber = Math.ceil($.allnumber / 25);
      resolve();
    });
  });
}

// 获取超话签到id
function get_talk_id(page) {
  let getListUrl = $.currentToken.tokenUrl.replace(/&page=.*?&/, "&page=" + page + "&");
  // console.log(getListUrl);
  let request = {
    url: getListUrl, header: $.currentToken.tokenHeaders
  };
  // console.log(request)
  return new Promise((resolve) => {
    $.get(request, (error, response, data) => {
      if (error) {
        throw new Error(error);
      }
      let obj = JSON.parse(response.body);
      if (obj.hasOwnProperty('errmsg') || obj.cards === undefined || obj.cards == null) {
        if (isNode) {
          $.nodeNotifyMsg.push(`🚨获取超话ID出现错误，⚠️微博原话：${obj.errmsg}`);
        } else {
          $.msg($.name, "🚨获取超话ID出现错误", `⚠️微博原话：${obj.errmsg}\n`);
        }
        resolve();
        return;
      }
      let group = obj.cards[0]["card_group"];
      let number = group.length;
      for (let i = 0; i < number; i++) {
        let name = group[i]["title_sub"];
        $.name_list.push(name);
        let val = group[i].desc;
        $.val_list.push(val);
        let id = group[i].scheme.slice(33, 71);
        $.id_list.push(id);

        console.log(name, val, id);
      }
      resolve();
    })
  })
}

// 签到
function checkin(id, name) {
  let sendCheckinUrl = $.currentToken.checkinurl
    .replace(/&fid=.*?&/, "&fid=" + id + "&")
    .replace(/pageid%3D.*?%26/, "pageid%3D" + id + "%26");
  let request = {
    url: sendCheckinUrl, header: $.currentToken.checkinHeaders
  };
  return new Promise(resolve => {
    $.get(request, (error, response, data) => {
      if (error) {
        throw new Error(error);
      }
      name = name.replace(/超话/, "")
      if (response.statusCode == 200) {
        const msg_info = JSON.parse(response.body);
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
  return Object.values(obj).every(value =>
    value !== null &&
    value !== undefined &&
    (typeof value !== 'string' || value.trim() !== '')
  );
}

// API start
async function sendMsg(desc, opts) { $.isNode() ? await notify.sendNotify($.name, desc) : $.msg($.name, $.subTitle || "", desc, opts) }
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;"POST"===e&&(s=this.post);const i=new Promise(((e,i)=>{s.call(this,t,((t,s,o)=>{t?i(t):e(s)}))}));return t.timeout?((t,e=1e3)=>Promise.race([t,new Promise(((t,s)=>{setTimeout((()=>{s(new Error("请求超时"))}),e)}))]))(i,t.timeout):i}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.logLevels={debug:0,info:1,warn:2,error:3},this.logLevelPrefixs={debug:"[DEBUG] ",info:"[INFO] ",warn:"[WARN] ",error:"[ERROR] "},this.logLevel="info",this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null,...s){try{return JSON.stringify(t,...s)}catch{return e}}getjson(t,e){let s=e;if(this.getdata(t))try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise((e=>{this.get({url:t},((t,s,i)=>e(i)))}))}runScript(t,e){return new Promise((s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,a]=i.split("@"),n={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"},policy:"DIRECT",timeout:o};this.post(n,((t,e,i)=>s(i)))})).catch((t=>this.logErr(t)))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t||(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce(((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{}),t)[e[e.length-1]]=s),t}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),a=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(a);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.cookie&&void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar)))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",((t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}})).then((t=>{const{statusCode:i,statusCode:o,headers:r,rawBody:a}=t,n=s.decode(a,this.encoding);e(null,{status:i,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:i,response:o}=t;e(i,o,o&&s.decode(o.rawBody,this.encoding))}));break}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let i=require("iconv-lite");this.initGotEnv(t);const{url:o,...r}=t;this.got[s](o,r).then((t=>{const{statusCode:s,statusCode:o,headers:r,rawBody:a}=t,n=i.decode(a,this.encoding);e(null,{status:s,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:s,response:o}=t;e(s,o,o&&i.decode(o.rawBody,this.encoding))}));break}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}queryStr(t){let e="";for(const s in t){let i=t[s];null!=i&&""!==i&&("object"==typeof i&&(i=JSON.stringify(i)),e+=`${s}=${i}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",i="",o={}){const r=t=>{const{$open:e,$copy:s,$media:i,$mediaMime:o}=t;switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{const r={};let a=t.openUrl||t.url||t["open-url"]||e;a&&Object.assign(r,{action:"open-url",url:a});let n=t["update-pasteboard"]||t.updatePasteboard||s;if(n&&Object.assign(r,{action:"clipboard",text:n}),i){let t,e,s;if(i.startsWith("http"))t=i;else if(i.startsWith("data:")){const[t]=i.split(";"),[,o]=i.split(",");e=o,s=t.replace("data:","")}else{e=i,s=(t=>{const e={JVBERi0:"application/pdf",R0lGODdh:"image/gif",R0lGODlh:"image/gif",iVBORw0KGgo:"image/png","/9j/":"image/jpg"};for(var s in e)if(0===t.indexOf(s))return e[s];return null})(i)}Object.assign(r,{"media-url":t,"media-base64":e,"media-base64-mime":o??s})}return Object.assign(r,{"auto-dismiss":t["auto-dismiss"],sound:t.sound}),r}case"Loon":{const s={};let o=t.openUrl||t.url||t["open-url"]||e;o&&Object.assign(s,{openUrl:o});let r=t.mediaUrl||t["media-url"];return i?.startsWith("http")&&(r=i),r&&Object.assign(s,{mediaUrl:r}),console.log(JSON.stringify(s)),s}case"Quantumult X":{const o={};let r=t["open-url"]||t.url||t.openUrl||e;r&&Object.assign(o,{"open-url":r});let a=t["media-url"]||t.mediaUrl;i?.startsWith("http")&&(a=i),a&&Object.assign(o,{"media-url":a});let n=t["update-pasteboard"]||t.updatePasteboard||s;return n&&Object.assign(o,{"update-pasteboard":n}),console.log(JSON.stringify(o)),o}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,i,r(o));break;case"Quantumult X":$notify(e,s,i,r(o));break;case"Node.js":break}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}debug(...t){this.logLevels[this.logLevel]<=this.logLevels.debug&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.debug}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}info(...t){this.logLevels[this.logLevel]<=this.logLevels.info&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.info}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}warn(...t){this.logLevels[this.logLevel]<=this.logLevels.warn&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.warn}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}error(...t){this.logLevels[this.logLevel]<=this.logLevels.error&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.error}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.map((t=>t??String(t))).join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,e,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,e,void 0!==t.message?t.message:t,t.stack);break}}wait(t){return new Promise((e=>setTimeout(e,t)))}done(t={}){const e=((new Date).getTime()-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${e} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
// API end
