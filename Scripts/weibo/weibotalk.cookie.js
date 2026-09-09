/**********
 微博超话签到 - 抓包脚本
 适配新版微博客户端 (16.x+)
 更新时间：2026-09-08

⚠️ 若从旧版升级，请先在BoxJS或代理工具中清空旧cookie（wb_delete_cookie=true），再重新获取。
⚠️ 新版列表请求为POST，必须配置 requires-body=true（QX用script-request-body），否则无法捕获POST body。

🐬作者
@Evilbutcher。 https://github.com/evilbutcher
@toulanboy。https://github.com/toulanboy/scripts
@fmz200 重构代码，支持多账号和青龙环境

📌不定期更新各种签到、有趣的脚本，欢迎star🌟

***********************************
【配置步骤，请认真阅读，每一个细节都很重要】
***********************************
1. 根据你当前的软件，配置好script。由于是远程文件，记得顺便更新文件。
2. 打开微博APP --> 底部栏"我的" --> 中间的"超话社区" --> 底部栏"我的" --> "关注"，弹出通知，提示获取已关注超话列表成功。
   注意：需要点击"关注"标签页，等待列表加载完成后才会触发抓包。
3. 点进一个超话页面，手动签到一次。弹出通知，提示获取超话签到链接成功。 若之前所有已经签到，请关注一个新超话进行签到。
4. 回到quanx等软件，关掉获取cookie的rewrite。（loon是关掉获取cookie的脚本）

📌 配置第2个账号方法：第1个账号获取cookie结束后。在微博app中切换到第2个号，进行相同的获取逻辑。

***************************************
【boxjs 订阅， 用于修改脚本配置】
***************************************
box订阅链接：https://raw.githubusercontent.com/toulanboy/scripts/master/toulanboy.boxjs.json
订阅后，可以在box里面进行 cookie清空、通知个数、签到延迟 等设置.

*************************
【Surge 4.2+ 脚本配置】
*************************
微博超话cookie获取 = type=http-request,pattern=^https?://m?api\.weibo\.c(n|om)\/2\/(flowlist|page\/button),requires-body=true,script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/weibo/weibotalk.cookie.js
微博超话 = type=cron,cronexp="5 0  * * *",script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/weibo/weibotalk_signin.js,wake-system=true,timeout=600

*************************
【Loon 2.1+ 脚本配置】
*************************
[script]
cron "5 0 * * *" script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/weibo/weibotalk_signin.js, timeout=600, tag=微博超话
http-request ^https?://m?api\.weibo\.c(n|om)\/2\/(flowlist|page\/button) script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/weibo/weibotalk.cookie.js,requires-body=true, tag=微博超话cookie获取

*************************
【 QX 1.0.10+ 脚本配置 】
*************************
[rewrite_local]
^https?://m?api\.weibo\.c(n|om)\/2\/(flowlist|page\/button) url script-request-body https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/weibo/weibotalk.cookie.js
[task]
5 0 * * * https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/weibo/weibotalk_signin.js, tag=微博超话


[MITM]
hostname = api.weibo.cn, mapi.weibo.com

*************************
【Shadowrocket 脚本配置】
*************************
[Script]
微博超话cookie获取 = type=http-request,pattern=^https?://m?api\.weibo\.c(n|om)\/2\/(flowlist|page\/button),requires-body=true,script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/weibo/weibotalk.cookie.js
微博超话 = type=cron,cronexp="5 0  * * *",script-path=https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/weibo/weibotalk_signin.js,wake-system=true,timeout=600

[MITM]
hostname = api.weibo.cn, mapi.weibo.com

*********/
$ = new Env("微博超话")
const TOKEN_KEY = "fmz200_weibotalk_token"

if ($request && $request.method != 'OPTIONS') {
  const url = $request.url

  // 拦截超话关注列表请求: POST flowlist, body含 fid=232478_-_super_topic_followed
  if (url.includes('/2/flowlist') && $request.body &&
      $request.body.includes('fid=232478_-_super_topic_followed')) {
    handleListCapture(url, $request.headers, $request.body)
  }
  // 拦截签到请求: GET page/button, URL含 active_checkin
  else if (url.includes('page/button') && url.includes('active_checkin')) {
    handleCheckinCapture(url, $request.headers)
  }
}

$.done()

function handleListCapture(url, headers, body) {
  const userId = getHeader(headers, 'x-log-uid') || 'unknown'
  let tokens = JSON.parse($.getdata(TOKEN_KEY) || "[]")

  let token = tokens.find(t => t.userId === userId)
  let firstCapture = !token
  if (token) {
    // 已有该账号的列表请求参数；签到脚本每次运行时会实时请求最新列表，不覆盖、不重复通知。
    console.log(`🔁已有超话列表参数 [${userId}]，跳过重复获取`)
    return
  } else {
    tokens.push({
      userId: userId,
      tokenUrl: url,
      tokenHeaders: JSON.stringify(headers),
      tokenBody: body,
      checkinurl: "",
      checkinHeaders: ""
    })
  }

  $.setdata(JSON.stringify(tokens), TOKEN_KEY)
  if (firstCapture) {
    $.msg("微博超话", `✅获取已关注超话列表成功 [${userId}]`, "✨接下来，请点进一个超话进行签到\n如果没有签到的超话，请关注新的进行签到。")
  } else {
    console.log(`🔁刷新超话列表请求 [${userId}]，不重复通知`)
  }
}

function handleCheckinCapture(url, headers) {
  const userId = getHeader(headers, 'x-log-uid') || 'unknown'
  let tokens = JSON.parse($.getdata(TOKEN_KEY) || "[]")

  let token = tokens.find(t => t.userId === userId && !t.checkinurl)
  if (token) {
    // 找到该账号且尚未获取签到链接
    token.checkinurl = url
    token.checkinHeaders = JSON.stringify(headers)
    $.setdata(JSON.stringify(tokens), TOKEN_KEY)
    $.msg("微博超话", `🎉获取超话签到链接成功 [${userId}]`, `若之前已弹出【获取已关注列表成功】的通知，那么已完成当前账号cookie获取。\n🚨若你只需要签到1个账号，请现在去关闭获取cookie的脚本或重写。`)
  } else {
    $.msg("微博超话", "❌请先获取超话列表链接", "请先打开微博 → 我的 → 超话社区 → 我的 → 关注")
  }
}

function getHeader(headers, name) {
  if (!headers) return ''
  const lower = name.toLowerCase()
  for (const key in headers) {
    if (key.toLowerCase() === lower) return headers[key]
  }
  return ''
}

//@Chavy
function Env(s) {
  this.name = s, this.data = null, this.logs = [], this.isSurge = (() => "undefined" != typeof $httpClient), this.isQuanX = (() => "undefined" != typeof $task), this.isNode = (() => "undefined" != typeof module && !!module.exports), this.log = ((...s) => {
    this.logs = [...this.logs, ...s], s ? console.log(s.join("\n")) : console.log(this.logs.join("\n"))
  }), this.msg = ((s = this.name, t = "", i = "") => {
    this.isSurge() && $notification.post(s, t, i), this.isQuanX() && $notify(s, t, i);
    const e = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
    s && e.push(s), t && e.push(t), i && e.push(i), console.log(e.join("\n"))
  }), this.getdata = (s => {
    if (this.isSurge()) return $persistentStore.read(s);
    if (this.isQuanX()) return $prefs.valueForKey(s);
    if (this.isNode()) {
      const t = "box.dat";
      return this.fs = this.fs ? this.fs : require("fs"), this.fs.existsSync(t) ? (this.data = JSON.parse(this.fs.readFileSync(t)), this.data[s]) : null
    }
  }), this.setdata = ((s, t) => {
    if (this.isSurge()) return $persistentStore.write(s, t);
    if (this.isQuanX()) return $prefs.setValueForKey(s, t);
    if (this.isNode()) {
      const i = "box.dat";
      return this.fs = this.fs ? this.fs : require("fs"), !!this.fs.existsSync(i) && (this.data = JSON.parse(this.fs.readFileSync(i)), this.data[t] = s, this.fs.writeFileSync(i, JSON.stringify(this.data)), !0)
    }
  }), this.wait = ((s, t = s) => i => setTimeout(() => i(), Math.floor(Math.random() * (t - s + 1) + s))), this.get = ((s, t) => this.send(s, "GET", t)), this.post = ((s, t) => this.send(s, "POST", t)), this.send = ((s, t, i) => {
    if (this.isSurge()) {
      const e = "POST" == t ? $httpClient.post : $httpClient.get;
      e(s, (s, t, e) => {
        t && (t.body = e, t.statusCode = t.status), i(s, t, e)
      })
    }
    this.isQuanX() && (s.method = t, $task.fetch(s).then(s => {
      s.status = s.statusCode, i(null, s, s.body)
    }, s => i(s.error, s, s))), this.isNode() && (this.request = this.request ? this.request : require("request"), s.method = t, s.gzip = !0, this.request(s, (s, t, e) => {
      t && (t.status = t.statusCode), i(null, t, e)
    }))
  }), this.done = ((s = {}) => this.isNode() ? null : $done(s))
}
