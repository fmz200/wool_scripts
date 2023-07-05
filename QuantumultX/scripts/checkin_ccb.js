/**
 * 建行生活 签到
 * https://yunbusiness.ccb.com/basic_service/txCtrl?txcode=A3341SB06
 * 抓取上方链接 header中的skey和整个请求的body
 * 5 8 * * * checkin_ccb.js
 */


const $ = new Env('建行生活');

const ccb_body = $prefs.valueForKey('fmz200_ccb_body');
const ccb_skey = $prefs.valueForKey('fmz200_ccb_skey');

let headers = {
  "Host": "yunbusiness.ccb.com",
  "Accept": "application/json,text/javascript,*/*",
  "Content-Type": "application/json;charset=UTF-8",
  "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/CloudMercWebView/UnionPay/1.0 CCBLoongPay",
}
let info = '';

ccb_life().then(r => console.log(`\n=== 账号签到结束 ===\n`));

async function ccb_life() {
  if (ccb_body && ccb_skey) {
    let bodyData = JSON.parse(ccb_body);
    headers['MBSKEY_INFO'] = ccb_skey;
    let pat1 = /CITYID=([0-9]+)/g;
    let pat2 = /USERCITYID=([0-9]+)/g;
    let cityId = pat1.exec(bodyData.ENCRYPT_MSG);
    let userCityId = pat2.exec(bodyData.ENCRYPT_MSG);

    console.log(`=== 开始账号签到===\n`);

    let param_link;
    await get_Param(cityId[1], userCityId[1]).then(function (data) {
      param_link = data;
    });

    delete headers['Content-Type'];
    delete headers['Accept'];
    delete headers['skey'];
    headers["Host"] = "fission-events.ccbft.com";

    let cookies;
    await get_Cookie(param_link).then(function (data) {
      cookies = data;
    });

    headers["X-XSRF-TOKEN"] = decodeURIComponent(cookies.token);
    headers["Cookie"] = "XSRF-TOKEN=" + cookies.token + ";_session=" + cookies.session;

    let sign_str;
    await get_Info().then(function (data) {
      sign_str = data
    });
    if (sign_str) {
      console.log("今日已签到！\n");
      $notify('建行生活签到', '今日已签到！', '');
      $done();
    } else {
      await sign();
    }
    $notify('建行生活签到', info, '');
  } else {
    $notify('建行生活签到', '签到失败：请先获取Cookie⚠️', '');
  }
  $done();
}

// 获取Param参数
function get_Param(t, b) {
  let url = `https://yunbusiness.ccb.com/basic_service/txCtrl?txcode=A3341SB06`;
  return new Promise(resolve => {
    $task.fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(ccb_body),
    }).then(function (response) {
      return response.json();
    }).then(function (body) {
      let tmp = "https://fission-events.ccbft.com/a/31/AZGlA939?ccbParamSJ=" + encodeURIComponent(body["data"]["ENCRYPTED_MSG"]) + `&cityid=${t}&CITYID=${t}&userCityId=${b}&USERCITYID=${b}`
      console.log("ParamSJ链接为：\n" + tmp + "\n\n")
      resolve(tmp)
    }).catch(function (e) {
      const error = '获取Param出现错误，请检查⚠️';
      console.log(error + '\n' + e);
    })
  });
}

//获取cookie和token
function get_Cookie(url) {
  return new Promise(resolve => {
    $task.fetch(url, {
      method: 'GET',
      headers: headers,
      redirect: 'manual',
    }).then(function (response) {
      let cookies = {};
      let tmp = response.headers.get('set-cookie');
      let pat1 = /_session=([\w%]+);/g;
      let pat2 = /XSRF-TOKEN=([\w%]+);/g;
      let session = pat1.exec(tmp);
      let token = pat2.exec(tmp);
      cookies.session = session[1];
      cookies.token = token[1];
      console.log("session参数为：\n" + cookies.session + "\ntoken参数为：\n" + cookies.token + "\n\n");
      ;
      resolve(cookies);
    }).catch(function (e) {
      const error = '获取cookie出现错误，请检查⚠️';
      console.log(error + '\n' + e);
    })
  });
}

// 查看是否已签过到
function get_Info() {
  let url = "https://fission-events.ccbft.com/activity/autographnew/info/31/LmqJbkZ6";
  let tmp;
  return new Promise(resolve => {
    $task.fetch(url, {
      method: 'GET',
      headers: headers,
    }).then(function (response) {
      return response.json();
    }).then(function (body) {
      if (body.message.includes("成功")) {
        tmp = body.data.today_is_register;
        console.log("今天是否已签过到：" + tmp + "\n");
      } else {
        console.log("get_Info: " + body);
      }
      resolve(tmp);
    }).catch(function (e) {
      const error = '获取Info出现错误，请检查⚠️';
      console.log(error + '\n' + e);
    })
  });
}

//签到
function sign() {
  let url = "https://fission-events.ccbft.com/activity/autographnew/register/31/LmqJbkZ6";
  return new Promise(resolve => {
    $task.fetch(url, {
      method: 'POST',
      headers: headers,
    }).then(function (response) {
      return response.json();
    }).then(function (body) {
      if (body.message.includes("成功")) {
        info += `已连续签到 ${body.data.continue_register_num}天\n`;
      } else {
        console.log(body);
      }
    }).catch(function (e) {
      const error = '签到出现错误，请检查⚠️';
      console.log(error + '\n' + e);
    }).finally(() => {
      resolve()
    })
  });
}

/*********************************** API *************************************/
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}isShadowrocket(){return"undefined"!=typeof $rocket}isStash(){return"undefined"!=typeof $environment&&$environment["stash-version"]}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,n]=i.split("@"),a={url:`http://${n}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),n=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(n);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){if(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)});else if(this.isQuanX())this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t&&t.error||"UndefinedError"));else if(this.isNode()){let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:i,statusCode:r,headers:o,rawBody:n}=t,a=s.decode(n,this.encoding);e(null,{status:i,statusCode:r,headers:o,rawBody:n,body:a},a)},t=>{const{message:i,response:r}=t;e(i,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)});else if(this.isQuanX())t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t&&t.error||"UndefinedError"));else if(this.isNode()){let i=require("iconv-lite");this.initGotEnv(t);const{url:r,...o}=t;this.got[s](r,o).then(t=>{const{statusCode:s,statusCode:r,headers:o,rawBody:n}=t,a=i.decode(n,this.encoding);e(null,{status:s,statusCode:r,headers:o,rawBody:n,body:a},a)},t=>{const{message:s,response:r}=t;e(s,r,r&&i.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}queryStr(t){let e="";for(const s in t){let i=t[s];null!=i&&""!==i&&("object"==typeof i&&(i=JSON.stringify(i)),e+=`${s}=${i}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,i=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":i}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),this.isSurge()||this.isQuanX()||this.isLoon()?$done(t):this.isNode()&&process.exit(1)}}(t,e)}
/*****************************************************************************/
