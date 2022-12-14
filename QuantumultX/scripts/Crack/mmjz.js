/*
* ==UserScript==
* @ScriptName        喵喵记账
* @Author            Cuttlefish
* @TgChannel         https://t.me/ddgksf2021
* @WechatID          墨鱼手记
* @UpdateTime        20210106
* @Attention         因消息体被加密，故简化通知
* @ScriptFunction    自动化签到获取喵粮、喵饼、鱼干，及每天五次的免费抽奖
* @ScriptURL         https://github.com/ddgksf2013/Scripts/raw/master/mmjz.js
* ==/UserScript==

【QuantumultX】 :
*************************
[rewrite_local]
https://meow-api.sxyj.net/api/Member/SignNew url script-request-header https://github.com/ddgksf2013/Scripts/raw/master/mmjz.js
[task_local]
15 7,15 * * * https://github.com/ddgksf2013/Scripts/raw/master/mmjz.js, tag=喵喵记账, img-url=https://github.com/ddgksf2013/Icon/raw/master/mmjz.png
*************************
【Loon】 :
*************************
[Script]
http-request https://meow-api.sxyj.net/api/Member/SignNew tag=喵喵记账Cookie, script-path=https://github.com/ddgksf2013/Scripts/raw/master/mmjz.js
cron "15 7,15 * * *" script-path=https://github.com/ddgksf2013/Scripts/raw/master/mmjz.js,tag=喵喵记账
*************************
【Surge】 :
*************************
[Script]
喵喵记账 = type=cron,cronexp="15 7,15 * * *",wake-system=1,timeout=120,script-path=https://github.com/ddgksf2013/Scripts/raw/master/mmjz.js
喵喵记账Cookie = type=http-request,pattern=https://meow-api.sxyj.net/api/Member/SignNew,script-path=https://github.com/ddgksf2013/Scripts/raw/master/mmjz.js
*************************
【小火箭】 :
*************************
[Script]
喵喵记账 = type=cron,script-path=https://github.com/ddgksf2013/Scripts/raw/master/mmjz.js, cronexpr="15 7,15 * * *", timeout=500, enable=true
喵喵记账Cookie = type=http-request,pattern=https://meow-api.sxyj.net/api/Member/SignNew,script-path=https://github.com/ddgksf2013/Scripts/raw/master/mmjz.js
*************************

[mitm]
hostname = meow-api.sxyj.net
*/


const $ = new Env("喵喵记账")
$.signKey = 'mmjz_userSignKey'

const body1 = `--mm_form_data_boundry
Content-Disposition:form-data;name="data"


--mm_form_data_boundry--`;

const body2 = `--Boundary+3C32A25CD7B91891
Content-Disposition: form-data; name="data"

RhBkKP769IGwWZxwMPUTcb0doII2KcAQtv9iqDfZONEHoE5lXSqQj/UmpgBGEMcf
--Boundary+3C32A25CD7B91891--
`;

const body3 = `--Boundary+0E2797135A0E7AB4
Content-Disposition: form-data; name="data"


--Boundary+0E2797135A0E7AB4--
`;

const body4 = `--Boundary+C2D35AE88A556F10
Content-Disposition: form-data; name="data"

ittS2ZZh4ruOGvAUUZl+ehJqYol0q3NlaGn0hkBPj0fXHPTAltsrsMCjX4xBahDm
--Boundary+C2D35AE88A556F10--
`;
const body5 = `--Boundary+3851900AAA43A61A
Content-Disposition: form-data; name="data"

N0b/niwcPG2AjZpD1H0gBCMQomga8W+WTFjbeT8TYomJFybdtcJu0+60rjXiGJn/
--Boundary+3851900AAA43A61A--
`;


let isGetCookie = typeof $request !== 'undefined'

if (isGetCookie) {
  !(async () => {
    const session = {}
    session.url = $request.url;
    session.headers = $request.headers;
    if ($.setdata(JSON.stringify(session), $.signKey)) {
      $.subt = `获取会话: 成功!`
    } else {
      $.subt = `获取会话: 失败!`
    }
    $.msg($.name, $.subt, '')
  })()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
} else {
 !(async () => {
    await execSignin();
    await execDouble();
    await execGetfish();
    await execGetfish();
    await execGetfish();
    await execReward();
    await execReward4();
    await execReward4();
    await execReward4();
    await execReward4();
    await execShowmsg();
    
  })()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
}

function execSignin() {
  return new Promise((resolve) => {
    signheaders = JSON.parse($.getdata($.signKey)).headers;
    
    const url = { 
       url: 'https://meow-api.sxyj.net/api/Member/SignNew',
       headers: {
            'Accept-Encoding' : `gzip`,
			'Connection' : `close`,
			'Content-Type' : `multipart/form-data;boundary=mm_form_data_boundry`,
			'Host' : `meow-api.sxyj.net`,
			'User-Agent' : `喵喵记账 1.1.2 rv:2020060302 (iPhone; iOS 13.4.1; zh-Hans_HK)`,
			'cp' : signheaders.cp
    	},
       body: body1
	}
	//console.log(JSON.stringify(url));
    $.post(url,(err, resp, data)=> { 
      try {
        console.log(data);
        signStatus = resp.statusCode
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    })
  })
}
function execDouble() {
  return new Promise((resolve) => {
    signheaders = JSON.parse($.getdata($.signKey)).headers;
    
    const url = { 
       url: 'https://meow-api.sxyj.net/api/Member/SignNewest',
       headers: {
            'Accept' : `*/*`,
			'Accept-Encoding' : `gzip, deflate, br`,
			'Connection' : `keep-alive`,
			'Content-Type' : `multipart/form-data; boundary=Boundary+3C32A25CD7B91891`,
			'Host' : `meow-api.sxyj.net`,
			'User-Agent' : `%E5%96%B5%E5%96%B5%E8%AE%B0%E8%B4%A6/2020120702 CFNetwork/1125.2 Darwin/19.4.0`,
			'Accept-Language' : `en-us`,
			'cp' : signheaders.cp
    	},
       body: body2
	}
	//console.log(JSON.stringify(url));
    $.post(url,(err, resp, data)=> { 
      try {
        console.log(data);
        signStatus = resp.statusCode
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    })
  })
}
function execGetfish() {
  return new Promise((resolve) => {
    signheaders = JSON.parse($.getdata($.signKey)).headers;
    
    const url = { 
       url: 'https://meow-api.sxyj.net/api/Member/ReceiveDriedFish',
       headers: {
            'Accept' : `*/*`,
			'Accept-Encoding' : `gzip, deflate, br`,
			'Connection' : `keep-alive`,
			'Content-Type' : `multipart/form-data; boundary=Boundary+0E2797135A0E7AB4`,
			'Host' : `meow-api.sxyj.net`,
			'User-Agent' : `%E5%96%B5%E5%96%B5%E8%AE%B0%E8%B4%A6/2020122101 CFNetwork/1125.2 Darwin/19.4.0`,
			'Accept-Language' : `en-us`,
			'cp' : signheaders.cp
    	},
       body: body3
	}
	//console.log(JSON.stringify(url));
    $.post(url,(err, resp, data)=> { 
      try {
        console.log(data);
        signStatus = resp.statusCode
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    })
  })
}
function execReward() {
  return new Promise((resolve) => {
    signheaders = JSON.parse($.getdata($.signKey)).headers;
    
    const url = { 
       url: 'https://meow-api.sxyj.net//api/Game/Accept',
       headers: {
            'Accept' : `*/*`,
			'Accept-Encoding' : `gzip, deflate, br`,
			'Connection' : `keep-alive`,
			'Content-Type' : `multipart/form-data; boundary=Boundary+C2D35AE88A556F10`,
			'Host' : `meow-api.sxyj.net`,
			'User-Agent' : `%E5%96%B5%E5%96%B5%E8%AE%B0%E8%B4%A6/2020122101 CFNetwork/1125.2 Darwin/19.4.0`,
			'Accept-Language' : `en-us`,
			'cp' : signheaders.cp
    	},
       body: body4
	}
	//console.log(JSON.stringify(url));
    $.post(url,(err, resp, data)=> { 
      try {
        console.log(data);
        signStatus = resp.statusCode
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    })
  })
}
function execReward4() {
  return new Promise((resolve) => {
    signheaders = JSON.parse($.getdata($.signKey)).headers;
    
    const url = { 
       url: 'https://meow-api.sxyj.net//api/Game/Accept',
       headers: {
            'Accept' : `*/*`,
			'Accept-Encoding' : `gzip, deflate, br`,
			'Connection' : `keep-alive`,
			'Content-Type' : `multipart/form-data; boundary=Boundary+3851900AAA43A61A`,
			'Host' : `meow-api.sxyj.net`,
			'User-Agent' : `%E5%96%B5%E5%96%B5%E8%AE%B0%E8%B4%A6/2020122101 CFNetwork/1125.2 Darwin/19.4.0`,
			'Accept-Language' : `en-us`,
			'cp' : signheaders.cp
    	},
       body: body5
	}
	//console.log(JSON.stringify(url));
    $.post(url,(err, resp, data)=> { 
      try {
        console.log(data);
        signStatus = resp.statusCode
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    })
  })
}
function execShowmsg() {
//console.log($.signBody);
  return new Promise((resolve) => {
  	$.subt='签到成功！'
    $.msg($.name, $.subt,);
    resolve()
  })
}



// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
