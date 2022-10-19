/*
更新时间: 2021-01-12 08:45

中青看点浏览赚/看看赚任务，手动抓取开始任务的数据即可

iOS端通过Loon插件进行配置，qx使用解析器处理
https://raw.githubusercontent.com/ztxtop/x/main/rewrite-zqkkz.plugin

Android端需通过其它抓包工具间接获取，比如：1、安卓连ios手机的抓包工具抓取所需请求，再重放请求让Loon、QX等NE工具抓取任务数据；2、安卓通过surge for mac直接抓取任务数据
https://raw.githubusercontent.com/ztxtop/x/main/rewrite-zqkkz.sgmodule

*/


const $ = new Env("中青看看赚");
$.suffix = i => i > 0 ? i + 1 + '' : '';
$.isRewrite = 'undefined' !== typeof $request;
$.isResponse = 'undefined' !== typeof $response;
const youthBanner = 'youth_banner';
const youthAndroidReadtime = 'youth_android_readtime';
const youthAndroidReward = 'youth_android_reward';
const youthAndroidNewtask = 'youth_android_newtask';
const delFirstZeroRewardData = 0; // 是否移除首次领取奖励无青豆的数据，0-否、1-是

!(async () => {
  if ($.isRewrite) {
    // 抓包
    let url = $request.url;
    if (!$.isResponse && $request.method != 'OPTIONS') {
      $.idx = $.suffix(($.getval('zqSuffix') || '1') - 1); // 抓包账号扩展字符
      $.acName = $.name + ($.idx || '1');
      await GetCookie(url);
    } else if (url.match(/\/WebApi\/NewTaskIos\/getTaskList\?/)) {
      // 任务中心接口，尝试添加火爆转发、看看赚入口
      let body = JSON.parse($response.body);
      if (body) {
        let hd = body.list && body.list.heard;
        if (hd) {
          // let shareLen = hd.filter(o=>o.event =='task_page_fire_share_icon').length;
          let fxLen = hd.filter(o => o.event == 'task_page_fire_share_icon').length;
          if (fxLen == 0) {
            hd.push({
              "title": "火爆转发+",
              "event": "task_page_fire_share_icon",
              "logo": "http://res.youth.cn/img-cover/10bdf5c3c8cca6c1176107044b50472f:88:88.gif",
              "topIcon": "日赚18元",
              "minlogo": "",
              "action": "",
              "url": "https://kd.youth.cn/h5/20200612makeMoney",
              "jump_type": 1
            });
          }
          let kkzLen = hd.filter(o => o.event == 'task_lookmaking').length;
          if (kkzLen == 0) {
            hd.push({
              "title": "看看赚+",
              "event": "task_lookmaking",
              "logo": "http://res.youth.cn/img-cover/24c833abc8f19c6d97bb962bbc50890f:88:88.png",
              "topIcon": "",
              "minlogo": "",
              "action": "",
              "url": "https://kd.youth.cn/h5/20190527watchMoney",
              "jump_type": 1
            });
          }
          $.done({body: JSON.stringify(body)})
        }
      }
    }
  } else {
    // 定时任务
    // 根据执行环境所在时区的时间，获得北京时间戳
    const currDate = new Date();
    const utc8 = currDate.getTime() + (currDate.getTimezoneOffset() * 60 * 1000) + 8 * 60 * 60 * 1000;
    let zqAc = $.getval('zqExecAc') || '';
    if (/^(,?\d+)+$/.test(zqAc)) {
      zqAc = zqAc.split(',').sort();
    } else {
      zqAc = [];
      // 兼容旧配置
      $.zqCount = ($.zqCount = ($.getval('zqCount') || '1') - 1) > 0 ? $.zqCount + 1 : 1; // 执行任务的账号个数
      for (let index = 1; index <= $.zqCount; index++) {
        zqAc.push(index + '');
      }
    }
    $.log('', `======== 共${zqAc.length}个账号位，执行时间(UTC+8)：${new Date(utc8).toLocaleString()}  ========`, '');
    $.nowDate = $.time('yyyy-MM-dd', utc8);
    const delRepeatErrorData = $.getval('delErrorData') - 0; // 删除一天内出错两次的看看赚数据
    const logData = $.getjson('acExecLogData') || {};
    for (let acIdx of zqAc) {
      $.idx = $.suffix(acIdx-1);
      $.acName = $.name + ($.idx || '1');

      let doTask = {
        okBanener: [], // 已完成的看看赚任务ID
        fiveStatus: 0, // 激励视频任务状态
        timeNum: 0 // 阅读文章时长
      };
      // 获取任务信息列表
      let taskParam = $.getdata(youthAndroidNewtask + $.idx);
      if (taskParam) {
        let taskObj = await execNewtask(`https://kandian.youth.cn/v17/NewTask/getTaskList.json?${taskParam}`);
        if (taskObj && taskObj.daily) {
          for (let o of taskObj.daily) {
            if (o.event == 'task_page_others_task_button') {
              // 看看赚
              if (o.status == 2) {
                doTask.okBanener.push(o.banner_id);
              }
            } else if (o.event == 'task_page_look_award_video_button') {
              // 福利视频
              doTask.fiveStatus = o.status;
            } else if (o.event == 'task_daily_share_article') {
              // 文章阅读时长
              doTask.timeNum = Math.max(doTask.timeNum, (o.title_total - o.title_num) * 60);
            }
          }
        }
      }
      let allScore = Number();
      let yb = $.getjson(youthBanner + $.idx) || {};
      let change = false;
      const acLog = logData[acIdx-1] || {};
      if (acLog['date'] != $.nowDate) {
        acLog['date'] = $.nowDate;
        acLog['errorId'] = [];
        acLog['handleNo'] = [];
        acLog['handleId'] = [];
      }
      for (let url in yb) {
        let dataObj = yb[url];
        if (dataObj) {
          let headers = dataObj['headers'];
          let bannerIds = [];
          for (let bannerId in dataObj) {
            if (bannerId != 'headers' && !doTask.okBanener.includes(bannerId) && !acLog['handleId'].includes(bannerId)) {
              let score = await bannerTask(bannerId, url, headers, dataObj[bannerId], 0);
              if (score > 0) {
                bannerIds.push(score);
              } else if (delRepeatErrorData && score == -1) {
                if (acLog['errorId'].includes(bannerId)) {
                  $.log(`${$.acName}: 将移除今日两次出错的任务${bannerId}`);
                  // 今天已出错过
                  delete dataObj[bannerId];
                  change = true;
                } else {
                  acLog['errorId'].push(bannerId);
                }
              }
            }
          }
          if (bannerIds.length > 0) {
            $.log('', `${$.acName}: 等待10秒后再去领取奖励。。。`, '');
            await $.wait(10000);
            for (let bannerId in dataObj) {
              if (bannerId != 'headers' && bannerIds.includes(bannerId - 0)) {
                let score = await bannerTask(bannerId, url.replace(/start/, 'end'), headers, dataObj[bannerId], 1);
                if (score > 0) {
                  allScore += score;
                  acLog['handleId'].push(bannerId);
                }
              }
            }
          }
        }
      }
      // 有执行出错要删除的任务，需持久化改动
      if (change) {
        $.setjson(yb, youthBanner + $.idx);
      }
      $.log('', `${$.acName}: 看看赚任务执行完毕`, '')
      // 添加文章阅读时长
      let time = 0;
      let timedata = '';
      if (doTask.timeNum > 0 && (timedata = $.getdata(youthAndroidReadtime + $.idx))) {
        let start = await readTime(timedata);
        time = await readTime(timedata);
        if (start > 0 && time > start) {
          let s = time - start;
          let len = (doTask.timeNum - s * 2) / s + 1;
          for (let i = 0; i < len; i++) {
            time = await readTime(timedata);
          }
        }
        $.log('', `${$.acName}: 阅读时长任务执行完毕`, '');
      }
      if (taskParam && doTask.fiveStatus == 0) {
        let taskUrl = `https://kandian.youth.cn/V17/NewTask/recordNum.json?${taskParam}`
        for (let i = 4; i >= 0; i--) {
          await execNewtask(taskUrl);
          if (i > 0) {
            await $.wait(500);
          }
        }
        $.log('', `${$.acName}: 激励视频任务执行完毕`, '');
      }
      let reward = $.getjson(youthAndroidReward + $.idx) || {};
      let count = 1;
      change = false;
      for (let url in reward) {
        let arr = reward[url];
        arr.reverse();
        for (let i = arr.length - 1; i >= 0; i--) {
          let body = arr[i];
          let score = 0;
          let num = 1;
          if (!acLog['handleNo'].includes(count)) {
            do {
              score = await execReward(url, body);
              $.log('', `${$.acName}: 奖励任务${count}第${num++}次执行结果：${score}`, '');
              if (score > 0) {
                await $.wait(1500);
                allScore += score;
              } else if (delFirstZeroRewardData && num == 2) {
                // 可清除首次0奖励数据
                arr.splice(i, 1);
                change = true;
              }
            } while (score > 0 && url.match(/toDouble/));
            acLog['handleNo'].push(count);
          }
          count++;
        }
        if (change) {
          if (arr.length > 0) {
            arr.reverse();
          } else {
            delete reward[url];
          }
        }
      }
      if (change) {
        $.setjson(reward, youthAndroidReward + $.idx);
      }
      $.msg($.acName, '', `任务完成，执行总计获得${allScore}个青豆，当前阅读时长：${Math.floor(time / 60)}分钟`);
      logData[acIdx-1] = acLog;
    }
    $.setjson(logData, 'acExecLogData');
  }
})().catch((e) => $.logErr(e)).finally(() => $.done());


async function GetCookie(url) {
  if (url.match(/\/(browse_|adlick)start\.json/)) {
    // 开始任务
    let bannerId = await bannerTask(null, url, $request.headers, $request.body, -1);
    if (bannerId - 0 <= 0) {
      return;
    }
    let yb = $.getjson(youthBanner + $.idx);
    let dataObj = {};
    if (yb) {
      dataObj = yb[url] || {};
      let body = dataObj[bannerId];
      if (body) {
        // 已存在的数据，跳过保存
        $.msg($.acName, '', '任务数据已存在，本次跳过');
        return;
      }
    } else {
      yb = {};
    }
    let headers = {
      'User-Agent': $request.headers['User-Agent'],
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    if ($request.headers['device-platform']) {
      headers['device-platform'] = $request.headers['device-platform'];
    } else if ($request.headers['device_platform']) {
      headers['device_platform'] = $request.headers['device_platform'];
    }
    dataObj['headers'] = headers;
    dataObj[bannerId] = $request.body;
    yb[url] = dataObj;
    $.setjson(yb, youthBanner + $.idx);
    $.msg($.acName, '数据获取成功');
  } else if (url.match(/\/user\/stay\.json/)) {
    subt = '获取Android阅读时长数据';
    // 顺序提交两个阅读时长，检查数据记录的时长是多少
    let start = await readTime($request.body, 0);
    let end = await readTime($request.body, 0);
    let oldBody = $.getval(youthAndroidReadtime + $.idx);
    if (!oldBody || (start >= 0 && end > 0 && end - start > 60)) {
      // 已有时长数据时，仅存储大于60秒的阅读时长
      $.setdata($request.body, youthAndroidReadtime + $.idx);
      $.msg($.acName, subt, `🎉获取阅读时长数据成功；每次上传时长为${end-start}秒`);
    } else {
      $.log($.acName, subt, `😭获取阅读时长数据失败；上传时长仅${end-start}秒`);
    }
  } else if (url.match(/\/v5\/user\/app_stay\.json/)) {
    subt = '获取iOS阅读时长数据';
    // 顺序提交两个阅读时长，检查数据记录的时长是多少
    let start = await readTime($request.body, 0, 'iOS');
    let end = await readTime($request.body, 0, 'iOS');
    let oldBody = $.getval('readtime_zq' + $.idx);
    if (!oldBody || (start >= 0 && end > 0 && end - start > 60)) {
      // 已有时长数据时，仅存储大于60秒的阅读时长
      $.setdata($request.body, 'readtime_zq' + $.idx);
      $.msg($.acName, subt, `🎉获取阅读时长数据成功；每次上传时长为${end-start}秒`);
    } else {
      $.log($.acName, subt, `😭获取阅读时长数据失败；上传时长仅${end-start}秒`);
    }
  } else if (url.match(/\/CommonReward\/(toGetReward|toDouble)\.json/) && $request.body) {
    let reward = $.getjson(youthAndroidReward + $.idx) || {};
    let arr = reward[url];
    if (!arr) {
      arr = reward[url] = [];
    }
    if (arr.includes($request.body)) {
      $.msg($.acName, '', '奖励数据重复，本次跳过');
    } else {
      arr.push($request.body);
      $.setjson(reward, youthAndroidReward + $.idx);
      $.msg($.acName, '', '添加奖励领取数据成功');
    }
  } else if (url.match(/\/NewTask\/getTaskList\.json/)) {
    let group = url.match(/^.+?json\?(.+)/);
    if (group) {
      let taskParam = group[1].split('&').map(s=>s.match(/^(app_version=|device_type=|uid=)(.+)/)).filter(g=>g).map(g=>g[1]+g[2]).sort().join('&');
      if(taskParam){
        let oldTaskParam = $.getdata(youthAndroidNewtask + $.idx);
        $.setdata(taskParam, youthAndroidNewtask + $.idx);
        if (taskParam != oldTaskParam) {
          $.msg($.acName, '', '获取任务参数成功');
        } else {
          $.msg($.acName, '', '更新用任务参数成功');
        }
      }
    } else {
      $.msg($.acName, '', '获取任务参数失败');
    }
  }
}

// 开始看看赚任务
function bannerTask(bannerId, url, headers, body, type = -1) {
  return new Promise(resolve => {
    $.post({
      url: url,
      headers: headers,
      body: body
    }, async (error, response, data) => {
      try {
        let obj = JSON.parse(data);
        if (obj.success == true) {
          let score = Number();
          if (type < 0) {
            // 抓包或提交任务完成计数时，直接返回任务ID
            resolve(obj.items.banner_id - 0);
            return;
          } else if (type == 0) {
            // 开始做任务
            if (obj.items.comtele_state == 0) {
              $.log('', `${$.acName}: 开始任务${obj.items.banner_id}${obj.message}`, '');
              if (url.match(/adlickstart/)) {
                for (let i = 0, num = obj.items.see_num - obj.items.read_num; i < num; i++) {
                  await bannerTask(bannerId, url.replace(/adlickstart/, 'bannerstatus'), headers, body, -1);
                }
              }
              score = obj.items.banner_id - 0;
            } else {
              $.log('', `${$.acName}: 任务${obj.items.banner_id}已完成`, '');
            }
          } else {
            // 领取奖励，直接打印奖励结果
            $.log('', `${$.acName}: 任务${obj.items.banner_id}${obj.message}，${obj.items.desc||'恭喜获得'+obj.items.score+'青豆'}`);
            score = Number(obj.items.score);
          }
          resolve(score);
        } else {
          if (type < 0) {
            $.log('', `${$.acName}: 开始任务${bannerId||''}${obj.message}`, '')
          } else if (type == 0) {
            $.log('', `${$.acName}: 完成任务${bannerId||''}${obj.message}`, '')
          } else {
            $.log('', `${$.acName}: 领取奖励${bannerId||''}${obj.message}`, '')
          }
          resolve(-1);
        }
      } catch (e) {
        $.logErr(e)
        resolve(-2);
      }
    })
  })
}

// 提交阅读时长
function readTime(body, type = 1, pf = 'android') {
  return new Promise(resolve => {
    if(!body){
      resolve(-1);
    }
    let opts = {
      url: 'https://kandian.youth.cn/v5/user/stay.json',
      headers: {
        'User-Agent': 'okhttp/3.12.2',
        'device-platform': 'android',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    };
    if(pf == 'iOS'){
      opts = {
        url: `https://ios.baertt.com/v5/user/stay.json`,
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
        },
        body: body
      }
    }
    $.post(opts, async (error, response, data) => {
      try {
        let obj = JSON.parse(data);
        if (obj.success == true) {
          if (type) {
            $.log('', `${$.acName}: 今日提交时长总计` + Math.floor(obj.time / 60) + `分钟`, '');
          }
          resolve(obj.time - 0);
        } else {
          resolve(0);
        }
      } catch (e) {
        resolve(-1);
      }
    })
  })
}

// 领取奖励
function execReward(url, body) {
  return new Promise(resolve => {
    $.post({
      url: url,
      headers: {
        'User-Agent': 'okhttp/3.12.2',
        'device-platform': 'android',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    }, async (error, response, data) => {
      try {
        let obj = JSON.parse(data);
        if (obj.success == true) {
          resolve(obj.items.score - 0);
        } else {
          resolve(0);
        }
      } catch (e) {
        resolve(-1);
      }
    })
  })
}

// 观看福利视频 or 任务信息列表
function execNewtask(url) {
  return new Promise(resolve => {
    $.get({
      url: url,
      headers: {
        'device-platform': 'android',
        'User-Agent': 'okhttp/3.12.2'
      }
    }, async (error, response, data) => {
      try {
        let obj = JSON.parse(data);
        if (obj.success == true) {
          resolve(obj.items);
        } else {
          resolve(obj.message);
        }
      } catch (e) {
        $.logErr(e);
        resolve(e);
      }
    })
  })
}


function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
