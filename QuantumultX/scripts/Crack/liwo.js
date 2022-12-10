// ----------------------------------------------------------------------------

// 梨涡签到领现金
// App下载：https://u.nu/om2je
// Author : iepngs
// 进入【我的-绑定召唤令】页面，填入召唤令：msqets (选填）

// ----------------------------------------------------------------------------

// QX
// [MITM]
// hostname=api.m.jd.com

// [rewrite_local]
// ^https:\/\/api\.m\.jd\.com\/api\/v1\/sign\/doSign url script-request-body https://github.com/ddgksf2013/Scripts/raw/main/liwo.js

// [local_tasK]
// 5 0 * * * https://github.com/ddgksf2013/Scripts/raw/main/liwo.js, tag=梨涡签到得现金

// ----------------------------------------------------------------------------
// Loon

// [MITM]
// hostname=api.m.jd.com

// [Script]
// http-request ^https:\/\/api\.m\.jd\.com\/api\/v1\/sign\/doSign script-path=https://github.com/ddgksf2013/Scripts/raw/main/liwo.js, requires-body=true, timeout=10, tag=梨涡签到Cookie
// cron "7 0 * * *" script-path=https://github.com/ddgksf2013/Scripts/raw/main/liwo.js,tag=梨涡签到

// ----------------------------------------------------------------------------

const $ = hammer("梨涡签到");
const CookieKey = "liwoCookie";

function GetCookie() {
    $.log(`cookie:\n ${$request.body}`);
    $.write($request.body, CookieKey);
    $.alert('签到Cookie写入成功');
    $.done();
}

async function main() {
    const cookie = $.read('CookieJD');
    const CookieVal = $.read(CookieKey);
    if(!cookie || !CookieVal){
        $.log("Cookie不存在，中止运行.");
        return $.done();
    }
    const body = CookieVal.replace(/&t=\d+/, "&t=" + Date.now().toString());
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": cookie,
        "Host": "api.m.jd.com",
        "Origin": "https://2do.jd.com",
        "Referer": "https://2do.jd.com/events/7-days/",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/yocial/5.1.1(iOS;13.7;com.jd.campustodo)"
    }
    let options = {
        url: "https://api.m.jd.com/api/v1/sign/doSign",
        headers: headers,
        body: body
    }
    const inlink = {"open-url": "yocial://webview/?url=https%3A%2F%2F2do.jd.com%2Fevents%2F7-days%2F%23%2F&login=1"};
    const toSign = () => {
        return new Promise(resolve => {
            $.request('post', options, (error, response, data) => {
                const type = options.url.split("/").pop();
                if(error){
                    $.log(`${type} request error: \n${error}`);
                    return resolve(0);
                }
                $.log(`${type} response: \n${response}`);
                response = JSON.parse(response);
                if (response.status) {
                    const ret = response.data;
                    $.alert(ret.message, `${ret.title},余额：${ret.currentAmount}`, inlink);
                    return resolve(1);
                }
                if(response.error.code == 39004){
                    // 开启新一轮签到
                    return setTimeout(()=>{
                        resolve(2);
                    }, 1234);
                }
                $.alert(response.error.message, '', inlink);
                return resolve(3);
            })
        })
    };
    if((await toSign(options)) == 2){
        options.url = options.url.replace("doSign", "resetSign");
        options.body = options.body.replace("v1_sign_doSign", "v1_sign_resetSign");
        await toSign(options);
    }
    $.done();
}

$.isRequest ? GetCookie() : main();

function hammer(t="untitled",l=3){return new class{constructor(t,l){this.name=t,this.logLevel=l,this.isRequest=("object"==typeof $request)&&$request.method!="OPTIONS",this.isSurge="undefined"!=typeof $httpClient,this.isQuanX="undefined"!=typeof $task,this.isNode="function"==typeof require,this.node=(()=>{if(!this.isNode){return null}const file="localstorage.yml";let f,y,r;try{f=require('fs');y=require('js-yaml');r=require('request');f.appendFile(file,"",function(err){if(err)throw err;})}catch(e){console.log("install unrequired module by: yarn add module_name");console.log(e.message);return{}}return{file:file,fs:f,yaml:y,request:r,}})()}log(...n){if(l<2){return null}console.log(`\n***********${this.name}***********`);for(let i in n)console.log(n[i])}alert(body="",subtitle="",options={}){if(l==2||l==0){return null}if(typeof options=="string"){options={"open-url":options}}let link=null;if(Object.keys(options).length){link=this.isQuanX?options:{openUrl:options["open-url"],mediaUrl:options["media-url"]}}if(this.isSurge)return $notification.post(this.name,subtitle,body,link);if(this.isQuanX)return $notify(this.name,subtitle,body,link);console.log(`系统通知📣\ntitle:${this.name}\nsubtitle:${subtitle}\nbody:${body}\nlink:${link}`)}request(method,params,callback){let options={};if(typeof params=="string"){options.url=params}else{options.url=params.url;if(typeof params=="object"){params.headers&&(options.headers=params.headers);params.body&&(options.body=params.body)}}method=method.toUpperCase();const writeRequestErrorLog=function(m,u){return err=>console.log(`${this.name}request error:\n${m}${u}`,err)}(method,options.url);if(this.isSurge){const _runner=method=="GET"?$httpClient.get:$httpClient.post;return _runner(options,(error,response,body)=>{if(error==null||error==""){response.body=body;callback("",body,response)}else{writeRequestErrorLog(error);callback(error,"",response)}})}options.method=method;if(this.isQuanX){$task.fetch(options).then(response=>{response.status=response.statusCode;delete response.statusCode;callback("",response.body,response)},reason=>{writeRequestErrorLog(reason.error);response.status=response.statusCode;delete response.statusCode;callback(reason.error,"",response)})}if(this.isNode){if(options.method=="POST"&&options.body){try{options.body=JSON.parse(options.body);options.json=true}catch(e){console.log(e.message)}}this.node.request(options,(error,response,body)=>{if(typeof body=="object"){body=JSON.stringify(body)}if(typeof response=='object'&&response){response.status=response.statusCode;delete response.statusCode}callback(error,body,response)})}}read(key){if(this.isSurge)return $persistentStore.read(key);if(this.isQuanX)return $prefs.valueForKey(key);if(this.isNode){let val="";try{const fileContents=this.node.fs.readFileSync(this.node.file,"utf8");const data=this.node.yaml.safeLoad(fileContents);val=(typeof(data)=="object"&&data[key])?data[key]:""}catch(e){console.log(`读取文件时错误:\n${e.message}`);return""}return val}}write(val,key){if(this.isSurge)return $persistentStore.write(val,key);if(this.isQuanX)return $prefs.setValueForKey(val,key);if(this.isNode){try{const fileContents=this.node.fs.readFileSync(this.node.file,"utf8");let data=this.node.yaml.safeLoad(fileContents);data=typeof data=="object"?data:{};data[key]=val;val=this.node.yaml.safeDump(data);this.node.fs.writeFileSync(this.node.file,val,'utf8')}catch(e){console.log(e.message);return false}return true}}delete(key){if(this.isNode){try{const fileContents=this.node.fs.readFileSync(this.node.file,"utf8");let data=this.node.yaml.safeLoad(fileContents);data=typeof data=="object"?data:{};if(!data.hasOwnProperty(key)){return true}delete data[key];const val=this.node.yaml.safeDump(data);this.node.fs.writeFileSync(this.node.file,val,'utf8')}catch(e){console.log(e.message);return false}return true}}done(value={}){if(this.isQuanX)return this.isRequest?$done(value):null;if(this.isSurge)return this.isRequest?$done(value):$done()}pad(s=false,c="*",l=15){return s?this.log(c.padEnd(l,c)):`\n${c.padEnd(l,c)}\n`}}(t,l)}
