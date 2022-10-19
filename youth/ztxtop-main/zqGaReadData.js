/*
本脚本用于中青看点极速版获取阅读数据及刷阅读得青豆、刷阅读时长得奖励，仅适用NE工具，因为脚本中有持久化操作

注意：去重排序模式是为了优化刷阅读任务的效率（单个有效视频数据阅读次数上限大，将其排前面，在循环阅读时有更多机会执行；移除中青判断为重复的数据，让阅读数据首次执行时获得更高奖励及避免循环阅读时因达到上限无法获得奖励，浪费一次阅读时间间隔的执行机会）

中青看点数据抓取Loon插件地址（QX开启解析器时可使用）：根据@Sunert大佬的获取中青ck代码改版成支持多账号
https://raw.githubusercontent.com/ztxtop/x/main/rewrite-zq.plugin

中青看点阅读数据抓取Loon插件地址（QX开启解析器时可使用）：
https://raw.githubusercontent.com/ztxtop/x/main/rewrite-zqread.plugin

*/

const $ = new Env(`中青阅读打印`);
$.suffix = i => i > 0 ? i + 1 + '' : '';
$.nowTime = new Date().getTime();
$.isRewrite = 'undefined' !== typeof $request;
$.isResponse = 'undefined' !== typeof $response;
$.isTask = `undefined` === typeof $request;

let readtimeKey = `readtime_zq`; // 阅读时长数据key
let redKey = `red_zq`; // 惊喜红包数据key
let signKey = `youthheader_zq`; // 签到数据key
let mainKey = `read_zq`; // 阅读数据key
let numKey = `read_pre_num`; // 上条阅读数据序号
let countKey = `read_count`; // 阅读数据总记录数
let lastReplacedNo = `replaceable_idx`; // 最后一条视频数据序号

const myStatus = "HTTP/1.1 200 OK";
const myHeaders = {"Connection": "Close"};
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
let myData = [];
for (let acIdx of zqAc) {
for (let index = 0; index < $.zqCount; index++) {
  $.idx = $.suffix(acIdx-1);
  $.acName = $.name + ($.idx || '1');
  const count = ($.getval(countKey + $.idx) || 0) - 0;
  let data = printReadDataToLog(count);
  myData.push.apply(myData, data);
}

const myResponse = {
    status: myStatus,
    headers: myHeaders,
    body: myData.join('\n\n')
};
$done(myResponse);

function printReadDataToLog(count) {
  let allData = [];
  $.scheme = $.getval('zqReadScheme') || '';
  for (let i = 1; i <= count; i++) {
    const data = $.getval(mainKey + $.idx + '_' + i);
    if (data) {
      switch ($.scheme) {
        case 'QX': {
          allData.push(`$prefs.setValueForKey('${data}', '${mainKey+$.idx}_${i}');`);
          break;
        };
      case 'LS': {
        allData.push(`$persistentStore.write('${data}', '${mainKey+$.idx}_${i}');`);
        break;
      };
      case 'GA': {
        allData.push(data);
        break;
      };
      default: {
        if ($.isQuanX) {
          allData.push(`$prefs.setValueForKey('${data}', '${mainKey+$.idx}_${i}');`);
        } else {
          allData.push(`$persistentStore.write('${data}', '${mainKey+$.idx}_${i}');`);
        }
      }
      }
    }
  }
  if (allData.length > 0) {
    const videoNo = Math.max(0, ($.getval(lastReplacedNo + $.idx) || '0') - 0);
    const signVal = $.getval(signKey + $.idx) || '';
    const redVal = $.getval(redKey + $.idx) || '';
    const readtimeVal = $.getval(readtimeKey + $.idx) || '';
    switch ($.scheme) {
      case 'QX': {
        allData.push(`$prefs.setValueForKey('${videoNo}', '${lastReplacedNo+$.idx}');`);
        allData.push(`$prefs.setValueForKey('${count}', '${countKey+$.idx}');`);
        allData.push(`$prefs.setValueForKey('${signVal}', '${signKey+$.idx}');`);
        allData.push(`$prefs.setValueForKey('${redVal}', '${redKey+$.idx}');`);
        allData.push(`$prefs.setValueForKey('${readtimeVal}', '${readtimeKey+$.idx}');`);
        break;
      };
    case 'LS': {
      allData.push(`$persistentStore.write('${videoNo}', '${lastReplacedNo+$.idx}');`);
      allData.push(`$persistentStore.write('${count}', '${countKey+$.idx}');`);
      allData.push(`$persistentStore.write('${signVal}', '${signKey+$.idx}');`);
      allData.push(`$persistentStore.write('${redVal}', '${redKey+$.idx}');`);
      allData.push(`$persistentStore.write('${readtimeVal}', '${readtimeKey+$.idx}');`);
      break;
    };
    case 'GA': {
      allData = [allData.join('&')];
      break;
    };
    default: {
      if ($.isQuanX) {
        allData.push(`$prefs.setValueForKey('${videoNo}', '${lastReplacedNo+$.idx}');`);
        allData.push(`$prefs.setValueForKey('${count}', '${countKey+$.idx}');`);
        allData.push(`$prefs.setValueForKey('${signVal}', '${signKey+$.idx}');`);
        allData.push(`$prefs.setValueForKey('${redVal}', '${redKey+$.idx}');`);
        allData.push(`$prefs.setValueForKey('${readtimeVal}', '${readtimeKey+$.idx}');`);
      } else {
        allData.push(`$persistentStore.write('${videoNo}', '${lastReplacedNo+$.idx}');`);
        allData.push(`$persistentStore.write('${count}', '${countKey+$.idx}');`);
        allData.push(`$persistentStore.write('${signVal}', '${signKey+$.idx}');`);
        allData.push(`$persistentStore.write('${redVal}', '${redKey+$.idx}');`);
        allData.push(`$persistentStore.write('${readtimeVal}', '${readtimeKey+$.idx}');`);
      }
    }
    }
  } else {
    $.log('', `${$.acName}:【打印数据】暂无阅读数据`, '');
  }
  return allData;
}

// 公共tools
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}