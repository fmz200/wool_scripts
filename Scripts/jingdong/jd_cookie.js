/*
===================
特别说明：
1.获取多个京东cookie的脚本，不和NobyDa的京东cookie冲突。注：如与NobyDa的京东cookie重复，建议在BoxJs处删除重复的cookie
===================
===================
使用方式：在代理软件配置好下方配置后，复制 https://home.m.jd.com/myJd/newhome.action 到浏览器打开 ，在个人中心刷新自动获取 cookie，
若弹出成功则正常使用。否则继续再此页面继续刷新一下试试。

注：建议通过脚本去获取cookie，若要在BoxJs处手动修改，请按照JSON格式修改（注：可使用此JSON校验 https://www.bejson.com/json/format）
示例：[{"userName":"jd_xxx","cookie":"pt_key=AAJ;pt_pin=jd_xxx;"},{"userName":"jd_66","cookie":"pt_key=AAJ;pt_pin=jd_66;"}]
===================
new Env('获取多账号京东Cookie');//此处忽略即可，为自动生成iOS端软件配置文件所需
===================
[MITM]
hostname = home.m.jd.com, un.m.jd.com, sec.m.jd.com

===================Quantumult X=====================
[rewrite_local]
# 获取多账号京东Cookie
^https:\/\/home\.m\.jd\.com\/myJd\/home\.action url script-request-header https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/jingdong/jd_cookie.js

===================Loon===================
[Script]
http-request ^https:\/\/home\.m\.jd\.com\/myJd\/home\.action script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/jingdong/jd_cookie.js, tag=获取多账号京东Cookie
http-request ^https:\/\/un\.m\.jd\.com\/cgi-bin\/app\/appjmp\? script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/jingdong/jd_cookie.js, tag=获取多账号京东Cookie
http-request ^https:\/\/sec\.m\.jd\.com\/todo\/modifyLoginName\? script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/jingdong/jd_cookie.js, tag=获取多账号京东Cookie

===================Surge===================
[Script]
获取多账号京东Cookie = type=http-request,pattern=^https:\/\/home\.m\.jd\.com\/myJd\/home\.action,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/jingdong/jd_cookie.js,script-update-interval=0
 */

const APIKey = "CookiesJD";
$ = new API(APIKey, true);
const CacheKey = `#${APIKey}`;
let req_url = $request.url;
if ($request) GetCookie();

function getCache() {
  let cache = $.read(CacheKey) || "[]";
  $.log(cache);
  return JSON.parse(cache);
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

function GetCookie() {
  try {
    if ($request.headers) {
      let tryAgain = true;
      if (req_url.includes("/cgi-bin/app/appjmp") || req_url.includes("/todo/modifyLoginName")) {
        let username = null;
        let cookie = null;
        console.log("遍历头部对象并打印每个字段和值开始❇️");
        for (const headerField in $request.headers) {
          const headerValue = $request.headers[headerField];
          console.log(`${headerField}: ${headerValue}\n`);
          if (headerValue?.startsWith("pt_pin=")) {
            username = headerValue.substring(headerValue.indexOf("=") + 1);
          }
          if (headerValue?.startsWith("pt_key=")) {
            cookie = headerValue.substring(headerValue.indexOf("=") + 1);
          }
        }
        console.log("遍历头部对象并打印每个字段和值结束🍓");
        if (username && cookie) {
          tryAgain = false;
          console.log(`获取到username：${username}，cookie：${cookie}`);
          let unionCookie = `${cookie};${username};`; // pt_key=xxx;pt_pin=yyy;
          let json_data = getCache();
          updateOrAddObject(json_data, "userName", username, "cookie", unionCookie);
          const cacheValue = JSON.stringify(json_data);

          $.write(cacheValue, CacheKey);
          $.notify(`京东获取${username}的cookie成功✅`, "", "");
          $.done();
        }/*  else {
          $.notify(`京东匹配到URL但未获取到cookie❗️`, "你可以在脚本日志中查看详情", "");
          $.done();
        } */
      }

      if (tryAgain) { // 原来的代码
        let CV = $request.headers["Cookie"] || $request.headers["cookie"];
        if (CV?.match(/(pt_key=.+?pt_pin=|pt_pin=.+?pt_key=)/)) {
          let CookieValue = CV.match(/pt_key=.+?;/) + CV.match(/pt_pin=.+?;/);
          let UserName = CookieValue.match(/pt_pin=([^; ]+)(?=;?)/)[1];
          let DecodeName = decodeURIComponent(UserName);
          let CookiesData = getCache();
          let updateCookiesData = [...CookiesData];
          let updateIndex;
          let CookieName;
          let updateCookie = CookiesData.find((item, index) => {
            let ck = item.cookie;
            let Account = ck ? ck.match(/pt_pin=.+?;/) ? ck.match(/pt_pin=([^; ]+)(?=;?)/)[1] : null : null;
            const verify = UserName === Account;
            if (verify) {
              updateIndex = index;
            }
            return verify;
          });
          let tipPrefix = "";
          if (updateCookie) {
            updateCookiesData[updateIndex].cookie = CookieValue;
            CookieName = `【♥♥账号${updateIndex + 1}】`;
            tipPrefix = "更新京东";
          } else {
            updateCookiesData.push({
              userName: DecodeName,
              cookie: CookieValue,
            });
            CookieName = "【♥♥账号" + updateCookiesData.length + "】";
            tipPrefix = "首次写入京东";
          }
          const cacheValue = JSON.stringify(updateCookiesData, null, "\t");
          $.write(cacheValue, CacheKey);
          console.log(`获取到${DecodeName}的cookie：${CookieValue}`);
          $.notify("用户名: " + DecodeName, "", tipPrefix + CookieName + "Cookie成功✔✔\n" + CookieValue);
        }
      }
    }
  } catch (eor) {
    $.notify("♥♥写入京东Cookie失败, 请重试 ⚠️", "", "");
    console.log(`\n写入京东Cookie出现错误 ‼️\n
      ${JSON.stringify(eor)}\n\n
      ${eor}\n\n
      ${JSON.stringify($request.headers)}\n`
    );
  }
  $.done();
}


/*********************************** API *************************************/
function ENV() { const e = "undefined" != typeof $task, t = "undefined" != typeof $loon, s = "undefined" != typeof $httpClient && !t, i = "function" == typeof require && "undefined" != typeof $jsbox; return { isQX: e, isLoon: t, isSurge: s, isNode: "function" == typeof require && !i, isJSBox: i, isRequest: "undefined" != typeof $request, isScriptable: "undefined" != typeof importModule } } function HTTP(e = { baseURL: "" }) { const { isQX: t, isLoon: s, isSurge: i, isScriptable: n, isNode: o } = ENV(), r = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/; const u = {}; return ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"].forEach(l => u[l.toLowerCase()] = (u => (function (u, l) { l = "string" == typeof l ? { url: l } : l; const h = e.baseURL; h && !r.test(l.url || "") && (l.url = h ? h + l.url : l.url); const a = (l = { ...e, ...l }).timeout, c = { onRequest: () => { }, onResponse: e => e, onTimeout: () => { }, ...l.events }; let f, d; if (c.onRequest(u, l), t) f = $task.fetch({ method: u, ...l }); else if (s || i || o) f = new Promise((e, t) => { (o ? require("request") : $httpClient)[u.toLowerCase()](l, (s, i, n) => { s ? t(s) : e({ statusCode: i.status || i.statusCode, headers: i.headers, body: n }) }) }); else if (n) { const e = new Request(l.url); e.method = u, e.headers = l.headers, e.body = l.body, f = new Promise((t, s) => { e.loadString().then(s => { t({ statusCode: e.response.statusCode, headers: e.response.headers, body: s }) }).catch(e => s(e)) }) } const p = a ? new Promise((e, t) => { d = setTimeout(() => (c.onTimeout(), t(`${u} URL: ${l.url} exceeds the timeout ${a} ms`)), a) }) : null; return (p ? Promise.race([p, f]).then(e => (clearTimeout(d), e)) : f).then(e => c.onResponse(e)) })(l, u))), u } function API(e = "untitled", t = !1) { const { isQX: s, isLoon: i, isSurge: n, isNode: o, isJSBox: r, isScriptable: u } = ENV(); return new class { constructor(e, t) { this.name = e, this.debug = t, this.http = HTTP(), this.env = ENV(), this.node = (() => { if (o) { return { fs: require("fs") } } return null })(), this.initCache(); Promise.prototype.delay = function (e) { return this.then(function (t) { return ((e, t) => new Promise(function (s) { setTimeout(s.bind(null, t), e) }))(e, t) }) } } initCache() { if (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")), (i || n) && (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")), o) { let e = "root.json"; this.node.fs.existsSync(e) || this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.root = {}, e = `${this.name}.json`, this.node.fs.existsSync(e) ? this.cache = JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.cache = {}) } } persistCache() { const e = JSON.stringify(this.cache, null, 2); s && $prefs.setValueForKey(e, this.name), (i || n) && $persistentStore.write(e, this.name), o && (this.node.fs.writeFileSync(`${this.name}.json`, e, { flag: "w" }, e => console.log(e)), this.node.fs.writeFileSync("root.json", JSON.stringify(this.root, null, 2), { flag: "w" }, e => console.log(e))) } write(e, t) { if (this.log(`SET ${t}`), -1 !== t.indexOf("#")) { if (t = t.substr(1), n || i) return $persistentStore.write(e, t); if (s) return $prefs.setValueForKey(e, t); o && (this.root[t] = e) } else this.cache[t] = e; this.persistCache() } read(e) { return this.log(`READ ${e}`), -1 === e.indexOf("#") ? this.cache[e] : (e = e.substr(1), n || i ? $persistentStore.read(e) : s ? $prefs.valueForKey(e) : o ? this.root[e] : void 0) } delete(e) { if (this.log(`DELETE ${e}`), -1 !== e.indexOf("#")) { if (e = e.substr(1), n || i) return $persistentStore.write(null, e); if (s) return $prefs.removeValueForKey(e); o && delete this.root[e] } else delete this.cache[e]; this.persistCache() } notify(e, t = "", l = "", h = {}) { const a = h["open-url"], c = h["media-url"]; if (s && $notify(e, t, l, h), n && $notification.post(e, t, l + `${c ? "\n多媒体:" + c : ""}`, { url: a }), i) { let s = {}; a && (s.openUrl = a), c && (s.mediaUrl = c), "{}" === JSON.stringify(s) ? $notification.post(e, t, l) : $notification.post(e, t, l, s) } if (o || u) { const s = l + (a ? `\n点击跳转: ${a}` : "") + (c ? `\n多媒体: ${c}` : ""); if (r) { require("push").schedule({ title: e, body: (t ? t + "\n" : "") + s }) } else console.log(`${e}\n${t}\n${s}\n\n`) } } log(e) { this.debug && console.log(`[${this.name}] LOG: ${this.stringify(e)}`) } info(e) { console.log(`[${this.name}] INFO: ${this.stringify(e)}`) } error(e) { console.log(`[${this.name}] ERROR: ${this.stringify(e)}`) } wait(e) { return new Promise(t => setTimeout(t, e)) } done(e = {}) { console.log('done!'); s || i || n ? $done(e) : o && !r && "undefined" != typeof $context && ($context.headers = e.headers, $context.statusCode = e.statusCode, $context.body = e.body) } stringify(e) { if ("string" == typeof e || e instanceof String) return e; try { return JSON.stringify(e, null, 2) } catch (e) { return "[object Object]" } } }(e, t) }
/*****************************************************************************/
