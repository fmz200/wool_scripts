/**
 * @author fmz200
 * @function 获取应用的cookie或token通用脚本
 * @date 2024-03-30 10:30:00
 */

////////////////////////////////
const $ = new API("获取Cookie或Token通用脚本");
const req_url = $request.url;
const req_headers = $request.headers;
const req_body = $request.body;
let rsp_body = "{}";
// 检查 $response 是否已定义
if (typeof $response !== 'undefined' && $response !== null) {
  // 如果 $response 已定义且不为 null，则使用 $response.body
  rsp_body = $response.body;
}

// 遍历头部对象并打印每个字段和值
console.log("遍历头部对象并打印每个字段和值开始❇️");
for (const headerField in req_headers) {
  console.log(`${headerField}: ${req_headers[headerField]}`);
}
console.log("遍历头部对象并打印每个字段和值结束🍓");

try {
  /**
   * 什么值得买
   * 手机APP进入我的页面查看个人资料，即可获取cookie
   * @keyword SMZDM_COOKIE
   * @keyword fmz200_smzdm_cookie
   */
  if (req_url.includes("/user-api.smzdm.com/users/info")) {
    const cookie = req_headers['Cookie'] || req_headers['cookie'];
    // 使用正则表达式匹配smzdm_id=数字 的模式
    let regex = /smzdm_id=(\d+)/;
    // 执行正则表达式匹配
    let match = cookie.match(regex);
    // 匹配结果存储在数组的第二个元素中
    let smzdm_id = match ? match[1] : "";
    console.log(smzdm_id + "获取到获取到数据：" + cookie);

    let cache = $.read("#fmz200_smzdm_cookie") || "[]";
    console.log("读取缓存数据：" + cache);
    let json_data = JSON.parse(cache);
    updateOrAddObject(json_data, "smzdm_id", smzdm_id, "cookie", cookie);
    const cacheValue = JSON.stringify(json_data, null, "\t");

    $.write(cookie, '#SMZDM_COOKIE');
    $.write(cacheValue, '#fmz200_smzdm_cookie');
    $.notify('什么值得买 获取cookie成功✅', "", cookie);
    console.log('什么值得买 获取到的ck为：' + cookie);
  }

  /**
   * 拼多多果园
   * 小程序或APP进果园逛一圈+浇水，在请求头request-header中搜索PDDAccessToken, 多账号用@隔开：tk1@tk2
   * Cookie: pdd_vds=xxx; ETag=dKJLmoeS; PDDAccessToken=12HUHDUW; install_token=118E4FCA;
   * @keyword ddgyck
   * @keyword fmz200_pdd_token
   */
  if (req_url.includes("/proxy/api/api/server/_stm")) {
    const cookieValue = req_headers["Cookie"] || req_headers["cookie"];
    const token = cookieValue.match(/PDDAccessToken=.+?/);
    if (token) {
      $.write(token, '#ddgyck');
      $.write(token, '#fmz200_pdd_token');
      $.notify('拼多多果园 token获取成功', token, token);
      console.log('拼多多果园 获取到的ck为：' + token);
    }
  }

  /**
   * 美团获取token
   * 点击“我的”-“个人头像”-"完善资料"，在请求头request-header中搜索token
   * @keyword meituanCookie
   * @keyword fmz200_meituan_cookie
   */
  if (req_url.includes("/user/v1/info/auditting") || req_url.includes("/mapi/usercenter")) {
    console.log('美团获取token 开始');
    const token = req_headers['token'] || req_headers['Token'];
    if (!token) {
      $.done();
    }
    console.log("获取到token：" + token);
    $.write(token, '#meituanCookie');
    $.notify('美团获取token成功✅', "单账号更新成功，多账号更新中", token);
    
    console.log("开始更新多账号");
    let data = JSON.parse(rsp_body);
    if (data.user) {
      let uid = data.user.id;
      let username = data.user.username;
      console.log(`获取到uid：${uid}，username：${username}`);
      
      let cache = $.read("#fmz200_meituan_cookie") || "[]";
      console.log("读取缓存数据：" + cache);
      
      let json_data = JSON.parse(cache);
      updateOrAddObject(json_data, "meituan_id", uid, "username", username, "token", token);
      const cacheValue = JSON.stringify(json_data, null, "\t");

      $.write(cacheValue, '#fmz200_meituan_cookie');
      $.notify('美团多账号更新token成功✅', "", "");
    }
  }

  /**
   * 微博获取cookie
   * 打开APP不定时获取
   * https://api.weibo.cn/2/users/show
   * @keyword fmz200_weibo_token
   */
  if (req_url.includes("/users/show")) {
    console.log('微博获取cookie 开始');
    console.log('获取到的内容为：' + req_url);
    // 使用正则表达式匹配uid参数值
    let uidPattern = /uid=(\d+)/;
    let match = req_url.match(uidPattern);

    // 如果匹配到uid参数值，则提取出来并打印
    if (match) {
      let uid = match[1];
      console.log("获取到以下账号的数据："+ uid);
      let cache = $.read("#fmz200_weibo_token") || "[]";
      console.log("读取缓存数据：" + cache);

      let json_data = JSON.parse(cache);
      updateOrAddObject(json_data, "weibo_id", uid, "signin_url", req_url);
      const cacheValue = JSON.stringify(json_data, null, "\t");
      
      $.write(cacheValue, '#fmz200_weibo_token');
      $.notify('微博获取cookie 成功✅', "你可以在日志中查看本次获取的数据", "");
    } else {
      console.log("No uid found in the URL.");
      $.notify('微博获取cookie 未获取到UID❗️', "你可以在日志中查看本次获取的数据", "");
    }
  }

  /**
   * 顺丰速运
   * 打开小程序或APP-我的-积分, 捉以下几种url之一,把整个url放到变量 sfsyUrl 里,多账号换行分割
   * @keyword sfsyBee
   * @keyword fmz200_sf_bee
   */
  if (req_url.includes("/mcs-mimp/share/weChat/shareGiftReceiveRedirect") || req_url.includes("/mcs-mimp/share/app/shareRedirect")) {
    console.log('顺丰速运 开始');
    $.write(req_url, '#sfsyBee');
    $.write(req_url, '#fmz200_sf_bee');
    $.notify('顺丰速运 获取成功✅', req_url, req_url);
    console.log('顺丰速运 获取到的内容为：' + req_url);
  }

  /**
   * 滴滴获取token
   *
   * @keyword ddgyToken 多账号换行或者@隔开，格式uid&token。uid不可随便填，根据uid更新数据
   * @keyword fmz200_didi_fruit 多账号换行或者@隔开，格式uid&token。uid不可随便填，根据uid更新数据
   */
  if (req_url.includes("/api/game/plant/enter")) {
    console.log('滴滴果园token 开始');
    let data = JSON.parse(req_body);
    let uid = data.uid;
    let newToken = data.token;
    console.log(uid + "获取到token：" + newToken);

    let cache = $.read("#fmz200_didi_fruit") || "{}";
    $.log("读取缓存数据：" + cache);
    let json_data = parseDataString(cache);
    updateToken(uid, newToken, json_data);
    let string_data = convertDataToString(json_data);

    $.write(string_data, '#ddgyToken');
    $.write(string_data, '#fmz200_didi_fruit');
    $.notify('滴滴果园token 获取成功✅', string_data, string_data);
    console.log('滴滴果园token 获取到的内容为：' + string_data);
  }

  /**
   * 滴滴打车
   *
   * @keyword fmz200_didi_ticket 多账号换行或者@隔开，格式uid&token。uid不可随便填，根据uid更新数据
   */
  if (req_url.includes("/login/v5/signInByOpenid")) {
    console.log('滴滴打车 开始');
    let data = JSON.parse(rsp_body);
    let uid = data.uid;
    let ticket = data.ticket;
    console.log(uid + "获取到ticket：" + ticket);

    let cache = $.read("#fmz200_didi_ticket") || "";
    $.log("读取缓存数据：" + cache);
    let json_data = parseDataString(cache);
    updateToken(uid, ticket, json_data);
    let string_data = convertDataToString(json_data);

    $.write(string_data, '#fmz200_didi_ticket');
    $.notify('滴滴打车 获取成功✅', string_data, string_data);
    console.log('滴滴打车 获取到的内容为：' + string_data);
  }

  /**
   * 晓晓优选 获取cookie
   *
   * @url https://xxyx-client-api.xiaoxiaoyouxuan.com/my
   * @keyword fmz200_xxyx_token 打开APP点击“我的”页面获取
   */
  if (req_url.includes("xxyx-client-api.xiaoxiaoyouxuan.com/my")) {
    console.log('晓晓优选 开始');
    const token = req_headers['xx-token'];
    let rsp_data = JSON.parse(rsp_body).data;
    if (token && rsp_data) {
      let mobile = rsp_data.mobile;
      let username = rsp_data.nick;
      let avatar = rsp_data.avatar;
      console.log(`获取到uid：${mobile}，username：${username}`);

      let cache = $.read("#fmz200_xxyx_token") || "[]";
      console.log("读取缓存数据：" + cache);

      let json_data = JSON.parse(cache);
      updateOrAddObject(json_data, "mobile", mobile, "username", username, "token", token, "avatar", avatar);
      const cacheValue = JSON.stringify(json_data, null, "\t");
      
      $.write(cacheValue, '#fmz200_xxyx_token');
      $.notify('晓晓优选token 获取成功✅', '', '');
    } else {
      $.notify('晓晓优选token 获取失败❗️', '', '');
    }
  }

} catch (e) {
  console.log('脚本运行出现错误：' + e.message);
  $.notify('获取Cookie脚本运行出现错误❗️', "", "");
}
$.done();

// 将数据字符串解析为对象
function parseDataString(dataString) {
  let data = {};
  // 使用正则表达式匹配换行符号和@符号进行拆分
  let parts = dataString.split(/[\n@]/);
  parts.forEach(part => {
    // 对每个部分再根据 "&" 符号拆分为 uid 和 token
    let [uid, token] = part.split("&");
    if (uid && token) {
      data[uid] = token;
    }
  });
  return data;
}

// 接受可变数量的参数对（id, key），并使用循环来处理这些参数对。
// 如果找到了匹配的对象，则在后续参数对中更新对应的属性值；如果未找到，则创建一个新对象并将其添加到集合中。
// 第一对数据是主键
function updateOrAddObject(collection, ...args) {
  if (args.length % 2 !== 0) {
    throw new Error('Arguments must be provided in pairs.');
  }

  for (let i = 0; i < args.length; i += 2) {
    const id = args[i];
    const key = args[i + 1];
    const index = collection.findIndex(obj => obj[id] === key);

    if (index !== -1) {
      // 如果找到了，则更新对应的属性值
      for (let j = i + 2; j < args.length; j += 2) {
        const id2 = args[j];
        const value = args[j + 1];
        collection[index][id2] = value;
      }
    } else {
      // 如果未找到，则新增一个对象并添加到集合中
      const newObj = {};
      for (let j = i; j < args.length; j += 2) {
        newObj[args[j]] = args[j + 1];
      }
      collection.push(newObj);
      break;
    }
  }
}

// 更新数据对象中指定 UID 的 Token
function updateToken(uidToUpdate, newToken, data) {
  if (data.hasOwnProperty(uidToUpdate)) {
    // 如果 UID 存在，则更新其对应的 Token
    data[uidToUpdate] = newToken;
    console.log("Token updated successfully for UID: " + uidToUpdate);
  } else {
    // 如果 UID 不存在，则新增 UID 和对应的 Token
    data[uidToUpdate] = newToken;
    console.log("New UID and Token added successfully: " + uidToUpdate);
  }
}

// 将对象转换为 uid&token 格式的字符串
function convertDataToString(data) {
  let result = "";
  for (let uid in data) {
    if (data.hasOwnProperty(uid)) {
      result += `${uid}&${data[uid]}@`;
    }
  }
  // 移除末尾的 '@' 符号
  result = result.slice(0, -1);
  return result;
}

/*********************************** API *************************************/
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;"POST"===e&&(s=this.post);const i=new Promise(((e,i)=>{s.call(this,t,((t,s,o)=>{t?i(t):e(s)}))}));return t.timeout?((t,e=1e3)=>Promise.race([t,new Promise(((t,s)=>{setTimeout((()=>{s(new Error("请求超时"))}),e)}))]))(i,t.timeout):i}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.logLevels={debug:0,info:1,warn:2,error:3},this.logLevelPrefixs={debug:"[DEBUG] ",info:"[INFO] ",warn:"[WARN] ",error:"[ERROR] "},this.logLevel="info",this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null,...s){try{return JSON.stringify(t,...s)}catch{return e}}getjson(t,e){let s=e;if(this.getdata(t))try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise((e=>{this.get({url:t},((t,s,i)=>e(i)))}))}runScript(t,e){return new Promise((s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,a]=i.split("@"),n={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"},policy:"DIRECT",timeout:o};this.post(n,((t,e,i)=>s(i)))})).catch((t=>this.logErr(t)))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t||(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce(((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{}),t)[e[e.length-1]]=s),t}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),a=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(a);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.cookie&&void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar)))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",((t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}})).then((t=>{const{statusCode:i,statusCode:o,headers:r,rawBody:a}=t,n=s.decode(a,this.encoding);e(null,{status:i,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:i,response:o}=t;e(i,o,o&&s.decode(o.rawBody,this.encoding))}));break}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let i=require("iconv-lite");this.initGotEnv(t);const{url:o,...r}=t;this.got[s](o,r).then((t=>{const{statusCode:s,statusCode:o,headers:r,rawBody:a}=t,n=i.decode(a,this.encoding);e(null,{status:s,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:s,response:o}=t;e(s,o,o&&i.decode(o.rawBody,this.encoding))}));break}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}queryStr(t){let e="";for(const s in t){let i=t[s];null!=i&&""!==i&&("object"==typeof i&&(i=JSON.stringify(i)),e+=`${s}=${i}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",i="",o={}){const r=t=>{const{$open:e,$copy:s,$media:i,$mediaMime:o}=t;switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{const r={};let a=t.openUrl||t.url||t["open-url"]||e;a&&Object.assign(r,{action:"open-url",url:a});let n=t["update-pasteboard"]||t.updatePasteboard||s;if(n&&Object.assign(r,{action:"clipboard",text:n}),i){let t,e,s;if(i.startsWith("http"))t=i;else if(i.startsWith("data:")){const[t]=i.split(";"),[,o]=i.split(",");e=o,s=t.replace("data:","")}else{e=i,s=(t=>{const e={JVBERi0:"application/pdf",R0lGODdh:"image/gif",R0lGODlh:"image/gif",iVBORw0KGgo:"image/png","/9j/":"image/jpg"};for(var s in e)if(0===t.indexOf(s))return e[s];return null})(i)}Object.assign(r,{"media-url":t,"media-base64":e,"media-base64-mime":o??s})}return Object.assign(r,{"auto-dismiss":t["auto-dismiss"],sound:t.sound}),r}case"Loon":{const s={};let o=t.openUrl||t.url||t["open-url"]||e;o&&Object.assign(s,{openUrl:o});let r=t.mediaUrl||t["media-url"];return i?.startsWith("http")&&(r=i),r&&Object.assign(s,{mediaUrl:r}),console.log(JSON.stringify(s)),s}case"Quantumult X":{const o={};let r=t["open-url"]||t.url||t.openUrl||e;r&&Object.assign(o,{"open-url":r});let a=t["media-url"]||t.mediaUrl;i?.startsWith("http")&&(a=i),a&&Object.assign(o,{"media-url":a});let n=t["update-pasteboard"]||t.updatePasteboard||s;return n&&Object.assign(o,{"update-pasteboard":n}),console.log(JSON.stringify(o)),o}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,i,r(o));break;case"Quantumult X":$notify(e,s,i,r(o));break;case"Node.js":break}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}debug(...t){this.logLevels[this.logLevel]<=this.logLevels.debug&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.debug}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}info(...t){this.logLevels[this.logLevel]<=this.logLevels.info&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.info}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}warn(...t){this.logLevels[this.logLevel]<=this.logLevels.warn&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.warn}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}error(...t){this.logLevels[this.logLevel]<=this.logLevels.error&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.error}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.map((t=>t??String(t))).join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,e,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,e,void 0!==t.message?t.message:t,t.stack);break}}wait(t){return new Promise((e=>setTimeout(e,t)))}done(t={}){const e=((new Date).getTime()-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${e} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
/*****************************************************************************/
