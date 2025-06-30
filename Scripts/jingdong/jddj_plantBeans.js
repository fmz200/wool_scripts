/*
京东到家鲜豆庄园脚本,支持qx,loon,shadowrocket,surge,nodejs
兼容京东jdCookie.js
手机设备在boxjs里填写cookie
boxjs订阅地址:https://gitee.com/passerby-b/javascript/raw/master/JD/passerby-b.boxjs.json
TG群:https://t.me/passerbyb2021

[task_local]
10 8 * * * https://raw.githubusercontent.com/passerby-b/JDDJ/main/jddj_plantBeans.js

[Script]
cron "10 8 * * *" script-path=https://raw.githubusercontent.com/passerby-b/JDDJ/main/jddj_plantBeans.js,tag=京东到家鲜豆庄园

*/

const $ = new API("jddj_plantBeans");
let ckPath = './jdCookie.js';//ck路径,环境变量:JDDJ_CKPATH

let cookies = [];
let thiscookie = '', deviceid = '';
let lat = '30.' + Math.round(Math.random() * (99999 - 10000) + 10000);
let lng = '114.' + Math.round(Math.random() * (99999 - 10000) + 10000);
let cityid = Math.round(Math.random() * (1500 - 1000) + 1000);
!(async () => {
    if (cookies.length == 0) {
        if ($.env.isNode) {
            if (process.env.JDDJ_CKPATH) ckPath = process.env.JDDJ_CKPATH;
            let jdcookies = require(ckPath);
            for (let key in jdcookies) if (!!jdcookies[key]) cookies.push(jdcookies[key]);
        }
        else {
            let ckstr = $.read('#jddj_cookies');
            if (!!ckstr) {
                if (ckstr.indexOf(',') < 0) {
                    cookies.push(ckstr);
                } else {
                    cookies = ckstr.split(',');
                }
            }
        }
    }
    if (cookies.length == 0) {
        console.log(`\r\n请先填写cookie`);
        return;
    }

    for (let i = 0; i < cookies.length; i++) {
        console.log(`\r\n★★★★★开始执行第${i + 1}个账号,共${cookies.length}个账号★★★★★`);
        thiscookie = cookies[i];
        if (!thiscookie) continue;

        deviceid = _uuid();
        let option = taskLoginUrl(deviceid, thiscookie);
        await $.http.get(option).then(response => {
            let data = JSON.parse(response.body);
            if (data.code == 0) {
                thiscookie = 'deviceid_pdj_jd=' + deviceid + '; PDJ_H5_PIN=' + data.result.PDJ_H5_PIN + '; o2o_m_h5_sid=' + data.result.o2o_m_h5_sid + ';';
                //sid = data.result.o2o_m_h5_sid;
            }
            else thiscookie = 'aabbcc';
        });

        await userinfo();
        await $.wait(1000);

        let tslist = await taskList();
        if (tslist.code == 1) {
            $.notify('第' + (i + 1) + '个账号cookie过期', '请访问\nhttps://bean.m.jd.com/bean/signIndex.action\n抓取cookie', { url: 'https://bean.m.jd.com/bean/signIndex.action' });
            continue;
        }

        await sign();
        await $.wait(1000);

        await beansLottery();
        await $.wait(1000);

        await getPoints();
        await $.wait(1000);

        await runTask(tslist);
        await $.wait(1000);

        await watering();
        await $.wait(1000);

    }

})().catch((e) => {
    console.log('', `❌失败! 原因: ${e}!`, '');
}).finally(() => {
    $.done();
})

//个人信息
async function userinfo() {
    return new Promise(async resolve => {
        try {
            let option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&platCode=H5&appName=paidaojia&channel=&appVersion=8.7.6&jdDevice=&functionId=mine%2FgetUserAccountInfo&body=%7B%22refPageSource%22:%22%22,%22fromSource%22:2,%22pageSource%22:%22myinfo%22,%22ref%22:%22%22,%22ctp%22:%22myinfo%22%7D&jda=&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid + '', '')

            $.http.get(option).then(response => {
                let data = JSON.parse(response.body);
                if (data.code == 0) {
                    nickname = data.result.userInfo.userBaseInfo.nickName;
                    console.log("●●●" + nickname + "●●●");
                }
            })
            resolve();

        } catch (error) {
            console.log('\n【个人信息】:' + error);
            resolve();
        }
    })
}

//任务列表
async function taskList() {
    return new Promise(async resolve => {
        try {
            let option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&functionId=task%2Flist&isNeedDealError=true&body=%7B%22modelId%22%3A%22M10003%22%2C%22plateCode%22%3A1%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + '&deviceToken=' + deviceid + '&deviceId=' + deviceid, '');

            $.http.get(option).then(response => {
                var data = JSON.parse(response.body);
                //console.log(response.body);
                resolve(data);
            })

        } catch (error) {
            console.log('\n【任务列表】:' + error);
            resolve({});
        }
    })
}

//庄园签到
async function sign() {
    return new Promise(async resolve => {
        try {
            let option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&functionId=signin%2FuserSigninNew&isNeedDealError=true&body=%7B%22channel%22%3A%22qiandao_indexball%22%2C%22cityId%22%3A' + cityid + '%2C%22longitude%22%3A' + lng + '%2C%22latitude%22%3A' + lat + '%2C%22ifCic%22%3A0%7D&lat=' + lat + '&lng=' + lng + '&lat_pos=' + lat + '&lng_pos=' + lng + '&city_id=' + cityid + '&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid + '', ``);
            $.http.get(option).then(response => {
                let data = JSON.parse(response.body);
                console.log('\n【庄园签到】:' + data.msg);
                resolve();
            })

        } catch (error) {
            console.log('\n【庄园签到】:' + error);
            resolve();
        }
    })
}

//浇水
async function watering() {
    return new Promise(async resolve => {
        try {
            let option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()), 'functionId=plantBeans%2Fwatering&isNeedDealError=true&method=POST&body=%7B%22activityId%22%3A%2223e4a58bca00bef%22%2C%22waterAmount%22%3A100%7D&lat=' + lat + '&lng=' + lng + '&lat_pos=' + lat + '&lng_pos=' + lng + '&city_id=' + cityid + '&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid + '');

            let waterStatus = 1, waterCount = 0;
            do {
                waterCount++;
                console.log(`\n**********开始执行第${waterCount}次浇水**********`);

                await $.http.post(option).then(async response => {
                    let data = JSON.parse(response.body);
                    console.log('\n【浇水】:' + data.msg);
                    waterStatus = data.code;
                })
                await $.wait(1000);
            } while (waterStatus == 0);
            resolve();

        } catch (error) {
            console.log('\n【浇水】:' + error);
            resolve();
        }

    })
}

//一轮结束领鲜豆并参加下一轮
async function getPoints() {
    return new Promise(async resolve => {
        try {
            let option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&_funid_=plantBeans/getActivityInfo', 'functionId=plantBeans%2FgetActivityInfo&isNeedDealError=true&method=POST&body=%7B%7D&lat=' + lat + '&lng=' + lat + '&lat_pos=' + lat + '&lng_pos=' + lat + '&city_id=' + cityid + '&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid);

            let perid = '', nextid = ''; activityDay = '', pre_buttonId = 0;
            await $.http.post(option).then(response => {
                //console.log(response.body);
                let data = JSON.parse(response.body);
                perid = data.result.pre.activityId;
                if (data.result.next) nextid = data.result.next.activityId;
                activityDay = data.result.cur.activityDay;
                pre_buttonId = data.result.pre.buttonId;
            })

            await $.wait(1000);

            //var date = new Date();
            //activityDay = activityDay.split('-')[1].split('.')[1];
            if (pre_buttonId == 1) {
                option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()), 'functionId=plantBeans%2FgetPoints&isNeedDealError=true&method=POST&body=%7B%22activityId%22%3A%22' + perid + '%22%7D&lat=' + lat + '&lng=' + lng + '&lat_pos=' + lat + '&lng_pos=' + lng + '&city_id=' + cityid + '&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid + '');

                await $.http.post(option).then(response => {
                    let data = JSON.parse(response.body);
                    console.log('\n【一轮结束领鲜豆】:' + data.msg);
                })

                await $.wait(1000);

                // option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()), 'functionId=plantBeans%2FgetActivityInfo&isNeedDealError=true&method=POST&body=%7B%22activityId%22%3A%22' + nextid + '%22%7D&lat=' + lat + '&lng=' + lng + '&lat_pos=' + lat + '&lng_pos=' + lng + '&city_id=' + cityid + '&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid + '');

                // await $.http.post(option).then(response => {
                //     let data = JSON.parse(response.body);
                //     console.log('\n【参加下一轮种鲜豆】:' + data.msg);
                // })
            }

        } catch (error) {
            console.log('\n【一轮结束领鲜豆】:' + error);
            resolve();
        } finally {
            resolve();
        }

    })

}

//发现露水
async function beansLottery() {
    return new Promise(async resolve => {
        try {
            for (let index = 0; index < 20; index++) {
                let option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&_funid_=plantBeans/beansLottery', 'functionId=plantBeans%2FbeansLottery&isNeedDealError=true&method=POST&body=%7B%22activityId%22%3A%22241254dc8b9ae89%22%7D&lat=' + lat + '&lng=' + lng + '&lat_pos=' + lat + '&lng_pos=' + lng + '&city_id=' + cityid + '&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + '&deviceToken=' + deviceid + '&deviceId=' + deviceid);
                await $.http.post(option).then(response => {
                    let data = JSON.parse(response.body);
                    if (!!data.result.water) console.log('\n【发现露水】:' + data.result.water + 'g');
                    else console.log('\n【发现露水】:' + data.result.text.replace(/\n/g, ''));
                });
                await $.wait(1000);
            }
            resolve();

        } catch (error) {
            console.log('\n【发现露水】:' + error);
            resolve();
        }
    })
}

async function runTask(tslist) {
    return new Promise(async resolve => {
        try {
            for (let index = 0; index < tslist.result.taskInfoList.length; index++) {
                const item = tslist.result.taskInfoList[index];

                //领取任务
                let option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&functionId=task%2Freceived&isNeedDealError=true&body=%7B%22modelId%22%3A%22' + item.modelId + '%22%2C%22taskId%22%3A%22' + item.taskId + '%22%2C%22taskType%22%3A' + item.taskType + '%2C%22plateCode%22%3A1%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid + '', ``);
                await $.http.get(option).then(response => {
                    var data = JSON.parse(response.body), msg = '';
                    if (data.code == 0) {
                        msg = data.msg + ',奖励:' + data.result.awardValue;
                    } else {
                        msg = data.msg;
                    }
                    console.log('\n领取任务【' + item.taskName + '】:' + msg);
                })

                if (item.browseTime > -1) {
                    for (let t = 0; t < parseInt(item.browseTime); t++) {
                        await $.wait(1000);
                        console.log('计时:' + (t + 1) + '秒...');
                    }
                }

                //结束任务
                option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&functionId=task%2Ffinished&isNeedDealError=true&body=%7B%22modelId%22%3A%22' + item.modelId + '%22%2C%22taskId%22%3A%22' + item.taskId + '%22%2C%22taskType%22%3A' + item.taskType + '%2C%22plateCode%22%3A1%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid + '', ``);
                await $.http.get(option).then(response => {
                    var data = JSON.parse(response.body), msg = '';
                    if (data.code == 0) {
                        msg = data.msg + ',奖励:' + data.result.awardValue;
                    } else {
                        msg = data.msg;
                    }
                    console.log('\n任务完成【' + item.taskName + '】:' + msg);
                })

                //领取奖励
                option = urlTask('https://daojia.jd.com/client?_jdrandom=1618492672164&functionId=task%2FsendPrize&isNeedDealError=true&body=%7B%22modelId%22%3A%22' + item.modelId + '%22%2C%22taskId%22%3A%22' + item.taskId + '%22%2C%22taskType%22%3A' + item.taskType + '%2C%22plateCode%22%3A1%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid + '', ``);
                await $.http.get(option).then(response => {
                    var data = JSON.parse(response.body), msg = '';
                    if (data.code == 0) {
                        msg = data.msg + ',奖励:' + data.result.awardValue;
                    } else {
                        msg = data.msg;
                    }
                    console.log('\n领取奖励【' + item.taskName + '】:' + msg);
                })


            }
            resolve();
        } catch (error) {
            console.log('\n【执行任务】:' + error);
            resolve();
        }

    })
}

function urlTask(url, body) {
    let option = {
        url: url,
        headers: {
            'Host': 'daojia.jd.com',
            'Content-Type': 'application/x-www-form-urlencoded;',
            'Origin': 'https://daojia.jd.com',
            'Cookie': thiscookie,
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148________appName=jdLocal&platform=iOS&commonParams={"sharePackageVersion":"2"}&djAppVersion=8.7.5&supportDJSHWK',
            'Accept-Language': 'zh-cn'
        },
        body: body
    };
    return option;
}

function taskLoginUrl(deviceid, thiscookie) {
    return {
        url: 'https://daojia.jd.com/client?_jdRandom=' + (+new Date()) + '&functionId=xapp/loginByPtKeyNew&body=' + escape(JSON.stringify({ "fromSource": 5, "businessChannel": 150, "subChannel": "", "regChannel": "" })) + 'channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&code=011UYn000apwmL1nWB000aGiv74UYn03&deviceId=' + deviceid + '&deviceToken=' + deviceid + '&deviceModel=appmodel',
        headers: {
            "Cookie": 'deviceid_pdj_jd=' + deviceid + ';' + thiscookie + ';',
            "Host": "daojia.jd.com",
            "referer": "https://daojia.jd.com/taroh5/h5dist/",
            'Content-Type': 'application/x-www-form-urlencoded',
            "User-Agent": 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)'
        }
    }
}

function _uuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/*********************************** API *************************************/
function ENV() { const e = "undefined" != typeof $task, t = "undefined" != typeof $loon, s = "undefined" != typeof $httpClient && !t, i = "function" == typeof require && "undefined" != typeof $jsbox; return { isQX: e, isLoon: t, isSurge: s, isNode: "function" == typeof require && !i, isJSBox: i, isRequest: "undefined" != typeof $request, isScriptable: "undefined" != typeof importModule } } function HTTP(e = { baseURL: "" }) { const { isQX: t, isLoon: s, isSurge: i, isScriptable: n, isNode: o } = ENV(), r = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/; const u = {}; return ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"].forEach(l => u[l.toLowerCase()] = (u => (function (u, l) { l = "string" == typeof l ? { url: l } : l; const h = e.baseURL; h && !r.test(l.url || "") && (l.url = h ? h + l.url : l.url); const a = (l = { ...e, ...l }).timeout, c = { onRequest: () => { }, onResponse: e => e, onTimeout: () => { }, ...l.events }; let f, d; if (c.onRequest(u, l), t) f = $task.fetch({ method: u, ...l }); else if (s || i || o) f = new Promise((e, t) => { (o ? require("request") : $httpClient)[u.toLowerCase()](l, (s, i, n) => { s ? t(s) : e({ statusCode: i.status || i.statusCode, headers: i.headers, body: n }) }) }); else if (n) { const e = new Request(l.url); e.method = u, e.headers = l.headers, e.body = l.body, f = new Promise((t, s) => { e.loadString().then(s => { t({ statusCode: e.response.statusCode, headers: e.response.headers, body: s }) }).catch(e => s(e)) }) } const p = a ? new Promise((e, t) => { d = setTimeout(() => (c.onTimeout(), t(`${u} URL: ${l.url} exceeds the timeout ${a} ms`)), a) }) : null; return (p ? Promise.race([p, f]).then(e => (clearTimeout(d), e)) : f).then(e => c.onResponse(e)) })(l, u))), u } function API(e = "untitled", t = !1) { const { isQX: s, isLoon: i, isSurge: n, isNode: o, isJSBox: r, isScriptable: u } = ENV(); return new class { constructor(e, t) { this.name = e, this.debug = t, this.http = HTTP(), this.env = ENV(), this.node = (() => { if (o) { return { fs: require("fs") } } return null })(), this.initCache(); Promise.prototype.delay = function (e) { return this.then(function (t) { return ((e, t) => new Promise(function (s) { setTimeout(s.bind(null, t), e) }))(e, t) }) } } initCache() { if (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")), (i || n) && (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")), o) { let e = "root.json"; this.node.fs.existsSync(e) || this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.root = {}, e = `${this.name}.json`, this.node.fs.existsSync(e) ? this.cache = JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.cache = {}) } } persistCache() { const e = JSON.stringify(this.cache, null, 2); s && $prefs.setValueForKey(e, this.name), (i || n) && $persistentStore.write(e, this.name), o && (this.node.fs.writeFileSync(`${this.name}.json`, e, { flag: "w" }, e => console.log(e)), this.node.fs.writeFileSync("root.json", JSON.stringify(this.root, null, 2), { flag: "w" }, e => console.log(e))) } write(e, t) { if (this.log(`SET ${t}`), -1 !== t.indexOf("#")) { if (t = t.substr(1), n || i) return $persistentStore.write(e, t); if (s) return $prefs.setValueForKey(e, t); o && (this.root[t] = e) } else this.cache[t] = e; this.persistCache() } read(e) { return this.log(`READ ${e}`), -1 === e.indexOf("#") ? this.cache[e] : (e = e.substr(1), n || i ? $persistentStore.read(e) : s ? $prefs.valueForKey(e) : o ? this.root[e] : void 0) } delete(e) { if (this.log(`DELETE ${e}`), -1 !== e.indexOf("#")) { if (e = e.substr(1), n || i) return $persistentStore.write(null, e); if (s) return $prefs.removeValueForKey(e); o && delete this.root[e] } else delete this.cache[e]; this.persistCache() } notify(e, t = "", l = "", h = {}) { const a = h["open-url"], c = h["media-url"]; if (s && $notify(e, t, l, h), n && $notification.post(e, t, l + `${c ? "\n多媒体:" + c : ""}`, { url: a }), i) { let s = {}; a && (s.openUrl = a), c && (s.mediaUrl = c), "{}" === JSON.stringify(s) ? $notification.post(e, t, l) : $notification.post(e, t, l, s) } if (o || u) { const s = l + (a ? `\n点击跳转: ${a}` : "") + (c ? `\n多媒体: ${c}` : ""); if (r) { require("push").schedule({ title: e, body: (t ? t + "\n" : "") + s }) } else console.log(`${e}\n${t}\n${s}\n\n`) } } log(e) { this.debug && console.log(`[${this.name}] LOG: ${this.stringify(e)}`) } info(e) { console.log(`[${this.name}] INFO: ${this.stringify(e)}`) } error(e) { console.log(`[${this.name}] ERROR: ${this.stringify(e)}`) } wait(e) { return new Promise(t => setTimeout(t, e)) } done(e = {}) { console.log('done!'); s || i || n ? $done(e) : o && !r && "undefined" != typeof $context && ($context.headers = e.headers, $context.statusCode = e.statusCode, $context.body = e.body) } stringify(e) { if ("string" == typeof e || e instanceof String) return e; try { return JSON.stringify(e, null, 2) } catch (e) { return "[object Object]" } } }(e, t) }
/*****************************************************************************/
