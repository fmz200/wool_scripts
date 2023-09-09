/*
 * 脚本作用：获取应用的cookie或token
 * 更新时间：2023-09-09 13:23:13
 */

/**
 * 脚本作用：什么值得买，手机APP进入我的页面查看个人资料，即可获取cookie
 * 更新时间：2023.06.06 12:30
 */
const smzdm = {
  url: "user-api.smzdm.com/users/info",
  msg: "什么值得买"
};

/**
 * 脚本作用：拼多多果园获取token
 * 重写地址：暂时没有确定具体是那个请求URL会携带token，因为每次手动抓包获取token的url都不一样
 * 触发类型：request-header
 * 获取方式：小程序或APP进果园逛一圈+浇水，在请求头request-header中搜索PDDAccessToken
 * 注意事项：每次脚本获取会覆盖之前的ck，暂时不支持脚本获取多个token，建议手动抓取然后填到boxjs里面，多账号用@隔开：tk1@tk2
 * 更新时间：2023.01.07 12:30
 */
const pdd_orchard = {
  url: "m.pinduoduo.net/proxy/api/api/server/_stm",
  msg: "拼多多果园"
};

/**
 * 脚本作用：美团获取token
 * 触发类型：request-header
 * 获取方式：点击“我的”-“个人头像”，在请求头request-header中搜索token
 * 更新时间：2023.09.07 17:30
 */
const meituan = {
  url: "/user/v1/info/audit",
  msg: "美团获取token"
};

////////////////////////////////
const $ = new API("获取Cookie或Token通用脚本");
const current_url = `${$request.url}`;
console.log(`当前请求的url: ${current_url}`);
const current_headers = $request.headers;
// 遍历头部对象并打印每个字段和值
for (const headerField in current_headers) {
  console.log("遍历头部对象并打印每个字段和值开始❇️");
  console.log(`${headerField}: ${current_headers[headerField]}`);
  console.log("遍历头部对象并打印每个字段和值结束🔴");
}

try {
  getCookieORToken();
} catch (e) {
  console.log('脚本运行出现错误，错误信息：' + e.message);
}
$done();
////////////////////////////////

function getCookieORToken() {
  // 什么值得买
  if (current_url.includes(smzdm.url)) {
    const cookie = current_headers['Cookie'] || current_headers['cookie'];
    $.write(cookie, '#SMZDM_COOKIE');
    $.notify(smzdm.msg + '获取cookie成功✅', cookie, cookie);
    console.log(smzdm.msg + '获取到的ck为：' + cookie);
  }

  // 拼多多果园获取token，暂时不确定哪个URL会携带PDDAccessToken
  // Cookie: pdd_vds=xxx; ETag=dKJLmoeS; PDDAccessToken=12HUHDUW; install_token=118E4FCA;
  if (current_url.includes(pdd_orchard.url)) {
    const cookieValue = current_headers["Cookie"] || current_headers["cookie"];
    const token = cookieValue.match(/PDDAccessToken=.+?/);
    if (token) {
      $.write(token, '#ddgyck');
      $.notify(pdd_orchard.msg + 'token获取成功', token, token);
      console.log(pdd_orchard.msg + '获取到的ck为：' + token);
    }
  }

  // 美团
  if (current_url.includes(meituan.url)) {
    console.log(meituan.msg + '开始');
    const token = current_headers['token'] || current_headers['Token'];
    $.write(token, '#meituanCookie');
    $.notify(meituan.msg + '获取成功✅', token, token);
    console.log(meituan.msg + '获取到的内容为：' + token);
  }
}

function ENV(){const isQX=typeof $task!=="undefined";const isLoon=typeof $loon!=="undefined";const isSurge=typeof $httpClient!=="undefined"&&!isLoon;const isJSBox=typeof require=="function"&&typeof $jsbox!="undefined";const isNode=typeof require=="function"&&!isJSBox;const isRequest=typeof $request!=="undefined";const isScriptable=typeof importModule!=="undefined";return{isQX,isLoon,isSurge,isNode,isJSBox,isRequest,isScriptable}}
// prettier-ignore
function HTTP(baseURL,defaultOptions={}){const{isQX,isLoon,isSurge,isScriptable,isNode}=ENV();const methods=["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"];function send(method,options){options=typeof options==="string"?{url:options}:options;options.url=baseURL?baseURL+options.url:options.url;options={...defaultOptions,...options};const timeout=options.timeout;const events={...{onRequest:()=>{},onResponse:(resp)=>resp,onTimeout:()=>{},},...options.events,};events.onRequest(method,options);let worker;if(isQX){worker=$task.fetch({method,...options})}else if(isLoon||isSurge||isNode){worker=new Promise((resolve,reject)=>{const request=isNode?require("request"):$httpClient;request[method.toLowerCase()](options,(err,response,body)=>{if(err)reject(err);else resolve({statusCode:response.status||response.statusCode,headers:response.headers,body,})})})}else if(isScriptable){const request=new Request(options.url);request.method=method;request.headers=options.headers;request.body=options.body;worker=new Promise((resolve,reject)=>{request.loadString().then((body)=>{resolve({statusCode:request.response.statusCode,headers:request.response.headers,body,})}).catch((err)=>reject(err))})}let timeoutid;const timer=timeout?new Promise((_,reject)=>{timeoutid=setTimeout(()=>{events.onTimeout();return reject(`${method}URL:${options.url}exceeds the timeout ${timeout}ms`)},timeout)}):null;return(timer?Promise.race([timer,worker]).then((res)=>{clearTimeout(timeoutid);return res}):worker).then((resp)=>events.onResponse(resp))}const http={};methods.forEach((method)=>(http[method.toLowerCase()]=(options)=>send(method,options)));return http}
// prettier-ignore
function API(name="untitled",debug=false){const{isQX,isLoon,isSurge,isNode,isJSBox,isScriptable}=ENV();return new(class{constructor(name,debug){this.name=name;this.debug=debug;this.http=HTTP();this.env=ENV();this.node=(()=>{if(isNode){const fs=require("fs");return{fs}}else{return null}})();this.initCache();const delay=(t,v)=>new Promise(function(resolve){setTimeout(resolve.bind(null,v),t)});Promise.prototype.delay=function(t){return this.then(function(v){return delay(t,v)})}}initCache(){if(isQX)this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}");if(isLoon||isSurge)this.cache=JSON.parse($persistentStore.read(this.name)||"{}");if(isNode){let fpath="root.json";if(!this.node.fs.existsSync(fpath)){this.node.fs.writeFileSync(fpath,JSON.stringify({}),{flag:"wx"},(err)=>console.log(err))}this.root={};fpath=`${this.name}.json`;if(!this.node.fs.existsSync(fpath)){this.node.fs.writeFileSync(fpath,JSON.stringify({}),{flag:"wx"},(err)=>console.log(err));this.cache={}}else{this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`))}}}persistCache(){const data=JSON.stringify(this.cache);if(isQX)$prefs.setValueForKey(data,this.name);if(isLoon||isSurge)$persistentStore.write(data,this.name);if(isNode){this.node.fs.writeFileSync(`${this.name}.json`,data,{flag:"w"},(err)=>console.log(err));this.node.fs.writeFileSync("root.json",JSON.stringify(this.root),{flag:"w"},(err)=>console.log(err))}}write(data,key){this.log(`SET ${key}`);if(key.indexOf("#")!==-1){key=key.substr(1);if(isSurge||isLoon){return $persistentStore.write(data,key)}if(isQX){return $prefs.setValueForKey(data,key)}if(isNode){this.root[key]=data}}else{this.cache[key]=data}this.persistCache()}read(key){this.log(`READ ${key}`);if(key.indexOf("#")!==-1){key=key.substr(1);if(isSurge||isLoon){return $persistentStore.read(key)}if(isQX){return $prefs.valueForKey(key)}if(isNode){return this.root[key]}}else{return this.cache[key]}}delete(key){this.log(`DELETE ${key}`);if(key.indexOf("#")!==-1){key=key.substr(1);if(isSurge||isLoon){$persistentStore.write(null,key)}if(isQX){$prefs.removeValueForKey(key)}if(isNode){delete this.root[key]}}else{delete this.cache[key]}this.persistCache()}notify(title,subtitle="",content="",options={}){const openURL=options["open-url"];const mediaURL=options["media-url"];if(isQX)$notify(title,subtitle,content,options);if(isSurge){$notification.post(title,subtitle,content+`${mediaURL?"\n多媒体:"+mediaURL:""}`,{url:openURL})}if(isLoon){let opts={};if(openURL)opts["openUrl"]=openURL;if(mediaURL)opts["mediaUrl"]=mediaURL;if(JSON.stringify(opts)=="{}"){$notification.post(title,subtitle,content)}else{$notification.post(title,subtitle,content,opts)}}if(isNode||isScriptable){const content_=content+(openURL?`\n点击跳转:${openURL}`:"")+(mediaURL?`\n多媒体:${mediaURL}`:"");if(isJSBox){const push=require("push");push.schedule({title:title,body:(subtitle?subtitle+"\n":"")+content_,})}else{console.log(`${title}\n${subtitle}\n${content_}\n\n`)}}}log(msg){if(this.debug)console.log(msg)}info(msg){console.log(msg)}error(msg){console.log("ERROR: "+msg)}wait(millisec){return new Promise((resolve)=>setTimeout(resolve,millisec))}done(value={}){if(isQX||isLoon||isSurge){$done(value)}else if(isNode&&!isJSBox){if(typeof $context!=="undefined"){$context.headers=value.headers;$context.statusCode=value.statusCode;$context.body=value.body}}}})(name,debug)}
