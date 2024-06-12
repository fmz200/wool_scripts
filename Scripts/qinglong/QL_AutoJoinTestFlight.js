// 自动加入TestFlight
// 更新时间：2024-01-20 18:05:00
// QL_AutoJoinTestFlight.js
// 环境变量:TF_APP_ID，TF_KEY，session_id，session_digest，request_id
// 目前不支持多账号
// 多个TF用英文逗号分隔，TF的ID和描述用#分隔，下面的写法都是可以的：app_id_1#描述1,app_id_2#描述2,app_id_3,app_id_4#描述4,app_id_5
// 默认加入成功或者报错才通知，需要注意的是，加入成功后不会自动删除APP_ID需要手动删除
// cron */3 * * * * *

const $ = new Env('自动加入TestFlight');
const notify = $.isNode() ? require('./sendNotify') : '';
const {getEnvsByName, updateEnvById} = require('./api');
// 通知封装字符串
let notifyStr = "";
// 是否发送通知，默认加入成功或者报错才通知
let sendNotify = false;

const TFEnvKeyName = "TF_APP_ID";

// 读取环境变量
let tf_app_ids = process.env.TF_APP_ID;
let tf_key = process.env.TF_KEY;
let tf_session_id = process.env.session_id;
let tf_session_digest = process.env.session_digest;
let tf_request_id = process.env.request_id;

// 需要加入TF的APP_ID
let ids = [];

// 调用异步方法处理集合中的元素
processCollection().then(r => console.log('自动加入TestFlight结束...'));

async function processCollection() {
  if (tf_app_ids) {
    if (tf_app_ids.indexOf(',') > -1) {
      ids = tf_app_ids.split(',');
    } else {
      ids = [tf_app_ids];
    }
    addLog(`需要加入的TF_APP_ID = ${ids}\n`);
    try {
      for (const tf_id of ids) {
        await new Promise((resolve) => {
          setTimeout(async () => {
            await autoPost(tf_id.trim());
            addLog("\n");
            resolve(); // 表示异步操作完成
          }, 1000); // 1000毫秒 = 1秒，这里设置每隔1秒执行一个
        });
      }
    } catch (error) {
      sendNotify = true;
      addLog("加入TF发生错误，请检查session是否过期或APPID是否存在，以下是异常信息：" + error);
    }
  } else {
    sendNotify = true;
    addLog('未发现需要加入的TF_APP_ID，请填写TF_APP_ID!');
  }

  // 发送通知
  if (sendNotify) {
    await notify.sendNotify('自动加入TestFlight', notifyStr);
  } else {
    console.log("不发送通知");
  }
  return '自动加入TestFlight' + '\n\n' + notifyStr;
}

async function autoPost(tf_id) {
  let tf_id_str = tf_id;
  if (tf_id.includes("#")) {
    let tfIdfArray = tf_id.split("#");
    tf_id_str = tfIdfArray[0];
  }
  addLog(tf_id + " 开始执行...");
  let url = "https://testflight.apple.com/v3/accounts/" + tf_key + "/ru/" + tf_id_str;
  let headers = {
    "X-Session-Id": tf_session_id,
    "X-Session-Digest": tf_session_digest,
    "X-Request-Id": tf_request_id,
  };
  addLog(tf_id + " 参数拼装完成...");

  // 发送请求并获取响应的body
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers
    });

    addLog(tf_id + " 开始发送请求...");
    const body = await response.text();
    addLog(tf_id + " 收到响应内容...");

    if (body.status === 404) {
      sendNotify = true;
      addLog(tf_id + " 不存在该TF，请在环境变量TF_APP_ID中删除该APPID");
    } else {
      let jsonData = JSON.parse(body);
      if (jsonData.data == null) { // "This beta isn't accepting any new testers right now."
        addLog(`${tf_id} 此测试版目前不接受任何新测试者。${jsonData.messages[0].message}`);
      } else if (jsonData.data.status === "FULL") { // This beta is full.
        const appName = jsonData.data.app.name;
        addLog(`${tf_id} ${appName} 此测试版已满。${jsonData.data.message}`);
      } else {
        const response1 = await fetch(url + "/accept", {
          method: "POST",
          headers: headers
        });
        const body1 = await response1.text();
        // console.log(`${tf_id} 的响应body1：${body1}`);
        let jsonBody = JSON.parse(body1);
        addLog(`${tf_id} 💕${jsonBody.data.name} 加入TestFlight成功，将删除该APPID`);
        sendNotify = true;
        // 加入成功后自动删除APP_ID
        let new_ids = ids.filter(item => item !== tf_id);
        // await updateEnv(new_ids.toString());
      }
    }
  } catch (error) {
    const message = error.message;
    if (!message.includes("Unexpected token")) {
      sendNotify = true;
    }
    addLog(`${tf_id} 加入TF时出错：${message}`);
  }
}

// 更新环境变量
async function updateEnv(new_ids) {
  // 不查询了，直接根据名字更新
  const envs = await getEnvsByName(TFEnvKeyName);
  addLog("获取环境变量结果：" + JSON.stringify(envs));
  if (!envs || envs.length < 1) {
    addLog("获取环境变量结果为空，手动删除吧~");
    return;
  }
  for (const item of envs) {
    if (item.name === TFEnvKeyName) {
      await updateEnvById(item.id, TFEnvKeyName, new_ids, "需要加入TestFlight的ID，对应脚本QL_AutoJoinTestFlight.js");
      addLog("删除指令执行完毕，若没删除就手动删除吧~");
      break;
    }
  }
}

function addLog(info) {
  console.log(info);
  notifyStr = notifyStr + info + '\n';
  return notifyStr;
}

// prettier-ignore
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
