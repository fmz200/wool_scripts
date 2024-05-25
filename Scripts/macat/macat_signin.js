/*
  脚本作用：马克喵，每日签到
  更新时间：2023.10.14 20:55
  参考脚本：https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/macat.js
  [task_local]
  22 7 * * * https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/macat/macat_signin.js, tag=马克喵签到, img-url=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/macat.png, enabled=true
  @params:"fmz200.macat_loginBody" (boxjs自行填入,包含账号密码信息等)
  格式: `action=user_login&username=xxx%40gmail.com&password=xxx&rememberme=1`
*/

const $ = new Env("macat");

signIn()
  .catch((e) => $.log(e))
  .finally(() => {
    $.log("ok");
    $.done();
  });

async function signIn() {
  const ck1 = await login();
  const nonce = await get_nonce(ck1);

  let options = {
    url: "https://www.macat.vip/wp-admin/admin-ajax.php",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-US;q=0.7,en-GB;q=0.6",
      cookie: ck1,
    },
    body: `action=user_qiandao&nonce=${nonce}`,
  };

  return $.http.post(options).then((resp) => {
    $.log("🟢正在签到...");
    // $.log(resp.body);
    var obj = JSON.parse(resp.body);
    if (obj.status == 1) {
      var notice = "🎉" + obj.msg;
      $.log(notice);
      $.msg($.name, notice);
      $.done();
    } else {
      if (obj.msg) {
        $.log(obj.msg);
        $.msg($.name, obj.msg);
        $.done();
      } else {
        $.log("🔴签到失败!", resp.body);
        $.msg($.name, "🔴签到失败!");
        $.done();
      }
    }
  });
}

async function get_nonce(ck1) {
  const ck2 = " wordpress_test_cookie=WP%20Cookie%20check; ";
  const ck_user = ck1 + "; " + ck2;

  let options = {
    url: `https://www.macat.vip/user`,
    headers: {
      "User-Agent": `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15`,
      Cookie: ck_user,
    },
  };

  return $.http.get(options).then((resp) => {
    $.log("🟢正在获取user页面...");
    //   $.log(resp.body);
    var reg =
      /data-nonce=\"(.*)\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"每日签到奖励: 0.2喵币\"\>/;
    if (resp.body.search(reg) != -1) {
      var nonce = reg.exec(resp.body)[1];
      $.log("🎉获取签到nonce成功!");
      $.log(nonce);
      return nonce;
    } else {
      $.log("🔴获取签到nonce失败!");
      $.log(resp.body);
      $.msg($.name, "🔴获取签到nonce失败!");
      $.done();
    }
  });
}

function login() {
  const loginBody = $.getdata("fmz200.macat_loginBody");

  let options = {
    url: "https://www.macat.vip/wp-admin/admin-ajax.php",
    headers: {
      "User-Agent": `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15`,
      Cookie: `wordpress_test_cookie=WP%20Cookie%20check;`,
    },
    body: loginBody,
  };

  return $.http.post(options).then((resp) => {
      $.log("🟢正在登录...");
      // $.log(resp.body);
      var obj = JSON.parse(resp.body);
      if (obj.status == 1) {
        $.log("🎉" + obj.msg);
        var set_cookie = resp.headers["Set-Cookie"];
        // $.log(set_cookie);

        // 数据处理:去除cookie中的附带信息,保留变量值
        var c = [];
        var a = set_cookie.split(","); // 逗号分隔每条cookie得到的数组
        for (var i = 0; i < a.length; i++) {
          var b = a[i].split(";"); // 分号分隔每条cookie详细信息
          c.push(b[0]); // b[0]即为cookie变量值
        }
        // console.log(c);

        var cookie = "";
        var reg = /wordpress_logged_in_283f6a4de97ca3c279fbc4071e17aa86=(.*)/;
        for (var j = 0; j < c.length; j++) {
          if (c[j].search(reg) != -1) {
            var cookie = c[j];
            // $.log(c[j]);
            break;
          }
        }
        cookie = cookie.trim();
        if (cookie) {
          $.log("🎉解析cookie成功!");
          $.log(cookie);
          return cookie; // 返回cookie
        } else {
          $.log("🔴解析cookie失败!");
          $.log(set_cookie);
          $.msg($.name, "🔴解析cookie失败!");
          $.done();
        }
      }
      // 登录失败
      else {
        $.log("🔴" + obj.msg);
        $.log(resp.body);
        $.msg($.name, "🔴登录失败!");
        $.done();
      }
    },
    (reason) => {
      $.msg($.name, "❌登录错误!");
      $.log(reason.error);
      $.done();
    }
  );
}

function Env(t, s) {
  class e {
    constructor(t) {
      this.env = t;
    }
    send(t, s = "GET") {
      t = "string" == typeof t ? { url: t } : t;
      let e = this.get;
      return (
        "POST" === s && (e = this.post),
        new Promise((s, i) => {
          e.call(this, t, (t, e, r) => {
            t ? i(t) : s(e);
          });
        })
      );
    }
    get(t) {
      return this.send.call(this.env, t);
    }
    post(t) {
      return this.send.call(this.env, t, "POST");
    }
  }
  return new (class {
    constructor(t, s) {
      (this.name = t),
        (this.http = new e(this)),
        (this.data = null),
        (this.dataFile = "box.dat"),
        (this.logs = []),
        (this.isMute = !1),
        (this.isNeedRewrite = !1),
        (this.logSeparator = "\n"),
        (this.encoding = "utf-8"),
        (this.startTime = new Date().getTime()),
        Object.assign(this, s),
        this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`);
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports;
    }
    isQuanX() {
      return "undefined" != typeof $task;
    }
    isSurge() {
      return (
        "undefined" != typeof $environment && $environment["surge-version"]
      );
    }
    isLoon() {
      return "undefined" != typeof $loon;
    }
    isShadowrocket() {
      return "undefined" != typeof $rocket;
    }
    isStash() {
      return (
        "undefined" != typeof $environment && $environment["stash-version"]
      );
    }
    toObj(t, s = null) {
      try {
        return JSON.parse(t);
      } catch {
        return s;
      }
    }
    toStr(t, s = null) {
      try {
        return JSON.stringify(t);
      } catch {
        return s;
      }
    }
    getjson(t, s) {
      let e = s;
      const i = this.getdata(t);
      if (i)
        try {
          e = JSON.parse(this.getdata(t));
        } catch {}
      return e;
    }
    setjson(t, s) {
      try {
        return this.setdata(JSON.stringify(t), s);
      } catch {
        return !1;
      }
    }
    getScript(t) {
      return new Promise((s) => {
        this.get({ url: t }, (t, e, i) => s(i));
      });
    }
    runScript(t, s) {
      return new Promise((e) => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        (r = r ? 1 * r : 20), (r = s && s.timeout ? s.timeout : r);
        const [o, h] = i.split("@"),
          a = {
            url: `http://${h}/v1/scripting/evaluate`,
            body: { script_text: t, mock_type: "cron", timeout: r },
            headers: { "X-Key": o, Accept: "*/*" },
            timeout: r,
          };
        this.post(a, (t, s, i) => e(i));
      }).catch((t) => this.logErr(t));
    }
    loaddata() {
      if (!this.isNode()) return {};
      {
        (this.fs = this.fs ? this.fs : require("fs")),
          (this.path = this.path ? this.path : require("path"));
        const t = this.path.resolve(this.dataFile),
          s = this.path.resolve(process.cwd(), this.dataFile),
          e = this.fs.existsSync(t),
          i = !e && this.fs.existsSync(s);
        if (!e && !i) return {};
        {
          const i = e ? t : s;
          try {
            return JSON.parse(this.fs.readFileSync(i));
          } catch (t) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        (this.fs = this.fs ? this.fs : require("fs")),
          (this.path = this.path ? this.path : require("path"));
        const t = this.path.resolve(this.dataFile),
          s = this.path.resolve(process.cwd(), this.dataFile),
          e = this.fs.existsSync(t),
          i = !e && this.fs.existsSync(s),
          r = JSON.stringify(this.data);
        e
          ? this.fs.writeFileSync(t, r)
          : i
          ? this.fs.writeFileSync(s, r)
          : this.fs.writeFileSync(t, r);
      }
    }
    lodash_get(t, s, e) {
      const i = s.replace(/\[(\d+)\]/g, ".$1").split(".");
      let r = t;
      for (const t of i) if (((r = Object(r)[t]), void 0 === r)) return e;
      return r;
    }
    lodash_set(t, s, e) {
      return Object(t) !== t
        ? t
        : (Array.isArray(s) || (s = s.toString().match(/[^.[\]]+/g) || []),
          (s
            .slice(0, -1)
            .reduce(
              (t, e, i) =>
                Object(t[e]) === t[e]
                  ? t[e]
                  : (t[e] = Math.abs(s[i + 1]) >> 0 == +s[i + 1] ? [] : {}),
              t
            )[s[s.length - 1]] = e),
          t);
    }
    getdata(t) {
      let s = this.getval(t);
      if (/^@/.test(t)) {
        const [, e, i] = /^@(.*?)\.(.*?)$/.exec(t),
          r = e ? this.getval(e) : "";
        if (r)
          try {
            const t = JSON.parse(r);
            s = t ? this.lodash_get(t, i, "") : s;
          } catch (t) {
            s = "";
          }
      }
      return s;
    }
    setdata(t, s) {
      let e = !1;
      if (/^@/.test(s)) {
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(s),
          o = this.getval(i),
          h = i ? ("null" === o ? null : o || "{}") : "{}";
        try {
          const s = JSON.parse(h);
          this.lodash_set(s, r, t), (e = this.setval(JSON.stringify(s), i));
        } catch (s) {
          const o = {};
          this.lodash_set(o, r, t), (e = this.setval(JSON.stringify(o), i));
        }
      } else e = this.setval(t, s);
      return e;
    }
    getval(t) {
      return this.isSurge() ||
        this.isShadowrocket() ||
        this.isLoon() ||
        this.isStash()
        ? $persistentStore.read(t)
        : this.isQuanX()
        ? $prefs.valueForKey(t)
        : this.isNode()
        ? ((this.data = this.loaddata()), this.data[t])
        : (this.data && this.data[t]) || null;
    }
    setval(t, s) {
      return this.isSurge() ||
        this.isShadowrocket() ||
        this.isLoon() ||
        this.isStash()
        ? $persistentStore.write(t, s)
        : this.isQuanX()
        ? $prefs.setValueForKey(t, s)
        : this.isNode()
        ? ((this.data = this.loaddata()),
          (this.data[s] = t),
          this.writedata(),
          !0)
        : (this.data && this.data[s]) || null;
    }
    initGotEnv(t) {
      (this.got = this.got ? this.got : require("got")),
        (this.cktough = this.cktough ? this.cktough : require("tough-cookie")),
        (this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()),
        t &&
          ((t.headers = t.headers ? t.headers : {}),
          void 0 === t.headers.Cookie &&
            void 0 === t.cookieJar &&
            (t.cookieJar = this.ckjar));
    }
    get(t, s = () => {}) {
      if (
        (t.headers &&
          (delete t.headers["Content-Type"],
          delete t.headers["Content-Length"]),
        this.isSurge() ||
          this.isShadowrocket() ||
          this.isLoon() ||
          this.isStash())
      )
        this.isSurge() &&
          this.isNeedRewrite &&
          ((t.headers = t.headers || {}),
          Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
          $httpClient.get(t, (t, e, i) => {
            !t &&
              e &&
              ((e.body = i),
              (e.statusCode = e.status ? e.status : e.statusCode),
              (e.status = e.statusCode)),
              s(t, e, i);
          });
      else if (this.isQuanX())
        this.isNeedRewrite &&
          ((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })),
          $task.fetch(t).then(
            (t) => {
              const { statusCode: e, statusCode: i, headers: r, body: o } = t;
              s(null, { status: e, statusCode: i, headers: r, body: o }, o);
            },
            (t) => s((t && t.error) || "UndefinedError")
          );
      else if (this.isNode()) {
        let e = require("iconv-lite");
        this.initGotEnv(t),
          this.got(t)
            .on("redirect", (t, s) => {
              try {
                if (t.headers["set-cookie"]) {
                  const e = t.headers["set-cookie"]
                    .map(this.cktough.Cookie.parse)
                    .toString();
                  e && this.ckjar.setCookieSync(e, null),
                    (s.cookieJar = this.ckjar);
                }
              } catch (t) {
                this.logErr(t);
              }
            })
            .then(
              (t) => {
                const {
                    statusCode: i,
                    statusCode: r,
                    headers: o,
                    rawBody: h,
                  } = t,
                  a = e.decode(h, this.encoding);
                s(
                  null,
                  { status: i, statusCode: r, headers: o, rawBody: h, body: a },
                  a
                );
              },
              (t) => {
                const { message: i, response: r } = t;
                s(i, r, r && e.decode(r.rawBody, this.encoding));
              }
            );
      }
    }
    post(t, s = () => {}) {
      const e = t.method ? t.method.toLocaleLowerCase() : "post";
      if (
        (t.body &&
          t.headers &&
          !t.headers["Content-Type"] &&
          (t.headers["Content-Type"] = "application/x-www-form-urlencoded"),
        t.headers && delete t.headers["Content-Length"],
        this.isSurge() ||
          this.isShadowrocket() ||
          this.isLoon() ||
          this.isStash())
      )
        this.isSurge() &&
          this.isNeedRewrite &&
          ((t.headers = t.headers || {}),
          Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
          $httpClient[e](t, (t, e, i) => {
            !t &&
              e &&
              ((e.body = i),
              (e.statusCode = e.status ? e.status : e.statusCode),
              (e.status = e.statusCode)),
              s(t, e, i);
          });
      else if (this.isQuanX())
        (t.method = e),
          this.isNeedRewrite &&
            ((t.opts = t.opts || {}), Object.assign(t.opts, { hints: !1 })),
          $task.fetch(t).then(
            (t) => {
              const { statusCode: e, statusCode: i, headers: r, body: o } = t;
              s(null, { status: e, statusCode: i, headers: r, body: o }, o);
            },
            (t) => s((t && t.error) || "UndefinedError")
          );
      else if (this.isNode()) {
        let i = require("iconv-lite");
        this.initGotEnv(t);
        const { url: r, ...o } = t;
        this.got[e](r, o).then(
          (t) => {
            const { statusCode: e, statusCode: r, headers: o, rawBody: h } = t,
              a = i.decode(h, this.encoding);
            s(
              null,
              { status: e, statusCode: r, headers: o, rawBody: h, body: a },
              a
            );
          },
          (t) => {
            const { message: e, response: r } = t;
            s(e, r, r && i.decode(r.rawBody, this.encoding));
          }
        );
      }
    }
    time(t, s = null) {
      const e = s ? new Date(s) : new Date();
      let i = {
        "M+": e.getMonth() + 1,
        "d+": e.getDate(),
        "H+": e.getHours(),
        "m+": e.getMinutes(),
        "s+": e.getSeconds(),
        "q+": Math.floor((e.getMonth() + 3) / 3),
        S: e.getMilliseconds(),
      };
      /(y+)/.test(t) &&
        (t = t.replace(
          RegExp.$1,
          (e.getFullYear() + "").substr(4 - RegExp.$1.length)
        ));
      for (let s in i)
        new RegExp("(" + s + ")").test(t) &&
          (t = t.replace(
            RegExp.$1,
            1 == RegExp.$1.length
              ? i[s]
              : ("00" + i[s]).substr(("" + i[s]).length)
          ));
      return t;
    }
    queryStr(t) {
      let s = "";
      for (const e in t) {
        let i = t[e];
        null != i &&
          "" !== i &&
          ("object" == typeof i && (i = JSON.stringify(i)),
          (s += `${e}=${i}&`));
      }
      return (s = s.substring(0, s.length - 1)), s;
    }
    msg(s = t, e = "", i = "", r) {
      const o = (t) => {
        if (!t) return t;
        if ("string" == typeof t)
          return this.isLoon() || this.isShadowrocket()
            ? t
            : this.isQuanX()
            ? { "open-url": t }
            : this.isSurge() || this.isStash()
            ? { url: t }
            : void 0;
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let s = t.openUrl || t.url || t["open-url"],
              e = t.mediaUrl || t["media-url"];
            return { openUrl: s, mediaUrl: e };
          }
          if (this.isQuanX()) {
            let s = t["open-url"] || t.url || t.openUrl,
              e = t["media-url"] || t.mediaUrl,
              i = t["update-pasteboard"] || t.updatePasteboard;
            return { "open-url": s, "media-url": e, "update-pasteboard": i };
          }
          if (this.isSurge() || this.isShadowrocket() || this.isStash()) {
            let s = t.url || t.openUrl || t["open-url"];
            return { url: s };
          }
        }
      };
      if (
        (this.isMute ||
          (this.isSurge() ||
          this.isShadowrocket() ||
          this.isLoon() ||
          this.isStash()
            ? $notification.post(s, e, i, o(r))
            : this.isQuanX() && $notify(s, e, i, o(r))),
        !this.isMuteLog)
      ) {
        let t = [
          "",
          "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3==============",
        ];
        t.push(s),
          e && t.push(e),
          i && t.push(i),
          console.log(t.join("\n")),
          (this.logs = this.logs.concat(t));
      }
    }
    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]),
        console.log(t.join(this.logSeparator));
    }
    logErr(t, s) {
      const e = !(
        this.isSurge() ||
        this.isShadowrocket() ||
        this.isQuanX() ||
        this.isLoon() ||
        this.isStash()
      );
      e
        ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack)
        : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t);
    }
    wait(t) {
      return new Promise((s) => setTimeout(s, t));
    }
    done(t = {}) {
      const s = new Date().getTime(),
        e = (s - this.startTime) / 1e3;
      this.log(
        "",
        `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`
      ),
        this.log(),
        this.isSurge() ||
        this.isShadowrocket() ||
        this.isQuanX() ||
        this.isLoon() ||
        this.isStash()
          ? $done(t)
          : this.isNode() && process.exit(1);
    }
  })(t, s);
}

