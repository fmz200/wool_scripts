/*

* ==UserScript==
* @ScriptName        FileBall挂载阿里云盘、Alist
* @Author            @Changes,@Cuttlefish
* @TgChannel         https://t.me/ddgksf2021
* @Contribute        https://t.me/ddgksf2013_bot
* @Feedback          📮 ddgksf2013@163.com 📮
* @WechatID          墨鱼手记
* @UpdateTime        2022-09-13
* @ScriptFunction    FileBall挂载阿里云盘、Alist，播放云盘中的音乐和视频文件
* @Attention         如需引用请注明出处，谢谢合作！
* @Version           v0.0.10
* @Suit              脚本已使用Env做了兼容处理，理论适配多个工具，请自行测试
* @ScriptURL         https://github.com/ddgksf2013/Scripts/raw/main/ali.js
* ==/UserScript==


[rewrite_local]

^https?:\/\/.*\.example\.com url script-analyze-echo-response https://github.com/ddgksf2013/Scripts/raw/main/ali.js

[mitm]

hostname = *example.com


FileBall操作步骤:
*************************************
1.0挂载Aliyun[仅单个账户]
1.1添加Synology协议
1.2地址填 aliyun.example.com
1.3用户名随意
1.4密码填【refresh_token】Token获取地址(需要用阿里云盘扫描alist的二维码获得)[ https://alist-doc.nn.ci/docs/driver/aliyundrive ]
1.5目前阿里云盘仅支持单账户(多账户功能后续完善...)
1.6连接&Enjoy
1.7如需更换账户，请删除原aliyun列表，重新按照1.1-1.4步骤添加
*************************************
2.0挂载Alist[可多个账户]
2.1添加Synology协议
2.2地址填 alist.example.com
2.3用户名填Alist地址，如 https://a.b.c
2.4密码随意
2.5按照2.1-2.4步骤可添加多个alist
2.6当存在多个alist列表，需要使用某个alsit，请【左滑】，点击【画笔】，点击右上角【连接】使用
2.7单alist使用时，无需2.6步骤
2.8连接&Enjoy
*************************************
*/

var $ = new Env('ALI');
var date = new Date();
var debug = false;
var url = $request.url;
/* alist persistentStore data */
var host = $.getdata('alist_host');
var alistUrl = $.getdata('alist_url');
/* aliyun persistentStore data */
var refreshToken = $.getdata('aliyun_refresh_token');
var accessToken = $.getdata('aliyun_access_token');
var driveId = $.getdata('aliyun_drive_id');

var headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    'Content-Type': 'application/json'
};
var myResponse = {
    status: 'HTTP/1.1 200 OK',
};
var obj = {};

!(async () => {
    if (typeof $request !== "undefined") {
        if (/alist.*?\/webapi\/auth\.cgi/.test($request.url)) {
            await AlistAuth();
        } else if (/alist.*?webapi\/entry\.cgi/.test($request.url)) {
            await AlistEntry();
        } else if (/alist.*?fbdownload/.test($request.url)) {
            await AlistDownLoad();
        } else if (/aliyun.*?\/webapi\/auth\.cgi/.test($request.url)) {
            await AliyunAuth();
        } else if (/aliyun.*?webapi\/entry\.cgi/.test($request.url)) {
            await AliyunEntry();
        } else if (/aliyun.*?fbdownload/.test($request.url)) {
            await AliyunDownLoad();
        } else
        ; /* no deal with */
    } else {
        $.msg($.name, "", "请勿手动执行本脚本！");
    }
})().catch((e) => $.logErr(e))
    .finally(() => $.done())


async function AliyunAuth() {
    return new Promise(resolve => {
        const body = $request.body;
        const password = body.match(/passwd=([^&]*)/)[1];
        const refreshToken = $.getdata('aliyun_refresh_token') ?? password;
        const data = {
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        };
        const req = {
            url: 'https://auth.aliyundrive.com/v2/account/token',
            headers: headers,
            body: JSON.stringify(data)
        };
        $.post(req, (err, resp, data) => {
            try {
                const body = JSON.parse(data);
                if (body.refresh_token && body.access_token && body.default_drive_id) {
                    $.setdata(body.refresh_token, 'aliyun_refresh_token');
                    $.setdata(body.access_token, 'aliyun_access_token');
                    $.setdata(body.default_drive_id, 'aliyun_drive_id');
                    if (debug) {
                        console.log('body.refresh_token:' + body.refresh_token);
                        console.log('body.access_token:' + body.access_token);
                        console.log('body.default_drive_id:' + body.default_drive_id);
                    }
                    obj = {
                        success: true,
                        data: {
                            sid: body.access_token
                        }
                    };
                    myResponse.body = JSON.stringify(obj);
                    $.done(myResponse);
                } else {
                    $.done();
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        });
    })
}

async function AliyunEntry() {
    return new Promise(resolve => {
        const body = $request.body;
        if (typeof(body) === 'string') {
            if (body.indexOf('list_share') != -1 || body.indexOf('method=list') != -1) {
                headers.authorization = 'Bearer ' + accessToken;
                var path = body.match(/folder_path=([^&]*)/) === null ? "root" : body.match(/folder_path=([^&]*)/)[1];
                const isRootFolder = path === "root";
                path = path.replace(/%25/g, '%');
                //console.log(path);
                const Data = {
                    drive_id: driveId,
                    fields: '*',
                    parent_file_id: path,
                    limit: 200
                };
                const req = {
                    url: 'https://api.aliyundrive.com/v2/file/list',
                    headers: headers,
                    body: JSON.stringify(Data)
                };
                if (debug) console.log(JSON.stringify(req));
                $.post(req, (err, resp, data) => {
                    try {
                        /* consider password dir */
                        if (data.indexOf("password") != -1) {
                            $.msg($.name, "", "此文件夹需要密码！");
                        }
                        const items = JSON.parse(data).items;
                        var files = [];
                        items.forEach(function(item) {
                            const file = {
                                isdir: item.type === 'folder',
                                path: item.file_id,
                                name: item.name,
                                additional: {
                                    size: item.size
                                }
                            };
                            files.push(file);
                        });
                        const result = isRootFolder ? {
                            total: 0,
                            offset: 0,
                            shares: files
                        } : {
                            total: 0,
                            offset: 0,
                            files: files
                        };
                        obj = {
                            success: true,
                            data: result
                        };
                        myResponse.body = JSON.stringify(obj);
                        $.done(myResponse);
                    } catch (e) {
                        $.logErr(e, resp)
                    } finally {
                        resolve();
                    }
                });
            }
        } else {
            $.done();
        }
    })
}
async function AliyunDownLoad() {
    return new Promise(resolve => {
        const hex = url.match(/dlink=%22(.*)%22/)[1];
        const fileid = hexToUtf8(hex);
        if (debug) console.log('fileId : ' + fileid);
        const body = {
            drive_id: driveId,
            expire_sec: 14400,
            file_id: fileid
        };
        headers.authorization = 'Bearer ' + accessToken;
        const req = {
            url: 'https://api.aliyundrive.com/v2/file/get_download_url',
            headers: headers,
            body: JSON.stringify(body)
        };
        $.post(req, (err, resp, data) => {
            try {
                const link = JSON.parse(data).url;
                if (debug) console.log(link);
                $.done({
                    status: "HTTP/1.1 302 Found",
                    headers: {
                        "Location": link
                    }
                });
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        });
    })
}

async function AlistAuth() {
    return new Promise(resolve => {
        const body = $request.body;
        const host = decodeURIComponent(body.match(/account=([^&]*)/)[1]);
        console.log('host:' + host);
        $.setdata(host, 'alist_host');
        obj = {
            success: true,
            data: {
                sid: ''
            }
        };
        myResponse.body = JSON.stringify(obj);
        $.done(myResponse);
    })
}

async function AlistEntry() {
    return new Promise(resolve => {
        const body = $request.body;
        if (typeof(body) === 'string') {
            if (body.indexOf('list_share') != -1 || body.indexOf('method=list') != -1) {
                var path = body.match(/folder_path=([^&]*)/) === null ? "/" : body.match(/folder_path=([^&]*)/)[1];
                const isRootFolder = path === "/";
                path = path.replace(/%25/g, '%');
                //console.log(path);
                const Data = {
                    page_num: 1,
                    page_size: 100,
                    password: '',
                    path: decodeURIComponent(path)
                };
                const req = {
                    url: host + '/api/public/path',
                    headers: headers,
                    body: JSON.stringify(Data)
                };
                $.post(req, (err, resp, data) => {
                    try {
                        /* consider password dir */
                        if (data.indexOf("password") != -1) {
                            $.msg($.name, "", "此文件夹需要密码！");
                        }
                        const items = JSON.parse(data).data.files;
                        const parent = path === "/" ? "" : path;
                        var files = [];
                        var playurls = [];
                        if (typeof $.getdata('alist_url') == "string") {
                            playurls = JSON.parse($.getdata('alist_url'));
                            if (debug) console.log("get persistentstore data");
                        }
                        items.forEach(function(item) {
                            const file = {
                                isdir: item.type === 1,
                                path: parent + '/' + item.name,
                                name: item.name,
                                additional: {
                                    size: item.size
                                }
                            };
                            files.push(file);
                            /* limit file type */
                            if (item.type == 3 || item.type == 4) {
                                const playurl = {
                                    url: item.url,
                                    name: item.name
                                }
                                playurls.push(playurl);
                                if (playurls.length > 100) {
                                    playurls.shift();
                                }
                            }
                        });
                        if (playurls.length > 0) {
                            /* consider start */
                            $.setdata(JSON.stringify(playurls), 'alist_url');
                        }
                        const result = isRootFolder ? {
                            total: 0,
                            offset: 0,
                            shares: files
                        } : {
                            total: 0,
                            offset: 0,
                            files: files
                        };
                        obj = {
                            success: true,
                            data: result
                        };
                        myResponse.body = JSON.stringify(obj);
                        $.done(myResponse);
                    } catch (e) {
                        $.logErr(e, resp)
                    } finally {
                        resolve();
                    }
                });
            }
        } else {
            $.done();
        }
    })
}

async function AlistDownLoad() {
    return new Promise(resolve => {
        const hex = $request.url.match(/dlink=%22(.*)%22/)[1];
        const fileid = hexToUtf8(hex);
        var playurls = JSON.parse($.getdata('alist_url'));
        if (debug) console.log(fileid);
        playurls.forEach(function(item) {
            if (encodeURIComponent(fileid).indexOf(encodeURIComponent(item.name)) != -1) {
                var target = item.url;
                if (!target) {
                    target = host + '/d' + fileid;
                }
                if (debug) console.log(target);
                $.done({
                    status: "HTTP/1.1 302 Found",
                    headers: {
                        "Location": target
                    }
                });
            }
        })
    })
}

function hexToUtf8(hex) {
    return decodeURIComponent('%' + hex.match(/.{1,2}/g).join('%'));
}
//Compatible code from https://github.com/chavyleung/scripts/blob/master/Env.min.js
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
