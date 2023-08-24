/*
[task_local]
# 拼多多果园-小程序
15 8 * * * pddFruit.js, tag=拼多多果园-小程序, enabled=true
搜mobile.yangkeduo.com，请求头的AccessToken，设置PDD_TOKENS 多账号@分割 
*/
const $ = new Env('拼多多果园-小程序');
// const notify = $.isNode() ? require('./sendNotifySp') : '';
$.shareWids = []
$.lackCardIds = []
$.giftRecords = []
$.lackMsg = ''
$.helpFlag = true // 获取助力码
$.taskList = [36155, 36164, 36125, 37464, 37509, 36013, 36007, 36167, 36132]
if (process.env.PDD_TOKENS) {
    if (process.env.PDD_TOKENS.indexOf('@') > -1) {
        cookieArr = process.env.PDD_TOKENS.split('@');
    } else if (process.env.PDD_TOKENS.indexOf('\n') > -1) {
        cookieArr = process.env.PDD_TOKENS.split('\n');
    } else {
        cookieArr = [process.env.PDD_TOKENS];
    }
} else {
    console.log('未发现有效Cookie，请填写PDD_TOKENS!')
    return
}

console.log(`\n==========共发现${cookieArr.length}个账号==========\n`)
$.index = 0
$.message = ''
!(async () => {
    for (let i = 0; i < cookieArr.length; i++) {
        cookie = cookieArr[i]
        $.redualWater = 0
        $.stealStatus = true
        if (cookie.indexOf('&') > -1) {
            $.accessToken = cookie.split('&')[0]
            $.remark = cookie.split('&')[1]
        } else {
            $.accessToken = cookie
            $.remark = '匿名用户'
        }
        console.log(`\n🔄 当前进行第${i + 1}个账号，用户备注：${$.remark}`)
        await missionList()
        for (let missionKey in $.missionList) {
            if ($.taskList.indexOf(missionKey) == -1) {
                $.taskList.push(missionKey)
            }
        }
        await reward()
        console.log(`\n========常规任务=========`)
        for (let missionKey of $.taskList) {
            $.taskType = missionKey
            console.log(`🎯 去完成任务${$.taskType}`)
            await completeMission()
        }
        console.log(`\n========打卡任务=========`)
        await applyActivity()
        // console.log(`🎯 开始获取好友列表`)
        // await getFriends()
        // if ($.friendList.length > 0) {
        //     for (let friendInfo of $.friendList) {
        //         let isSteal = friendInfo.steal_water_status == null ? false : true
        //         $.stealedName = friendInfo.nickname
        //         $.friendUid = friendInfo.uid
        //         if (isSteal === true) await stealWater()
        //         if ($.stealStatus === false) {
        //             break
        //         }
        //         await $.wait(1000)
        //     }
        // }
        console.log(`\n========开宝箱任务=========`)
        for (let z = 1; z < 6; z++) {
            $.boxOrder = z
            await openBox()
        }
        console.log(`\n========浇水任务=========`)
        await water()
        if ($.redualWater > 10) {
            $.waterTimes = parseInt($.redualWater / 10, 10)
            for (let j = 0; j < $.waterTimes; j++) {
                await water()
                await $.wait(1000)
            }
        }
    }

})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })

function missionList() {
    let url = 'https://mobile.yangkeduo.com/proxy/api/api/manor-query/tag/mission/list?pdduid=0'
    let body = {
        "mission_tag": "HOME_GAIN_WATER_MISSION_LIST_EXTRA",
        "fun_pl": 10,
        "tubetoken": ""
    }
    let myRequest = getPostRequest(url, body);
    return new Promise(async resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                dataObj = JSON.parse(data)
                if (dataObj.error_code != null) {
                    console.log("💥 获取任务列表失败！")
                } else {
                    console.log(`\n✅ 获取任务列表成功！`)
                    $.missionList = dataObj.mission_list
                }
            } catch (e) {
                // console.log(data);
                console.log(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function completeMission() {
    let url = 'https://mobile.yangkeduo.com/proxy/api/api/manor/mission/complete/gain?ts=1671003202054&pdduid=0'
    let body = {
        "mission_type": $.taskType,
        "gain_time": 1,
        "no_reward": false,
        "fun_pl": 10,
        "tubetoken": ""
    }
    let myRequest = getPostRequest(url, body);
    return new Promise(async resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                dataObj = JSON.parse(data)
                if (dataObj.error_code) {
                    console.log(`🚫 任务完成失败：${dataObj.error_msg}`)
                } else {
                    if (dataObj.result == null) {
                        console.log(`💧 任务完成：获得${dataObj.reward_list[0].reward_amount}g水滴，当前水滴${dataObj.water_amount}g`)
                    } else {
                        console.log(`🚫 该任务已经完成过了~`)
                    }
                }
            } catch (e) {
                // console.log(data);
                console.log(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function water() {
    let url = 'https://mobile.yangkeduo.com/proxy/api/api/manor/water/cost?pdduid=1'
    let body = {
        "fun_id": "xcx_home_page",
        "product_scene": 0,
        "lower_end_device": false,
        "fun_pl": 10,
        "location_auth": false,
        "screen_token": "",
        "mission_type": 0,
        "tubetoken": "",
        "atw": true,
        "can_trigger_random_mission": true
    }
    let myRequest = getPostRequest(url, body);
    return new Promise(async resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                dataObj = JSON.parse(data)
                if (dataObj.error_code) {
                    console.log(`🚫 浇水失败：${dataObj.error_msg}`)
                } else {
                    $.redualWater = dataObj.now_water_amount
                    $.progress_text = dataObj.product.progress_text
                    $.activity_water_amount = dataObj.accumulate_water_vo.activity_water_amount
                    console.log(`🧊 浇水成功，还有${$.progress_text}%成熟，剩余${$.redualWater}滴水，明日可领取${$.activity_water_amount}滴水`)
                }
            } catch (e) {
                // console.log(data);
                console.log(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function applyActivity() {
    let url = 'https://mobile.yangkeduo.com/proxy/api/api/manor/common/apply/activity?pdduid=9188599218'
    let body = {
        "type": 18,
        "fun_pl": 10,
        "tubetoken": ""
    }
    let myRequest = getPostRequest(url, body);
    return new Promise(async resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                dataObj = JSON.parse(data)
                if (dataObj.success == true) {
                    console.log(`✅ 获取打卡集水滴任务成功`)
                    console.log(`💧 已连续打卡${dataObj.continuous_check_in_to_collect_water_vo.finished_count}天，打卡${dataObj.continuous_check_in_to_collect_water_vo.total_count}天可获得奖励`)
                } else {
                    console.log(`🚫 未获取到打卡集水滴任务`)
                }
            } catch (e) {
                // console.log(data);
                console.log(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function openBox() {
    let url = 'https://mobile.yangkeduo.com/proxy/api/api/manor/withered/open/box?pdduid=9188599218'
    let body = {
        "box_order": $.boxOrder,
        "tubetoken": "",
        "fun_pl": 10
    }
    let myRequest = getPostRequest(url, body);
    return new Promise(async resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                dataObj = JSON.parse(data)
                if (dataObj.error_code) {
                    console.log(`🚫 获取宝箱信息失败：${dataObj.error_msg}`)
                } else {
                    if (dataObj.status == 3) {
                        console.log(`🚫 获取宝箱信息失败`)
                    } else {
                        console.log(`💧 收取宝箱成功：收获${dataObj.reward_list[0].reward_amount}滴水`)
                    }
                }
            } catch (e) {
                // console.log(data);
                console.log(e, resp)
            } finally {
                resolve();
            }
        })
    })
}


function getFriends() {
    let url = 'https://mobile.yangkeduo.com/proxy/api/api/manor-query/friend/list/page?pdduid=1'
    let body = {
        "page_num": 1,
        "fun_pl": 10,
        "tubetoken": ""
    }
    let myRequest = getPostRequest(url, body);
    return new Promise(async resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                dataObj = JSON.parse(data)
                if (dataObj.error_code) {
                    console.log(`🚫 获取好友列表失败：${dataObj.error_msg}`)
                    if (dataObj.error_msg.indexOf('上限') > -1 || dataObj.error_msg.indexOf('异常') > -1) {
                        $.stealStatus = false
                    }
                } else {
                    $.friendList = dataObj.friend_list || []
                }
            } catch (e) {
                // console.log(data);
                console.log(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function stealWater() {
    let url = 'https://mobile.yangkeduo.com/proxy/api/api/manor/steal/water?pdduid=1'
    let body = {
        // "steal_type": 1,
        "fun_pl": 10,
        "friend_uid": $.friendUid,
        "tubetoken": ""
    }
    let myRequest = getPostRequest(url, body);
    return new Promise(async resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                dataObj = JSON.parse(data)
                if (dataObj.error_code) {
                    console.log(`🚫 偷水失败：${dataObj.error_msg}`)
                } else {
                    console.log(`💧 偷水成功：偷取好友【${$.stealedName}】${dataObj.steal_amount}滴水，剩余${dataObj.water_amount}滴水`)
                }
            } catch (e) {
                // console.log(data);
                console.log(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function reward() {
    let url = 'https://mobile.yangkeduo.com/proxy/api/api/manor/gain/accumulate/water/reward?pdduid='
    let body = {
        "fun_pl": 10,
        "tubetoken": ""
    }
    let myRequest = getPostRequest(url, body);
    return new Promise(async resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                dataObj = JSON.parse(data)
                if (dataObj.error_code) {
                    console.log(`🚫 获取前一日奖励失败：${dataObj.error_msg}`)
                } else {
                    console.log(`💧 获取前一日奖励成功：${dataObj.acculate_water_vo.reward_amount}滴水`)
                }
            } catch (e) {
                // console.log(data);
                console.log(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function getPostRequest(url, body, method = "POST") {
    let headers = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "User-Agent": $.UA,
        "Content-Type": "application/json;charset=UTF-8",
        "Host": "mobile.yangkeduo.com",
        "Origin": "https://mobile.yangkeduo.com",
        "AccessToken": $.accessToken
    }
    return { url: url, method: method, headers: headers, body: JSON.stringify(body), timeout: 30000 };
}

function uuid(x = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx") {
    return x.replace(/[xy]/g, function (x) {
        const r = 16 * Math.random() | 0, n = "x" === x ? r : 3 & r | 8;
        return n.toString(36)
    })
}

// prettier-ignore
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
