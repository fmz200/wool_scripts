/**
 * @author fmz200
 * @function 获取应用的cookie或token通用脚本
 * @date 2024-02-03 21:30:00
 */

////////////////////////////////
const $ = new API("获取Cookie或Token通用脚本");
const req_url = $request.url;
const req_headers = $request.headers;
const req_body = $request.body;
const rsp_body = $response ? $response.body : "{}";

// console.log(`当前请求的url: ${req_url}`);
// 遍历头部对象并打印每个字段和值
console.log("遍历头部对象并打印每个字段和值开始❇️");
for (const headerField in req_headers) {
  console.log(`${headerField}: ${req_headers[headerField]}`);
}
console.log("遍历头部对象并打印每个字段和值结束🍓");

try {
  getCookieORToken();
} catch (e) {
  console.log('脚本运行出现错误，错误信息：' + e.message);
}
$done();
////////////////////////////////

function getCookieORToken() {

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
    let hasKey = false;
    // 遍历集合中的每一个对象
    for (let obj of json_data) {
      // 如果当前对象的 key 属性值匹配给定的 key
      if (obj.smzdm_id === smzdm_id) {
        // 更新该对象的 cookie 值
        obj.cookie = cookie;
        hasKey = true;
        break; // 更新后直接返回，无需继续遍历
      }
    }
    // 如果集合中没有匹配的 key，则新增一个对象
    if (!hasKey) {
      json_data.push({smzdm_id: smzdm_id, cookie: cookie});
    }
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
   * 点击“我的”-“个人头像”，在请求头request-header中搜索token
   * @keyword meituanCookie
   * @keyword fmz200_meituan_cookie
   */
  if (req_url.includes("/user/v1/info/audit") || req_url.includes("/mapi/usercenter")) {
    console.log('美团获取token 开始');
    const token = req_headers['token'] || req_headers['Token'];
    $.write(token, '#meituanCookie');
    $.write(token, '#fmz200_meituan_cookie');
    $.notify('美团获取token 获取成功✅', token, token);
    console.log('美团获取token 获取到的内容为：' + token);
  }

  /**
   * 微博获取cookie
   * 打开APP不定时获取
   * https://api.weibo.cn/2/users/show
   * @keyword fmz200_weibo_token
   */
  if (req_url.includes("/users/show")) {
    console.log('微博获取cookie 开始');
    $.write(req_url, '#fmz200_weibo_token');
    $.notify('微博获取cookie 获取成功✅', req_url, req_url);
    console.log('微博获取cookie 获取到的内容为：' + req_url);
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
    console.log('滴滴获取token 开始');
    let data = JSON.parse(req_body);
    let uid = data.uid;
    let newToken = data.token;
    console.log(uid + "获取到token：" + newToken);
    
    let cache = $.read("#fmz200_didi_fruit") || "";
    $.log("读取缓存数据：" + cache);
    let json_data = parseDataString(cache);
    updateToken(uid, newToken, json_data);
    let string_data = convertDataToString(json_data);

    $.write(string_data, '#ddgyToken');
    $.write(string_data, '#fmz200_didi_fruit');
    $.notify('滴滴获取token 获取成功✅', string_data, string_data);
    console.log('滴滴获取token 获取到的内容为：' + string_data);
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
   * @url https://xxyx-client-api.xiaoxiaoyouxuan.com/my?platform=ios
   * @keyword fmz200_xxyx_token 打开APP点击“我的”页面获取
   */
  if (req_url.includes("xxyx-client-api.xiaoxiaoyouxuan.com/my")) {
    console.log('晓晓优选 开始');
    const token = req_headers['xx-token'];
    console.log("获取到token：" + token);
    
    $.write(token, '#fmz200_xxyx_token');
    $.notify('晓晓优选token 获取成功✅', '', '');
  }
}

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
function ENV() { const e = "undefined" != typeof $task, t = "undefined" != typeof $loon, s = "undefined" != typeof $httpClient && !t, i = "function" == typeof require && "undefined" != typeof $jsbox; return { isQX: e, isLoon: t, isSurge: s, isNode: "function" == typeof require && !i, isJSBox: i, isRequest: "undefined" != typeof $request, isScriptable: "undefined" != typeof importModule } } function HTTP(e = { baseURL: "" }) { const { isQX: t, isLoon: s, isSurge: i, isScriptable: n, isNode: o } = ENV(), r = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/; const u = {}; return ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"].forEach(l => u[l.toLowerCase()] = (u => (function (u, l) { l = "string" == typeof l ? { url: l } : l; const h = e.baseURL; h && !r.test(l.url || "") && (l.url = h ? h + l.url : l.url); const a = (l = { ...e, ...l }).timeout, c = { onRequest: () => { }, onResponse: e => e, onTimeout: () => { }, ...l.events }; let f, d; if (c.onRequest(u, l), t) f = $task.fetch({ method: u, ...l }); else if (s || i || o) f = new Promise((e, t) => { (o ? require("request") : $httpClient)[u.toLowerCase()](l, (s, i, n) => { s ? t(s) : e({ statusCode: i.status || i.statusCode, headers: i.headers, body: n }) }) }); else if (n) { const e = new Request(l.url); e.method = u, e.headers = l.headers, e.body = l.body, f = new Promise((t, s) => { e.loadString().then(s => { t({ statusCode: e.response.statusCode, headers: e.response.headers, body: s }) }).catch(e => s(e)) }) } const p = a ? new Promise((e, t) => { d = setTimeout(() => (c.onTimeout(), t(`${u} URL: ${l.url} exceeds the timeout ${a} ms`)), a) }) : null; return (p ? Promise.race([p, f]).then(e => (clearTimeout(d), e)) : f).then(e => c.onResponse(e)) })(l, u))), u } function API(e = "untitled", t = !1) { const { isQX: s, isLoon: i, isSurge: n, isNode: o, isJSBox: r, isScriptable: u } = ENV(); return new class { constructor(e, t) { this.name = e, this.debug = t, this.http = HTTP(), this.env = ENV(), this.node = (() => { if (o) { return { fs: require("fs") } } return null })(), this.initCache(); Promise.prototype.delay = function (e) { return this.then(function (t) { return ((e, t) => new Promise(function (s) { setTimeout(s.bind(null, t), e) }))(e, t) }) } } initCache() { if (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")), (i || n) && (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")), o) { let e = "root.json"; this.node.fs.existsSync(e) || this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.root = {}, e = `${this.name}.json`, this.node.fs.existsSync(e) ? this.cache = JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.cache = {}) } } persistCache() { const e = JSON.stringify(this.cache, null, 2); s && $prefs.setValueForKey(e, this.name), (i || n) && $persistentStore.write(e, this.name), o && (this.node.fs.writeFileSync(`${this.name}.json`, e, { flag: "w" }, e => console.log(e)), this.node.fs.writeFileSync("root.json", JSON.stringify(this.root, null, 2), { flag: "w" }, e => console.log(e))) } write(e, t) { if (this.log(`SET ${t}`), -1 !== t.indexOf("#")) { if (t = t.substr(1), n || i) return $persistentStore.write(e, t); if (s) return $prefs.setValueForKey(e, t); o && (this.root[t] = e) } else this.cache[t] = e; this.persistCache() } read(e) { return this.log(`READ ${e}`), -1 === e.indexOf("#") ? this.cache[e] : (e = e.substr(1), n || i ? $persistentStore.read(e) : s ? $prefs.valueForKey(e) : o ? this.root[e] : void 0) } delete(e) { if (this.log(`DELETE ${e}`), -1 !== e.indexOf("#")) { if (e = e.substr(1), n || i) return $persistentStore.write(null, e); if (s) return $prefs.removeValueForKey(e); o && delete this.root[e] } else delete this.cache[e]; this.persistCache() } notify(e, t = "", l = "", h = {}) { const a = h["open-url"], c = h["media-url"]; if (s && $notify(e, t, l, h), n && $notification.post(e, t, l + `${c ? "\n多媒体:" + c : ""}`, { url: a }), i) { let s = {}; a && (s.openUrl = a), c && (s.mediaUrl = c), "{}" === JSON.stringify(s) ? $notification.post(e, t, l) : $notification.post(e, t, l, s) } if (o || u) { const s = l + (a ? `\n点击跳转: ${a}` : "") + (c ? `\n多媒体: ${c}` : ""); if (r) { require("push").schedule({ title: e, body: (t ? t + "\n" : "") + s }) } else console.log(`${e}\n${t}\n${s}\n\n`) } } log(e) { this.debug && console.log(`[${this.name}] LOG: ${this.stringify(e)}`) } info(e) { console.log(`[${this.name}] INFO: ${this.stringify(e)}`) } error(e) { console.log(`[${this.name}] ERROR: ${this.stringify(e)}`) } wait(e) { return new Promise(t => setTimeout(t, e)) } done(e = {}) { console.log('done!'); s || i || n ? $done(e) : o && !r && "undefined" != typeof $context && ($context.headers = e.headers, $context.statusCode = e.statusCode, $context.body = e.body) } stringify(e) { if ("string" == typeof e || e instanceof String) return e; try { return JSON.stringify(e, null, 2) } catch (e) { return "[object Object]" } } }(e, t) }
/*****************************************************************************/
