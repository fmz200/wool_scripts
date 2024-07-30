/**********
🐬作者
@Evilbutcher。 https://github.com/evilbutcher
@toulanboy。https://github.com/toulanboy/scripts

📌不定期更新各种签到、有趣的脚本，欢迎star🌟

***********************************
【配置步骤，请认真阅读，每一个细节都很重要】
***********************************
1. 根据你当前的软件，配置好srcipt。由于是远程文件，记得顺便更新文件。
2. 打开微博APP --> 底部栏“我的“  -->  中间的”超话社区“  --> 底部栏"我的" --> ”关注“， 弹出通知，提示获取已关注超话链接成功。
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
微博超话cookie获取 = type=http-request,pattern=^https?://m?api\.weibo\.c(n|om)\/2\/(cardlist|page\/button),script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/weibo/weibotalk.cookie.js
微博超话 = type=cron,cronexp="5 0  * * *",script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/weibo/weibotalk.js,wake-system=true,timeout=600

*************************
【Loon 2.1+ 脚本配置】
*************************
[script]
cron "5 0 * * *" script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/weibo/weibotalk.js, timeout=600, tag=微博超话
http-request ^https?://m?api\.weibo\.c(n|om)\/2\/(cardlist|page\/button) script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/weibo/weibotalk.cookie.js,requires-body=false, tag=微博超话cookie获取

*************************
【 QX 1.0.10+ 脚本配置 】 
*************************
[rewrite_local]
^https?://m?api\.weibo\.c(n|om)\/2\/(cardlist|page\/button) url script-request-header https://raw.githubusercontent.com/toulanboy/scripts/master/weibo/weibotalk.cookie.js
[task]
5 0 * * * https://raw.githubusercontent.com/toulanboy/scripts/master/weibo/weibotalk.js, tag=微博超话


[MITM]
hostname = api.weibo.cn

*********/

const $ = new Env("微博超话")

/*
 * 可自定义的参数
 */
$.delete_cookie = false //若需要清空cookie，请把它置为true。清空完毕后，请重新置为false.
$.msg_max_num = 30 //一个通知显示30个超话的签到情况
$.time = 700 //【签到间隔，单位ms】，若超话过多，建议填1000ms以上。
debug = false

!(async () => {
    if(!get_setting()) return
    if(!get_counts()) return
    console.log(`🌟 账号数 = ${$.count_num}`)
    for (var current = 1; current <= $.count_num; ++current) {
        init_env(current)
        await get_page_number();
        for (var i = 1; i <= $.pagenumber; i++) {
            await get_talk_id(i);
        }
        for (var i in $.name_list) {
            await checkin($.id_list[i], $.name_list[i]);
            $.wait($.time);
        }
        output(current)
    }
})()
.catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
})
.finally(() => {
    $.done()
})

function get_setting() {
    $.delete_cookie = JSON.parse($.getdata('wb_delete_cookie') || $.delete_cookie)
    $.msg_max_num = $.getdata('wb_msg_max_num') * 1 || $.msg_max_num
    $.time = $.getdata('wb_request_time') * 1 || $.time 

    $.listurl = $.getdata("evil_tokenurl");
    $.listheaders = $.getdata("evil_tokenheaders");
    $.checkinurl = $.getdata("evil_tokencheckinurl");
    $.checkinheaders = $.getdata("evil_tokencheckinheaders");

    $.listurl2 = $.getdata("evil_tokenurl2");
    $.listheaders2 = $.getdata("evil_tokenheaders2");
    $.checkinurl2 = $.getdata("evil_tokencheckinurl2");
    $.checkinheaders2 = $.getdata("evil_tokencheckinheaders2");
    if ($.delete_cookie) {
        $.setdata("", "evil_tokenurl")
        $.setdata("", "evil_tokenheaders")
        $.setdata("", "evil_tokencheckinurl")
        $.setdata("", "evil_tokencheckinheaders")

        $.setdata("", "evil_tokenurl2")
        $.setdata("", "evil_tokenheaders2")
        $.setdata("", "evil_tokencheckinurl2")
        $.setdata("", "evil_tokencheckinheaders2")
        $.setdata("false", "wb_delete_cookie")
        $.msg($.name, "", "✅已清空cookie，同时已关闭清空功能。\n🔍请按流程开始获取cookie把~")
        return false;
    }
    return true;
}

function get_counts() {
    $.count_num = 0;
    if ($.listurl == undefined || $.listurl == "" ||
        $.listheaders == undefined || $.listheaders == "" ||
        $.checkinurl == undefined || $.checkinurl == "" ||
        $.checkinheaders == undefined || $.checkinheaders == "") {
        $.msg($.name, "🚫cookie不完整 或 没有cookie", "🚫请认真阅读配置，按流程获取cookie。\n🔍若仍无法解决，请先清空cookie再获取。\n🔍如何清空？\n1️⃣本地文件：将文件内delete_cookie置为true。\n2️⃣远程文件：使用boxjs，在box内打开清空cookie开关")
        return false;
    } else {
        $.count_num = 1
    }
    if (!($.listurl2 == undefined || $.listurl2 == "" ||
            $.listheaders2 == undefined || $.listheaders2 == "" ||
            $.checkinurl2 == undefined || $.checkinurl2 == "" ||
            $.checkinheaders2 == undefined || $.checkinheaders2 == "")) {
        $.count_num = 2;
    }
    return true;
}

function init_env(current) {
    console.log(`🌟 清空环境，开始账号 ${current}`)
    $.message = [];
    $.name_list = []
    $.id_list = []
    $.val_list = []
    $.successNum = 0
    $.failNum = 0
    $.allnumber = 0;
    $.pagenumber = 0;
    $.stopNum = 0;
    if (current == 2) {
        $.listurl = $.listurl2
        $.listheaders = $.listheaders2
        $.checkinurl = $.checkinurl2
        $.checkinheaders = $.checkinheaders2
    }
}

function output(current) {
    $.this_msg = ""
    for (var i = 1; i <= $.message.length; ++i) {
        if (i % ($.msg_max_num) == 0) {
            $.msg(`${$.name}${$.count_num==1?"":(current==1?"[账号一]":"[账号二]")}:  成功${$.successNum}个，失败${$.failNum}`, `当前第${Math.ceil(i/$.msg_max_num)}页 ，共${Math.ceil($.message.length/$.msg_max_num)}页`, $.this_msg)
            $.this_msg = ""
        }
        $.this_msg += `${$.message[i-1]}\n`
    }
    if ($.message.length % $.msg_max_num != 0) {
        $.msg(`${$.name}${$.count_num==1?"":(current==1?"[账号一]":"[账号二]")}:  成功${$.successNum}个，失败${$.failNum}`, `当前第${Math.ceil((i-1)/$.msg_max_num)}页 ，共${Math.ceil($.message.length/$.msg_max_num)}页`, $.this_msg)
    }
}

function get_page_number() {
    return new Promise((resolve) => {
        var idrequest = {
            url: $.listurl,
            header: $.listheaders
        };
        $.get(idrequest, (error, response, data) => {
            if (error) {
                throw new Error(error)
            }
            var body = response.body;
            var obj = JSON.parse(body);
            if (obj.hasOwnProperty('errmsg')||obj.cardlistInfo.total==undefined||obj.cardlistInfo.total==null) {
                $.msg($.name, "🚨获取页数出现错误", `⚠️微博原话：${obj.errmsg}\n🧑🏻‍💻作者：账号过期了，清空cookie吧，重新获取。`)
                $.pagenumber = 0
                resolve()
                return
            }
            $.allnumber = obj.cardlistInfo.total;
            console.log("当前已关注超话" + $.allnumber + "个");
            //  $.message.push(`当前已关注超话${allnumber}个`);
            $.pagenumber = Math.ceil($.allnumber / 20);
            //$notify("超话","",JSON.stringify($.message))
            resolve();
        });
    });
}

//获取超话签到id
function get_talk_id(page) {
    var getlisturl = $.listurl.replace(
        new RegExp("&page=.*?&"),
        "&page=" + page + "&"
    );
    //console.log(getlisturl);
    var idrequest = {
        url: getlisturl,
        header: $.listheaders
    };
    // console.log(idrequest)
    return new Promise((resove) => {
        $.get(idrequest, (error, response, data) => {
            if (error) {
                throw new Error(error)
            }
            var body = response.body;
            var obj = JSON.parse(body);
            if (obj.hasOwnProperty('errmsg')||obj.cards==undefined||obj.cards==null) {
                $.msg($.name, "🚨获取超话ID出现错误", `⚠️微博原话：${obj.errmsg}\n`)
                resolve()
                return
            }
            var group = obj.cards[0]["card_group"];
            number = group.length;
            for (i = 0; i < number; i++) {
                var name = group[i]["title_sub"];
                $.name_list.push(name)
                var val = group[i].desc;
                $.val_list.push(val)
                var id = group[i].scheme.slice(33, 71);
                $.id_list.push(id)
                if (debug) {
                    console.log(name)
                    console.log(val)
                    console.log(id)
                }
                // checkin(id, name, val, time);
            }
            resove()
        })
    })
}




//签到
function checkin(id, name) {
    var sendcheckinurl = $.checkinurl
        .replace(new RegExp("&fid=.*?&"), "&fid=" + id + "&")
        .replace(new RegExp("pageid%3D.*?%26"), "pageid%3D" + id + "%26");
    var checkinrequest = {
        url: sendcheckinurl,
        header: $.checkinheaders
    };
    return new Promise(resolve => {
        $.get(checkinrequest, (error, response, data) => {
            if (error) {
                throw new Error(error)
            }
            name = name.replace(/超话/, "")
            if (response.statusCode == 200) {
                msg_info = JSON.parse(response.body);
                if(msg_info.hasOwnProperty('error_msg')){
                    $.failNum += 1;
                    error_code = msg_info.error_msg.match(/\((\d*?)\)/)[1]
                    if(error_code == 382004){
                        $.message.push(`【${name}】：✨今天已签到`);
                        console.log(`【${name}】：${msg_info.error_msg}`);
                    }
                    else{
                        $.message.push(`【${name}】：${msg_info.error_msg}`);
                        console.log(`【${name}】："未知错误⚠️ 该请求的返回情况如下"`);
                        console.log(response.body)
                    }
                }
                else if (msg_info.hasOwnProperty('result') && msg_info.result == 1) {
                    $.successNum += 1
                    $.message.push(`【${name}】：✅${msg_info.button.name}`)
                    console.log(`【${name}】：${msg_info.button.name}`);
                }
                else{
                    $.failNum += 1
                    $.message.push(`【${name}】：未知错误⚠️`);
                    console.log(`【${name}】："未知错误⚠️ 该请求的返回情况如下"`);
                    console.log(response.body)
                }
            }else if ((response.statusCode == 418)) {
                $.failNum += 1
                $.message.push(`【${name}】："签到太频繁啦，请稍后再试"`);
                console.log(`【${name}】："签到太频繁啦，请稍后再试"`);
            } else if (response.statusCode == 511) {
                $.failNum += 1;
                $.message.push(`【${name}】："需要身份验证，请稍后再试"`);
                console.log(`【${name}】："需要身份验证，请稍后再试"`);
            } else {
                $.failNum += 1
                $.message.push(`【${name}】：未知错误⚠️`);
                console.log(`【${name}】："未知错误⚠️ 该请求的返回情况如下"`);
                console.log(JSON.stringify(response))
            }
            resolve();
        })

    })
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