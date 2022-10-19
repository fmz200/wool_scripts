/*

京东Cookie：
  hostname = wq.jd.com, un.m.jd.com, api.m.jd.com
  
  微信访问含有会员机制的京东自营店会员页面
  ^https?://wq\.jd\.com/pinbind/pintokenredirect url script-request-header NE.cookie.js
  访问京东APP内嵌了H5页面：后台杀京东APP后再进入或进首页的免费水果都可获取
  ^https?://un\.m\.jd\.com/cgi-bin/app/appjmp url script-request-header NE.cookie.js

  复制 https://bean.m.jd.com/bean/signIndex.action 或 https://home.m.jd.com/myJd/newhome.action 地址到浏览器打开，登录后可自动获取Cookie，没成功就登录后再次访问下之前复制的地址
  ^https?://api\.m\.jd\.com/client\.action\?functionId=(signBeanIndex|signBeanGroupStageIndex|trade_config) url script-request-header NE.cookie.js

快手Cookie：
  hostname = nebula.kuaishou.com, *.gifshow.com, *.ksapisrv.com

  访问快手极速版签到日历页面
  ^https?://nebula\.kuaishou\.com/rest/n/nebula/sign/query url script-request-header NE.cookie.js

  点金币收益/积分收益/现金收益去访问我的收益页面时获取cookie数据
  ^https://nebula\.kuaishou\.com/rest/n/nebula/account/overview url script-request-header NE.cookie.js
  ^https://zt\.gifshow\.com/rest/zt/encourage/account/summary/withKscoinTrial url script-request-header NE.cookie.js
  
*/

const $ = new Env(`Cookie采集器`);
$.suffix = i => i > 0 ? i + 1 + '' : '';
$.nowTime = new Date().getTime();
$.isRewrite = 'undefined' !== typeof $request;
$.isResponse = 'undefined' !== typeof $response;
$.isTask = `undefined` === typeof $request;

!(async () => {
  if ($.isRewrite && $request.method != 'OPTIONS') {
    if ($request.url.match(/^https?:\/\/(wq|api\.m|un\.m)\.jd\.com/)) {
      await GetJDCookie('京东Cookie');
    } else if ($request.url.match(/^https?:\/\/nebula\.kuaishou\.com/) || $request.url.match(/^https?:\/\/.+?\.(gifshow|ksapisrv)\.com/)) {
      await GetKSCookie('快手Cookie');
    }
  } else if ($.isTask) {
    // 整理京东Cookie
    let ckArr = [$.getdata('CookieJD'), $.getdata('CookieJD2')];
    let oldCks = $.getjson('CookiesJD', []);
    oldCks.forEach(item => ckArr.push(item.cookie));
    let result = layOutCookie(ckArr, /pt_pin=(.+?);/);
    if (result < 0) {
      $.msg($.name, '京东Cookie', `整理操作失败`)
    } else if (result > 0) {
      // 持久化整理更新
      const newCks = [];
      for (let i = 0, len = ckArr.length - 1; i <= len; i++) {
        newCks.push({
          userName: decodeURIComponent(ckArr[i].match(/pt_pin=(.+?);/)[1]),
          cookie: ckArr[i]
        });
      }
      for (let i = 0; i < 2; i++) {
        let ck = '';
        if (newCks.length > 0) {
          ck = newCks[0];
          newCks.splice(0, 1);
        }
        $.setdata(ck, `CookieJD${$.suffix(i)}`);
      }
      $.setdata(JSON.stringify(newCks, null, 2), 'CookiesJD');
    }

    // 整理快手Cookie
    ckArr = [$.getdata('cookie_ks') || ''];
    oldCks = $.getjson('cookies_ks', []);
    oldCks.forEach(cookie => ckArr.push(cookie));
    result = layOutCookie(ckArr, /userId=(.+?);/);
    if (result < 0) {
      $.msg($.name, '快手Cookie', `整理操作失败`)
    } else if (result > 0) {
      // 持久化整理更新
      let ck = '';
      if (ckArr.length > 0) {
        ck = ckArr[0];
        ckArr.splice(0, 1);
      }
      $.setdata(ck, 'cookie_ks');
      $.setdata(JSON.stringify(ckArr, null, 2), 'cookies_ks');
    }
    $.log('Cookie 整理操作完成');
  }
})().catch((e) => $.logErr(e)).finally(() => $.done());

function GetJDCookie(appName) {
  // 京东
  return new Promise(resolve => {
    try {
      if ($request.headers) {
        let acObj = {};
        // 提取ck数据
        let ck = ($request.headers['Cookie'] || $request.headers['cookie'] || '').replace(/ /g, '');
        let ckItems = ck.split(';').filter(s => /^(pt_key|pt_pin)=.+/.test(s)).sort();
        if (ckItems.length == 2) {
          acObj.cookie = ckItems.join(';') + ';';
          acObj.userName = decodeURIComponent(acObj.cookie.match(/pt_pin=(.+?);/)[1]);
        }
        // 无cookie数据进行提示，有ck数据，找到账号位进行存储
        if (!acObj.cookie) {
          $.msg($.name, appName, '获取失败，请检查命中的请求url是否正确');
        } else {
          const ckArr = [$.getdata('CookieJD'), $.getdata('CookieJD2')];
          const oldCks = $.getjson('CookiesJD', []);
          oldCks.forEach(item => ckArr.push(item.cookie));
          let [status, seatNo] = chooseSeatNo(acObj.cookie, ckArr, /pt_pin=(.+?);/);
          if (status) {
            if (status > 0) {
              let wt = '';
              if (seatNo < 2) {
                wt = $.setdata(acObj.cookie, `CookieJD${$.suffix(seatNo)}`);
              } else {
                if (oldCks.length <= seatNo - 2) {
                  oldCks.push(acObj);
                } else {
                  oldCks[seatNo - 2] = acObj;
                }
                wt = $.setdata(JSON.stringify(oldCks, null, 2), 'CookiesJD');
              }
              $.msg($.name, `${appName} ${seatNo+1}: ${acObj.userName}`, `${status==1?'新增':'更新'}京东Cookie${wt?`成功 🎉`:`失败 ‼️`}`);
            } else {
              $.log($.name, `${appName} ${seatNo+1}: ${acObj.userName}`, 'Cookie数据已存在，跳过处理');
            }
          }
        }
      }
    } catch (e) {
      $.msg($.name, `${appName}获取异常`, `原因: ${e}`);
    } finally {
      resolve();
    }
  });
}

function chooseSeatNo(newCk, allCk, reg) {
  // status-获取操作状态-0:异常、1-新增、2-更新、-1-相同 seatNo-存储位置，默认添加到最后面
  let [status, seatNo] = [1, allCk.length];
  try {
    let newId = ((newCk || '').match(reg) || ['', ''])[1];
    for (let i = 0, len = allCk.length; i < len; i++) {
      let oldId = ((allCk[i] || '').match(reg) || ['', ''])[1];
      if (oldId) {
        // 账号位数据存在，判断是否为当前账号的数据，不是则跳过，否则设置数据并跳出循环
        if (oldId == newId) {
          seatNo = i;
          status = newCk == allCk[i] ? -1 : 2;
          break;
        }
      } else if (seatNo == len) {
        // 旧cookie无效且在初始账号位，先标记新cookie数据存储于此位置
        seatNo = i;
        status = 1;
      }
    }
  } catch (e) {
    // 异常时，不操作cookie
    status = 0;
    $.logErr(e);
  }
  return [status, seatNo];
}

function layOutCookie(oldCks, reg) {
  let result = 0;
  try {
    let keepIdx = [],
      removeIdx = [];
    for (let i = 0, len = oldCks.length; i < len; i++) {
      let oldId = ((oldCks[i] || '').match(reg) || ['', ''])[1];
      if (!oldId || keepIdx.includes(oldId)) {
        // 数据无效或账号已存在，需移除
        removeIdx.push(i);
      } else {
        keepIdx.push(oldId);
      }
    }
    for (let i = oldCks.length - 1; i >= 0; i--) {
      if (removeIdx.includes(i)) {
        oldCks.splice(i, 1);
        result = 1;
      }
    }
  } catch (e) {
    result = -1;
    $.logErr(e);
  }
  return result;
}

function GetKSCookie(appName) {
  // 快手
  return new Promise(resolve => {
    try {
      if ($request.headers) {
        let acObj = {};
        let ck = ($request.headers['Cookie'] || $request.headers['cookie'] || '').replace(/ /g, '');
        let ckItems = ck.split(';').filter(s => /^(client_key|kpf|kpn|kuaishou.api_st|userId|token)=.+/.test(s)).sort().reverse();
        let newCk = '';
        if (ckItems.includes('kpn=NEBULA') && ckItems.length >= 5) {
          // 极速版
          newCk = ckItems.filter(s => !/^token=/.test(s)).join('; ') + ';';
        } else if (ckItems.includes('kpn=KUAISHOU') && ckItems.length == 6) {
          // 官方版
          newCk = ckItems.join('; ') + ';';
        }
        // 无cookie数据进行提示，有cookie数据，则找到账号位进行存储
        if (!newCk) {
          $.msg($.name, appName, 'Cookie获取失败，请检查命中的请求url是否正确');
        } else {
          acObj.userId = (newCk.match(/userId=(.+?);/) || ['', ''])[1];
          acObj.cookie = newCk;
          const ckArr = [$.getdata('cookie_ks') || ''];
          const oldCks = $.getjson('cookies_ks', []);
          oldCks.forEach(cookie => ckArr.push(cookie));
          let [status, seatNo] = chooseSeatNo(acObj.cookie, ckArr, /userId=(.+?);/);
          if (status) {
            if (status > 0) {
              let wt = '';
              if (seatNo == 0) {
                wt = $.setdata(acObj.cookie, 'cookie_ks');
              } else {
                if (oldCks.length <= seatNo - 1) {
                  oldCks.push(acObj);
                } else {
                  oldCks[seatNo - 1] = acObj;
                }
                wt = $.setdata(JSON.stringify(oldCks, null, 2), 'cookies_ks');
              }
              $.msg($.name, `${appName} ${seatNo+1}: ${acObj.userId}`, `${status==1?'新增':'更新'}快手Cookie${wt?`成功 🎉`:`失败 ‼️`}`);
            } else {
              $.log($.name, `${appName} ${seatNo+1}: ${acObj.userId}`, 'Cookie数据已存在，跳过处理');
            }
          }
        }
      }
    } catch (e) {
      $.msg($.name, `${appName}获取异常`, `原因: ${e}`);
    } finally {
      resolve();
    }
  });
}

function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}

