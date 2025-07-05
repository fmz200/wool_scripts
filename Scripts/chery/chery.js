/**
 * new Env("奇瑞汽车")
 * cron 09 18 * * *  test_v2.js
 * Show:多账号分隔符@    多变量分隔符&
 * 变量名:chery_data
 * 变量值:mobile-consumer-sapp.chery.cn请求头Authorization 去掉bearer
 * scriptVersionNow = "0.0.1";
 */

const $ = new Env("奇瑞汽车");
const ckName = "chery_data";
const Notify = 1; //0为关闭通知,1为打开通知,默认为1
let envSplitor = ["@", "\n"]; //多账号分隔符
let strSplitor = '&'; //多变量分隔符
let scriptVersionNow = "0.0.1";
const JSConfig = {
  jsUrl: "https://originfastly.jsdelivr.net/gh/smallfawn/Note@main/JavaScript/test_v2.js",
  noticeUrl: `https://originfastly.jsdelivr.net/gh/smallfawn/Note@main/Notice.json`,
}


class UserInfo {
  constructor(str) {
    this.index = ++$.userIdx;
    this.ck = str.split(strSplitor)[0]; //单账号多变量分隔符
    this.ckStatus = true;
    this.headers_get = {
      "Host": "mobile-consumer-sapp.chery.cn",
      "Connection": "keep-alive",
      "Authorization": "Bearer " + this.ck,
      "accept-language": "zh-CN,zh",
      "User-Agent": "Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 android/1.0.0",
      "content-type": "application/json",
      "Accept": "*/*",
      "Origin": "https://hybrid-sapp.chery.cn",
      "X-Requested-With": "com.digitalmall.chery",
      "Sec-Fetch-Site": "same-site",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      "Referer": "https://hybrid-sapp.chery.cn/package-mine/pages/sign-in/sign-in",
      "Accept-Encoding": "gzip, deflate"
    };
    this.articleIdList = null
    this.user_name = ``
    this.user_point = ``

  }
  async main() {
    await this.user_info()
    if (this.ckStatus == true) {
      await this.task_signIn()
      await this.article_list()
      for (let articleId of this.articleIdList) {
        await this.task_share(articleId)
      }
      $.msg(`[昵称] ${this.user_name}`, `积分${this.user_point}`, `正常`)
    }

  }
  async user_info() {
    try {
      let options = {
          url: `https://mobile-consumer-sapp.chery.cn/web/user/current/details?access_token=${this.ck}&terminal=3`,
          headers: this.headers_get,
        },
        result = await httpRequest(options);
      //console.log(options);
      //console.log(result);
      if (result.status == 200) {
        $.DoubleLog(`✅账号[${this.index}]  【昵称】[${result.data.displayName}]  【积分】[${result.data.pointAccount.payableBalance}]🎉`);
        this.user_name = result.data.displayName
        this.user_point = result.data.pointAccount.payableBalance
        this.ckStatus = true;
      } else {
        $.DoubleLog(`❌账号[${this.index}]  [${result.message}]`);
        this.ckStatus = false;
        //console.log(result);
      }
    } catch (e) {
      console.log(e);
    }
  }
  async task_signIn() {
    try {
      let options = {
          url: `https://mobile-consumer-sapp.chery.cn/web/event/trigger?access_token=${this.ck}`,
          headers: {
            "Host": "mobile-consumer-sapp.chery.cn",
            "Connection": "keep-alive",
            "Content-Length": "23",
            "Authorization": "Bearer " + this.ck,
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 android/1.0.0",
            "content-type": "application/json",
            "Accept": "/",
            "Origin": "https://hybrid-sapp.chery.cn",
            "X-Requested-With": "com.digitalmall.chery",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            "Referer": "https://hybrid-sapp.chery.cn/package-mine/pages/sign-in/sign-in",
            "Accept-Encoding": "gzip, deflate"
          },
          body: JSON.stringify({ "eventCode": "SJ10002" })

        },
        result = await httpRequest(options);
      //console.log(options);
      //console.log(result);
      if (result.status == 200) {
        $.DoubleLog(`✅账号[${this.index}]  【签到】[${result.message}]🎉`);
      } else {
        $.DoubleLog(`❌账号[${this.index}]  【签到】[${result.message}]`);
        //console.log(result);
      }
    } catch (e) {
      console.log(e);
    }
  }
  async article_list() {
    try {
      let options = {
          url: `https://mobile-consumer-sapp.chery.cn/web/community/recommend/contents?pageNo=1&pageSize=10&access_token=${this.ck}&terminal=3`,
          headers: {
            "user-agent": "Dart/2.17 (dart:io)",
            "accept": "application/json, text/plain, */*",
            "appversion": `2.17.6 (stable) (Tue Jul 12 12:54:37 2022 +0200) on "android_arm64"`,
            "accept-language": "zh-CN,zh;q=0.9",
            "accept-encoding": "gzip, deflate",
            "host": "mobile-consumer-sapp.chery.cn",
            "content-type": "application/json; charset=UTF-8",
            "agent": "android",
            "request-channel": "app",
          },
        },
        result = await httpRequest(options);
      //console.log(options);
      //console.log(result);
      if (result.status == 200) {
        $.DoubleLog(`✅账号[${this.index}]  【获取文章】[${result.message}]🎉`);
        this.articleIdList = [result.data.data[0].content.id, result.data.data[1].content.id]
      } else {
        $.DoubleLog(`❌账号[${this.index}]  【获取文章】[${result.message}]`);
        //console.log(result);
      }
    } catch (e) {
      console.log(e);
    }
  }
  async task_share(articleId) {

    try {
      let options = {
          url: `https://mobile-consumer-sapp.chery.cn//web/community/contents/${articleId}/share?access_token=${this.ck}&terminal=3`,
          headers: {
            "user-agent": "Dart/2.17 (dart:io)",
            "accept": "application/json, text/plain, */*",
            "appversion": `2.17.6 (stable) (Tue Jul 12 12:54:37 2022 +0200) on "android_arm64"`,
            "accept-language": "zh-CN,zh;q=0.9",
            "accept-encoding": "gzip, deflate",
            "host": "mobile-consumer-sapp.chery.cn",
            "content-type": "application/json; charset=UTF-8",
            "agent": "android",
            "request-channel": "app",
          },
          body: JSON.stringify({ "contentId": articleId })
        },
        result = await httpRequest(options);
      //console.log(options);
      //console.log(result);
      if (result.status == 200) {
        $.DoubleLog(`✅账号[${this.index}]  【分享】[${result.message}]🎉`);
      } else {
        $.DoubleLog(`❌账号[${this.index}]  【分享】[${result.message}]`);
        //console.log(result);
      }
    } catch (e) {
      console.log(e);
    }
  }

}

async function start() {
  //await _getVersion();
  //await _getNotice();
  let taskall = [];
  for (let user of $.userList) {
    if (user.ckStatus) {
      taskall.push(await user.main());
    }
  }
  await Promise.all(taskall);
}

!(async () => {
  if (!(await checkEnv())) return;
  if ($.userList.length > 0) {
    await start();
  } await $.SendMsg($.message);
})().catch((e) => console.log(e)).finally(() => $.done());

//********************************************************
/**
 * 变量检查与处理
 * @returns
 */
async function checkEnv() {
  let userCookie = ($.isNode() ? process.env[ckName] : $.getdata(ckName)) || "";
  //let userCount = 0;
  if (userCookie) {
    // console.log(userCookie);
    let e = envSplitor[0];
    for (let o of envSplitor)
      if (userCookie.indexOf(o) > -1) {
        e = o;
        break;
      }
    for (let n of userCookie.split(e)) n && $.userList.push(new UserInfo(n));
    //userCount = $.userList.length;
  } else {
    console.log("未找到CK");
    return;
  }
  return console.log(`共找到${$.userList.length}个账号`), true; //true == !0
}

/////////////////////////////////////////////////////////////////////////////////////
function httpRequest(options, timeout = 1 * 1000) {
  method = options.method ? options.method.toLowerCase() : options.body ? "post" : "get";
  return new Promise(resolve => {
    setTimeout(() => {
      $[method](options, (err, resp, data) => {
        try {
          if (err) {
            console.log(JSON.stringify(err));
            $.logErr(err);
          } else {
            try { data = JSON.parse(data); } catch (error) { }
          }
        } catch (e) {
          console.log(e);
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      })
    }, timeout)
  })
}
/**
 * 获取远程版本
 */
async function _getVersion() {
  const options = { url: JSConfig.jsUrl };
  let httpResult = await httpRequest(options)
  const regex = /scriptVersionNow\s*=\s*(["'`])([\d.]+)\1/;
  const match = httpResult.match(regex);
  const scriptVersionLatest = match ? match[2] : "";
  $.DoubleLog(`\n====== 当前版本：${scriptVersionNow} 📌 最新版本：${scriptVersionLatest} ======`);
}
/**
 * 获取远程通知
 */
async function _getNotice() {
  const options = { url: JSConfig.noticeUrl };
  let httpResult = await httpRequest(options)
  const notice = httpResult.notice.replace(/\\n/g, "\n");
  $.DoubleLog(notice);
}
// ==================== API ==================== //
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, a) => { s.call(this, t, (t, s, r) => { t ? a(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.userList = []; this.userIdx = 0; this.message = ""; this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.encoding = "utf-8", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name},开始!`) } getEnv() { return "undefined" != typeof $environment && $environment["surge-version"] ? "Surge" : "undefined" != typeof $environment && $environment["stash-version"] ? "Stash" : "undefined" != typeof module && module.exports ? "Node.js" : "undefined" != typeof $task ? "Quantumult X" : "undefined" != typeof $loon ? "Loon" : "undefined" != typeof $rocket ? "Shadowrocket" : void 0 } isNode() { return "Node.js" === this.getEnv() } isQuanX() { return "Quantumult X" === this.getEnv() } isSurge() { return "Surge" === this.getEnv() } isLoon() { return "Loon" === this.getEnv() } isShadowrocket() { return "Shadowrocket" === this.getEnv() } isStash() { return "Stash" === this.getEnv() } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const a = this.getdata(t); if (a) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, a) => e(a)) }) } runScript(t, e) { return new Promise(s => { let a = this.getdata("@chavy_boxjs_userCfgs.httpapi"); a = a ? a.replace(/\n/g, "").trim() : a; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [i, o] = a.split("@"), n = { url: `http://${o}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": i, Accept: "*/*" }, timeout: r }; this.post(n, (t, e, a) => s(a)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), a = !s && this.fs.existsSync(e); if (!s && !a) return {}; { const a = s ? t : e; try { return JSON.parse(this.fs.readFileSync(a)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), a = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : a ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const a = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of a) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, a) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[a + 1]) >> 0 == +e[a + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, a] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, a, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, a, r] = /^@(.*?)\.(.*?)$/.exec(e), i = this.getval(a), o = a ? "null" === i ? null : i || "{}" : "{}"; try { const e = JSON.parse(o); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), a) } catch (e) { const i = {}; this.lodash_set(i, r, t), s = this.setval(JSON.stringify(i), a) } } else s = this.setval(t, e); return s } getval(t) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.read(t); case "Quantumult X": return $prefs.valueForKey(t); case "Node.js": return this.data = this.loaddata(), this.data[t]; default: return this.data && this.data[t] || null } } setval(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.write(t, e); case "Quantumult X": return $prefs.setValueForKey(t, e); case "Node.js": return this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0; default: return this.data && this.data[e] || null } } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { switch (t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"], delete t.headers["content-type"], delete t.headers["content-length"]), t.params && (t.url += "?" + this.queryStr(t.params)), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, a) => { !t && s && (s.body = a, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, a) }); break; case "Quantumult X": this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: a, headers: r, body: i, bodyBytes: o } = t; e(null, { status: s, statusCode: a, headers: r, body: i, bodyBytes: o }, i, o) }, t => e(t && t.error || "UndefinedError")); break; case "Node.js": let s = require("iconv-lite"); this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: a, statusCode: r, headers: i, rawBody: o } = t, n = s.decode(o, this.encoding); e(null, { status: a, statusCode: r, headers: i, rawBody: o, body: n }, n) }, t => { const { message: a, response: r } = t; e(a, r, r && s.decode(r.rawBody, this.encoding)) }) } } post(t, e = (() => { })) { const s = t.method ? t.method.toLocaleLowerCase() : "post"; switch (t.body && t.headers && !t.headers["Content-Type"] && !t.headers["content-type"] && (t.headers["content-type"] = "application/x-www-form-urlencoded"), t.headers && (delete t.headers["Content-Length"], delete t.headers["content-length"]), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient[s](t, (t, s, a) => { !t && s && (s.body = a, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, a) }); break; case "Quantumult X": t.method = s, this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: a, headers: r, body: i, bodyBytes: o } = t; e(null, { status: s, statusCode: a, headers: r, body: i, bodyBytes: o }, i, o) }, t => e(t && t.error || "UndefinedError")); break; case "Node.js": let a = require("iconv-lite"); this.initGotEnv(t); const { url: r, ...i } = t; this.got[s](r, i).then(t => { const { statusCode: s, statusCode: r, headers: i, rawBody: o } = t, n = a.decode(o, this.encoding); e(null, { status: s, statusCode: r, headers: i, rawBody: o, body: n }, n) }, t => { const { message: s, response: r } = t; e(s, r, r && a.decode(r.rawBody, this.encoding)) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let a = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in a) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? a[e] : ("00" + a[e]).substr(("" + a[e]).length))); return t } queryStr(t) { let e = ""; for (const s in t) { let a = t[s]; null != a && "" !== a && ("object" == typeof a && (a = JSON.stringify(a)), e += `${s}=${a}&`) } return e = e.substring(0, e.length - 1), e } msg(e = t, s = "", a = "", r) { const i = t => { switch (typeof t) { case void 0: return t; case "string": switch (this.getEnv()) { case "Surge": case "Stash": default: return { url: t }; case "Loon": case "Shadowrocket": return t; case "Quantumult X": return { "open-url": t }; case "Node.js": return }case "object": switch (this.getEnv()) { case "Surge": case "Stash": case "Shadowrocket": default: { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } case "Loon": { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } case "Quantumult X": { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl, a = t["update-pasteboard"] || t.updatePasteboard; return { "open-url": e, "media-url": s, "update-pasteboard": a } } case "Node.js": return }default: return } }; if (!this.isMute) switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: $notification.post(e, s, a, i(r)); break; case "Quantumult X": $notify(e, s, a, i(r)); break; case "Node.js": }if (!this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), a && t.push(a), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: this.log("", `❗️${this.name},错误!`, t); break; case "Node.js": this.log("", `❗️${this.name},错误!`, t.stack) } } wait(t) { return new Promise(e => setTimeout(e, t)) } DoubleLog(d) { if (this.isNode()) { if (d) { console.log(`${d}`); this.message += `\n ${d}` } } else { console.log(`${d}`); this.message += `\n ${d}` } } async SendMsg(m) { if (!m) return; if (Notify > 0) { if (this.isNode()) { var notify = require("./sendNotify"); await notify.sendNotify(this.name, m) } else { this.msg(this.name, "", m) } } else { console.log(m) } } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; switch (this.log("", `🔔${this.name},结束!🕛${s}秒`), this.log(), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: $done(t); break; case "Node.js": process.exit(1) } } }(t, e) }
//Env rewrite:smallfawn Update-time:23-07-26 newAdd:DoubleLog & SendMsg & ChangeMessage
a
