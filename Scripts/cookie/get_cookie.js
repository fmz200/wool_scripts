/*
 * 脚本作用：获取应用的cookie或token
 * get_cookie.js
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
 * 更新时间：2023.12.24 17:30
 */
const meituan = {
  url: "/user/v1/info/audit",
  url1: "/mapi/usercenter",
  msg: "美团获取token"
};

/**
 * 脚本作用：微博获取cookie
 * 触发类型：request-url
 * 获取方式：
 * 更新时间：2023.12.24 17:30
 * https://api.weibo.cn/2/users/show
 */
const weibo = {
  url: "/users/show",
  msg: "微博获取cookie"
};

////////////////////////////////
const $ = new API("获取Cookie或Token通用脚本");
const req_url = $request.url;
const req_headers = $request.headers;
console.log(`当前请求的url: ${req_url}`);
// 遍历头部对象并打印每个字段和值
console.log("遍历头部对象并打印每个字段和值开始❇️");
for (const headerField in req_headers) {
  console.log(`${headerField}: ${req_headers[headerField]}`);
}
console.log("遍历头部对象并打印每个字段和值结束🔴");

try {
  getCookieORToken();
} catch (e) {
  console.log('脚本运行出现错误，错误信息：' + e.message);
}
$done();
////////////////////////////////

function getCookieORToken() {
  // 什么值得买
  if (req_url.includes(smzdm.url)) {
    const cookie = req_headers['Cookie'] || req_headers['cookie'];
    $.write(cookie, '#SMZDM_COOKIE');
    $.write(cookie, '#fmz200.smzdm.cookie');
    $.notify(smzdm.msg + '获取cookie成功✅', cookie, cookie);
    console.log(smzdm.msg + '获取到的ck为：' + cookie);
  }

  // 拼多多果园获取token，暂时不确定哪个URL会携带PDDAccessToken
  // Cookie: pdd_vds=xxx; ETag=dKJLmoeS; PDDAccessToken=12HUHDUW; install_token=118E4FCA;
  if (req_url.includes(pdd_orchard.url)) {
    const cookieValue = req_headers["Cookie"] || req_headers["cookie"];
    const token = cookieValue.match(/PDDAccessToken=.+?/);
    if (token) {
      $.write(token, '#ddgyck');
      $.write(token, '#fmz200.pdd.token');
      $.notify(pdd_orchard.msg + 'token获取成功', token, token);
      console.log(pdd_orchard.msg + '获取到的ck为：' + token);
    }
  }

  // 美团
  if (req_url.includes(meituan.url) || req_url.includes(meituan.url1)) {
    console.log(meituan.msg + '开始');
    const token = req_headers['token'] || req_headers['Token'];
    $.write(token, '#meituanCookie');
    $.write(token, '#fmz200.meituan.cookie');
    $.notify(meituan.msg + '获取成功✅', token, token);
    console.log(meituan.msg + '获取到的内容为：' + token);
  }

  // 微博
  if (req_url.includes(weibo.url)) {
    console.log(weibo.msg + '开始');
    // const token = req_headers['token'] || req_headers['Token'];
    $.write(req_url, '#fmz200.weibo.token');
    $.notify(weibo.msg + '获取成功✅', req_url, req_url);
    console.log(weibo.msg + '获取到的内容为：' + req_url);
  }
}

/*********************************** API *************************************/
function ENV() { const e = "undefined" != typeof $task, t = "undefined" != typeof $loon, s = "undefined" != typeof $httpClient && !t, i = "function" == typeof require && "undefined" != typeof $jsbox; return { isQX: e, isLoon: t, isSurge: s, isNode: "function" == typeof require && !i, isJSBox: i, isRequest: "undefined" != typeof $request, isScriptable: "undefined" != typeof importModule } } function HTTP(e = { baseURL: "" }) { const { isQX: t, isLoon: s, isSurge: i, isScriptable: n, isNode: o } = ENV(), r = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/; const u = {}; return ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"].forEach(l => u[l.toLowerCase()] = (u => (function (u, l) { l = "string" == typeof l ? { url: l } : l; const h = e.baseURL; h && !r.test(l.url || "") && (l.url = h ? h + l.url : l.url); const a = (l = { ...e, ...l }).timeout, c = { onRequest: () => { }, onResponse: e => e, onTimeout: () => { }, ...l.events }; let f, d; if (c.onRequest(u, l), t) f = $task.fetch({ method: u, ...l }); else if (s || i || o) f = new Promise((e, t) => { (o ? require("request") : $httpClient)[u.toLowerCase()](l, (s, i, n) => { s ? t(s) : e({ statusCode: i.status || i.statusCode, headers: i.headers, body: n }) }) }); else if (n) { const e = new Request(l.url); e.method = u, e.headers = l.headers, e.body = l.body, f = new Promise((t, s) => { e.loadString().then(s => { t({ statusCode: e.response.statusCode, headers: e.response.headers, body: s }) }).catch(e => s(e)) }) } const p = a ? new Promise((e, t) => { d = setTimeout(() => (c.onTimeout(), t(`${u} URL: ${l.url} exceeds the timeout ${a} ms`)), a) }) : null; return (p ? Promise.race([p, f]).then(e => (clearTimeout(d), e)) : f).then(e => c.onResponse(e)) })(l, u))), u } function API(e = "untitled", t = !1) { const { isQX: s, isLoon: i, isSurge: n, isNode: o, isJSBox: r, isScriptable: u } = ENV(); return new class { constructor(e, t) { this.name = e, this.debug = t, this.http = HTTP(), this.env = ENV(), this.node = (() => { if (o) { return { fs: require("fs") } } return null })(), this.initCache(); Promise.prototype.delay = function (e) { return this.then(function (t) { return ((e, t) => new Promise(function (s) { setTimeout(s.bind(null, t), e) }))(e, t) }) } } initCache() { if (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")), (i || n) && (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")), o) { let e = "root.json"; this.node.fs.existsSync(e) || this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.root = {}, e = `${this.name}.json`, this.node.fs.existsSync(e) ? this.cache = JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.cache = {}) } } persistCache() { const e = JSON.stringify(this.cache, null, 2); s && $prefs.setValueForKey(e, this.name), (i || n) && $persistentStore.write(e, this.name), o && (this.node.fs.writeFileSync(`${this.name}.json`, e, { flag: "w" }, e => console.log(e)), this.node.fs.writeFileSync("root.json", JSON.stringify(this.root, null, 2), { flag: "w" }, e => console.log(e))) } write(e, t) { if (this.log(`SET ${t}`), -1 !== t.indexOf("#")) { if (t = t.substr(1), n || i) return $persistentStore.write(e, t); if (s) return $prefs.setValueForKey(e, t); o && (this.root[t] = e) } else this.cache[t] = e; this.persistCache() } read(e) { return this.log(`READ ${e}`), -1 === e.indexOf("#") ? this.cache[e] : (e = e.substr(1), n || i ? $persistentStore.read(e) : s ? $prefs.valueForKey(e) : o ? this.root[e] : void 0) } delete(e) { if (this.log(`DELETE ${e}`), -1 !== e.indexOf("#")) { if (e = e.substr(1), n || i) return $persistentStore.write(null, e); if (s) return $prefs.removeValueForKey(e); o && delete this.root[e] } else delete this.cache[e]; this.persistCache() } notify(e, t = "", l = "", h = {}) { const a = h["open-url"], c = h["media-url"]; if (s && $notify(e, t, l, h), n && $notification.post(e, t, l + `${c ? "\n多媒体:" + c : ""}`, { url: a }), i) { let s = {}; a && (s.openUrl = a), c && (s.mediaUrl = c), "{}" === JSON.stringify(s) ? $notification.post(e, t, l) : $notification.post(e, t, l, s) } if (o || u) { const s = l + (a ? `\n点击跳转: ${a}` : "") + (c ? `\n多媒体: ${c}` : ""); if (r) { require("push").schedule({ title: e, body: (t ? t + "\n" : "") + s }) } else console.log(`${e}\n${t}\n${s}\n\n`) } } log(e) { this.debug && console.log(`[${this.name}] LOG: ${this.stringify(e)}`) } info(e) { console.log(`[${this.name}] INFO: ${this.stringify(e)}`) } error(e) { console.log(`[${this.name}] ERROR: ${this.stringify(e)}`) } wait(e) { return new Promise(t => setTimeout(t, e)) } done(e = {}) { console.log('done!'); s || i || n ? $done(e) : o && !r && "undefined" != typeof $context && ($context.headers = e.headers, $context.statusCode = e.statusCode, $context.body = e.body) } stringify(e) { if ("string" == typeof e || e instanceof String) return e; try { return JSON.stringify(e, null, 2) } catch (e) { return "[object Object]" } } }(e, t) }
/*****************************************************************************/
