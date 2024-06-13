/**
 * @auther @fmz200
 * @function 斗鱼鱼吧签到
 * @date 2024-01-15 21:00:00
 * @quote lowking
 * @source https://raw.githubusercontent.com/lowking/Scripts/master/douyu/yubaSign.js
 * @tips 打开https://yuba.douyu.com/homepage/hotwbs并登陆，打开获取cookie，刷新页面，提示获取鱼吧关注列表成功🎉
 */

const lk = new ToolKit(`斗鱼鱼吧签到`, `DouyuYubaSign`)
const config = {
  cookieName: "CookieDY",
  groupName: "GroupDY",
  needUrl: {
    // 登录后获取cookie
    cookieUrl: "https://yuba.douyu.com/wbapi/web/group/myFollow",
    // 关注鱼吧列表
    followRoomUrl: `https://yuba.douyu.com/wbapi/web/group/myFollow?page=1&limit=100&timestamp=${Math.random()}`,
    // 签到
    signUrl: `https://yuba.douyu.com/ybapi/topic/sign?timestamp=${Math.random()}`
  },
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36",
    referer: "https://yuba.https://yuba.douyu.com/homepage/group.com",
    origin: "https://yuba.douyu.com"
  },
  expectData: {
    status_code: 200,
    message: ""
  }
}

if (!lk.isExecComm) {
  if (lk.isRequest() && lk.isGetCookie(/\/wbapi\/web\/group\/myFollow/)) {
    lk.log(`开始获取cookie`)
    const {needUrl, cookieName} = config
    lk.setVal(cookieName, $request.headers["Cookie"])
    getFollowYuBa()
  } else {
    all()
  }
}

var pcount = 0
var arcount = 0
var errorcount = 0
async function all() {
  lk.boxJsJsonBuilder()
  console.log("签到即将开始，如果发现一次只能签到一个，可以执行多次❇️");
  await sign()
  lk.prependNotifyInfo(`🎉【${pcount}】个，🔁【${arcount}】个，❌【${errorcount}】个`)
  lk.msg(``)
  lk.done()
}

function getCsrf(str) {
  const regex = /acf_yb_t=(.*?);/gm
  const csrf = regex.exec(str)
  return csrf.length > 1 ? csrf[1] : ""
}

function sign() {
  return new Promise(async (resolve, reject) => {
    const {
      headers,
      groupName,
      cookieName,
      needUrl
    } = config
    const cookie = lk.getVal(cookieName)
    headers["Cookie"] = cookie
    headers["x-csrf-token"] = getCsrf(cookie)
    headers["Content-Type"] = "application/x-www-form-urlencoded"
    const groupList = JSON.parse(lk.getVal(groupName))["groupList"]
    const params = {
      url: needUrl.signUrl,
      method: "POST",
      headers
    }
    for (const groupItem of groupList) {
      const group_id = groupItem["group_id"]
      params["headers"]["referer"] = "https://yuba.douyu.com/group/" + group_id
      params["body"] = `group_id=${group_id}&cur_exp=10000`
      await sendRequest(params, groupItem)
      await lk.sleep(5000)
    }
    resolve()
  })
}

function sendRequest(params, groupItem) {
  return new Promise(async (resolve, reject) => {
    lk.post(params, (error, response, body) => {
      try {
        let content = ""
        const res = JSON.parse(body)
        const {status_code, message, data} = res
        if (response.status == 200) {
          if (status_code == "200" && message == "") {
            pcount++
            content += `🎉【${groupItem["group_name"]}】[Lv${data["level"]}](${data["levelScore"]}/${data["exp"]})[${data["count"]}天]`
          } else if (status_code == "1001") {
            arcount++
            content += `🔁【${groupItem["group_name"]}】, ${message}`
          } else {
            errorcount++
            content += `❌【${groupItem["group_name"]}】[签到失败], ${message}`
            lk.execFail()
          }
          lk.log(content)
          lk.appendNotifyInfo(content)
        } else {
          errorcount++
          lk.execFail()
          lk.log(`❌【${groupItem["group_name"]}】签到失败（网络请求错误）`)
          lk.appendNotifyInfo(`❌【${groupItem["group_name"]}】签到失败（网络请求错误）`)
        }
      } catch (e) {
        errorcount++
        lk.logErr(e)
        lk.execFail()
        lk.log(`❌【${groupItem["group_name"]}】签到失败`)
        lk.appendNotifyInfo(`❌【${groupItem["group_name"]}】签到失败`)
      } finally {
        resolve()
      }
    })
  })
}

function getFollowYuBa() {
  const {
    headers,
    cookieName,
    groupName,
    needUrl
  } = config
  headers["Cookie"] = lk.getVal(cookieName)
  const options = {
    url: needUrl.followRoomUrl,
    method: "GET",
    headers,
    body: ""
  }
  lk.get(options, (error, response, data) => {
    data = JSON.parse(data)
    data = data.data
    let content = ""
    let groupList = []
    for (const yuba of data["list"]) {
      groupList.push({
        group_id: yuba.group_id,
        group_name: yuba.group_name
      })
      content += `[${yuba.group_name}](${yuba.group_id})\n`
    }
    lk.appendNotifyInfo(`获取鱼吧关注列表成功🎉`)
    lk.setVal(
      groupName,
      JSON.stringify({
        groupList
      })
    )

    lk.msg(``)
    lk.done()
  })
}

//ToolKit-start
function ToolKit(t,s,i){return new class{constructor(t,s,i){this.tgEscapeCharMapping={"&":"＆","#":"＃"};this.userAgent=`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15`;this.prefix=`lk`;this.name=t;this.id=s;this.data=null;this.dataFile=this.getRealPath(`${this.prefix}${this.id}.dat`);this.boxJsJsonFile=this.getRealPath(`${this.prefix}${this.id}.boxjs.json`);this.options=i;this.isExecComm=false;this.isEnableLog=this.getVal(`${this.prefix}IsEnableLog${this.id}`);this.isEnableLog=this.isEmpty(this.isEnableLog)?true:JSON.parse(this.isEnableLog);this.isNotifyOnlyFail=this.getVal(`${this.prefix}NotifyOnlyFail${this.id}`);this.isNotifyOnlyFail=this.isEmpty(this.isNotifyOnlyFail)?false:JSON.parse(this.isNotifyOnlyFail);this.isEnableTgNotify=this.getVal(`${this.prefix}IsEnableTgNotify${this.id}`);this.isEnableTgNotify=this.isEmpty(this.isEnableTgNotify)?false:JSON.parse(this.isEnableTgNotify);this.tgNotifyUrl=this.getVal(`${this.prefix}TgNotifyUrl${this.id}`);this.isEnableTgNotify=this.isEnableTgNotify?!this.isEmpty(this.tgNotifyUrl):this.isEnableTgNotify;this.costTotalStringKey=`${this.prefix}CostTotalString${this.id}`;this.costTotalString=this.getVal(this.costTotalStringKey);this.costTotalString=this.isEmpty(this.costTotalString)?`0,0`:this.costTotalString.replace('"',"");this.costTotalMs=this.costTotalString.split(",")[0];this.execCount=this.costTotalString.split(",")[1];this.costTotalMs=this.isEmpty(this.costTotalMs)?0:parseInt(this.costTotalMs);this.execCount=this.isEmpty(this.execCount)?0:parseInt(this.execCount);this.logSeparator="\n██";this.now=new Date;this.startTime=this.now.getTime();this.node=(()=>{if(this.isNode()){const t=require("request");return{request:t}}else{return null}})();this.execStatus=true;this.notifyInfo=[];this.boxjsCurSessionKey="chavy_boxjs_cur_sessions";this.boxjsSessionsKey="chavy_boxjs_sessions";this.log(`${this.name}, 开始执行!`);this.execComm()}getRealPath(t){if(this.isNode()){let s=process.argv.slice(1,2)[0].split("/");s[s.length-1]=t;return s.join("/")}return t}async execComm(){if(!this.isNode()){return}this.comm=process.argv.slice(1);if(this.comm[1]!="p"){return}let t=false;this.isExecComm=true;this.log(`开始执行指令【${this.comm[1]}】=> 发送到其他终端测试脚本！`);if(this.isEmpty(this.options)||this.isEmpty(this.options.httpApi)){this.log(`未设置options，使用默认值`);if(this.isEmpty(this.options)){this.options={}}this.options.httpApi=`ffff@10.0.0.19:6166`}else{if(!/.*?@.*?:[0-9]+/.test(this.options.httpApi)){t=true;this.log(`❌httpApi格式错误！格式：ffff@3.3.3.18:6166`);this.done()}}if(!t){this.callApi(this.comm[2])}}callApi(t){let s=this.comm[0];let i=this.options.httpApi.split("@")[1];this.log(`获取【${s}】内容传给【${i}】`);let e="";this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const o=this.path.resolve(s);const h=this.path.resolve(process.cwd(),s);const r=this.fs.existsSync(o);const n=!r&&this.fs.existsSync(h);if(r||n){const t=r?o:h;try{e=this.fs.readFileSync(t)}catch(t){e=""}}else{e=""}let a={url:`http://${i}/v1/scripting/evaluate`,headers:{"X-Key":`${this.options.httpApi.split("@")[0]}`},body:{script_text:`${e}`,mock_type:"cron",timeout:!this.isEmpty(t)&&t>5?t:5},json:true};this.post(a,(t,e,o)=>{this.log(`已将脚本【${s}】发给【${i}】`);this.done()})}boxJsJsonBuilder(t,s){if(!this.isNode()){return}if(!this.isJsonObject(t)||!this.isJsonObject(s)){this.log("构建BoxJsJson传入参数格式错误，请传入json对象");return}let i="/Users/lowking/Desktop/Scripts/lowking.boxjs.json";if(s&&s.hasOwnProperty("target_boxjs_json_path")){i=s["target_boxjs_json_path"]}if(!this.fs.existsSync(i)){return}this.log("using node");let e=["settings","keys"];const o="https://raw.githubusercontent.com/Orz-3";let h={};let r="#lk{script_url}";if(s&&s.hasOwnProperty("script_url")){r=this.isEmpty(s["script_url"])?"#lk{script_url}":s["script_url"]}h.id=`${this.prefix}${this.id}`;h.name=this.name;h.desc_html=`⚠️使用说明</br>详情【<a href='${r}?raw=true'><font class='red--text'>点我查看</font></a>】`;h.icons=[`${o}/mini/master/Alpha/${this.id.toLocaleLowerCase()}.png`,`${o}/mini/master/Color/${this.id.toLocaleLowerCase()}.png`];h.keys=[];h.settings=[{id:`${this.prefix}IsEnableLog${this.id}`,name:"开启/关闭日志",val:true,type:"boolean",desc:"默认开启"},{id:`${this.prefix}NotifyOnlyFail${this.id}`,name:"只当执行失败才通知",val:false,type:"boolean",desc:"默认关闭"},{id:`${this.prefix}IsEnableTgNotify${this.id}`,name:"开启/关闭Telegram通知",val:false,type:"boolean",desc:"默认关闭"},{id:`${this.prefix}TgNotifyUrl${this.id}`,name:"Telegram通知地址",val:"",type:"text",desc:"Tg的通知地址，如：https://api.telegram.org/bot-token/sendMessage?chat_id=-100140&parse_mode=Markdown&text="}];h.author="#lk{author}";h.repo="#lk{repo}";h.script=`${r}?raw=true`;if(!this.isEmpty(t)){for(let s of e){if(this.isEmpty(t[s])){break}if(s==="settings"){for(let i=0;i<t[s].length;i++){let e=t[s][i];for(let t=0;t<h.settings.length;t++){let s=h.settings[t];if(e.id===s.id){h.settings.splice(t,1)}}}}h[s]=h[s].concat(t[s]);delete t[s]}}Object.assign(h,t);this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const n=this.path.resolve(this.boxJsJsonFile);const a=this.path.resolve(process.cwd(),this.boxJsJsonFile);const l=this.fs.existsSync(n);const f=!l&&this.fs.existsSync(a);const p=JSON.stringify(h,null,"\t");if(l){this.fs.writeFileSync(n,p)}else if(f){this.fs.writeFileSync(a,p)}else{this.fs.writeFileSync(n,p)}let u=JSON.parse(this.fs.readFileSync(i));if(!(u.hasOwnProperty("apps")&&Array.isArray(u["apps"])&&u["apps"].length>0)){return}let c=u.apps;let g=c.indexOf(c.filter(t=>{return t.id==h.id})[0]);if(g>=0){u.apps[g]=h}else{u.apps.push(h)}let d=JSON.stringify(u,null,2);if(!this.isEmpty(s)){for(const t in s){let i=s[t];if(!i){switch(t){case"author":i="@lowking";case"repo":i="https://github.com/lowking/Scripts";default:continue}}d=d.replace(`#lk{${t}}`,i)}}const y=/(?:#lk\{)(.+?)(?=\})/;let S=y.exec(d);if(S!==null){this.log(`生成BoxJs还有未配置的参数，请参考https://github.com/lowking/Scripts/blob/master/util/example/ToolKitDemo.js#L17-L19传入参数：`)}let m=new Set;while((S=y.exec(d))!==null){m.add(S[1]);d=d.replace(`#lk{${S[1]}}`,``)}m.forEach(t=>{console.log(`${t} `)});this.fs.writeFileSync(i,d)}isJsonObject(t){return typeof t=="object"&&Object.prototype.toString.call(t).toLowerCase()=="[object object]"&&!t.length}appendNotifyInfo(t,s){if(s==1){this.notifyInfo=t}else{this.notifyInfo.push(t)}}prependNotifyInfo(t){this.notifyInfo.splice(0,0,t)}execFail(){this.execStatus=false}isRequest(){return typeof $request!="undefined"}isSurge(){return typeof $httpClient!="undefined"}isQuanX(){return typeof $task!="undefined"}isLoon(){return typeof $loon!="undefined"}isJSBox(){return typeof $app!="undefined"&&typeof $http!="undefined"}isStash(){return"undefined"!==typeof $environment&&$environment["stash-version"]}isNode(){return typeof require=="function"&&!this.isJSBox()}sleep(t){return new Promise(s=>setTimeout(s,t))}log(t){if(this.isEnableLog)console.log(`${this.logSeparator}${t}`)}logErr(t){this.execStatus=true;if(this.isEnableLog){console.log(`${this.logSeparator}${this.name}执行异常:`);console.log(t);if(!t.message){return}console.log(`\n${t.message}`)}}msg(t,s,i,e){if(!this.isRequest()&&this.isNotifyOnlyFail&&this.execStatus){return}if(this.isEmpty(s)){if(Array.isArray(this.notifyInfo)){s=this.notifyInfo.join("\n")}else{s=this.notifyInfo}}if(this.isEmpty(s)){return}if(this.isEnableTgNotify){this.log(`${this.name}Tg通知开始`);for(let t in this.tgEscapeCharMapping){if(!this.tgEscapeCharMapping.hasOwnProperty(t)){continue}s=s.replace(t,this.tgEscapeCharMapping[t])}this.get({url:encodeURI(`${this.tgNotifyUrl}📌${this.name}\n${s}`)},(t,s,i)=>{this.log(`Tg通知完毕`)})}else{let o={};const h=!this.isEmpty(i);const r=!this.isEmpty(e);if(this.isSurge()||this.isLoon()||this.isStash()){if(h)o["url"]=i;$notification.post(this.name,t,s,o)}else if(this.isQuanX()){if(h)o["open-url"]=i;if(r)o["media-url"]=e;$notify(this.name,t,s,o)}else if(this.isNode()){this.log("⭐️"+this.name+"\n"+t+"\n"+s)}else if(this.isJSBox()){$push.schedule({title:this.name,body:t?t+"\n"+s:s})}}}getVal(t,s=""){let i;if(this.isSurge()||this.isLoon()||this.isStash()){i=$persistentStore.read(t)}else if(this.isQuanX()){i=$prefs.valueForKey(t)}else if(this.isNode()){this.data=this.loadData();i=process.env[t]||this.data[t]}else{i=this.data&&this.data[t]||null}return!i?s:i}updateBoxjsSessions(t,s){if(t==this.boxjsSessionsKey){return}const i=`${this.prefix}${this.id}`;let e=JSON.parse(this.getVal(this.boxjsCurSessionKey,"{}"));if(!e.hasOwnProperty(i)){return}let o=e[i];let h=JSON.parse(this.getVal(this.boxjsSessionsKey,"[]"));if(h.length==0){return}let r=[];h.forEach(t=>{if(t.id==o){r=t.datas}});if(r.length==0){return}let n=false;r.forEach(i=>{if(i.key==t){i.val=s;n=true}});if(!n){r.push({key:t,val:s})}h.forEach(t=>{if(t.id==o){t.datas=r}});this.setVal(this.boxjsSessionsKey,JSON.stringify(h))}setVal(t,s){if(this.isSurge()||this.isLoon()||this.isStash()){this.updateBoxjsSessions(t,s);return $persistentStore.write(s,t)}else if(this.isQuanX()){this.updateBoxjsSessions(t,s);return $prefs.setValueForKey(s,t)}else if(this.isNode()){this.data=this.loadData();this.data[t]=s;this.writeData();return true}else{return this.data&&this.data[t]||null}}loadData(){if(!this.isNode()){return{}}this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile);const s=this.path.resolve(process.cwd(),this.dataFile);const i=this.fs.existsSync(t);const e=!i&&this.fs.existsSync(s);if(i||e){const e=i?t:s;try{return JSON.parse(this.fs.readFileSync(e))}catch(t){return{}}}else{return{}}}writeData(){if(!this.isNode()){return}this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile);const s=this.path.resolve(process.cwd(),this.dataFile);const i=this.fs.existsSync(t);const e=!i&&this.fs.existsSync(s);const o=JSON.stringify(this.data);if(i){this.fs.writeFileSync(t,o)}else if(e){this.fs.writeFileSync(s,o)}else{this.fs.writeFileSync(t,o)}}adapterStatus(t){if(t){if(t.status){t["statusCode"]=t.status}else if(t.statusCode){t["status"]=t.statusCode}}return t}get(t,s=(()=>{})){if(this.isSurge()||this.isLoon()||this.isStash()){$httpClient.get(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}else if(this.isQuanX()){if(typeof t=="string")t={url:t};t["method"]="GET";$task.fetch(t).then(t=>{s(null,this.adapterStatus(t),t.body)},t=>s(t.error,null,null))}else if(this.isNode()){this.node.request(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}else if(this.isJSBox()){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let i=t.error;if(i)i=JSON.stringify(t.error);let e=t.data;if(typeof e=="object")e=JSON.stringify(t.data);s(i,this.adapterStatus(t.response),e)};$http.get(t)}}post(t,s=(()=>{})){if(this.isSurge()||this.isLoon()||this.isStash()){$httpClient.post(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}else if(this.isQuanX()){if(typeof t=="string")t={url:t};t["method"]="POST";$task.fetch(t).then(t=>{s(null,this.adapterStatus(t),t.body)},t=>s(t.error,null,null))}else if(this.isNode()){this.node.request.post(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}else if(this.isJSBox()){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let i=t.error;if(i)i=JSON.stringify(t.error);let e=t.data;if(typeof e=="object")e=JSON.stringify(t.data);s(i,this.adapterStatus(t.response),e)};$http.post(t)}}put(t,s=(()=>{})){if(this.isSurge()||this.isLoon()||this.isStash()){t.method="PUT";$httpClient.put(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}else if(this.isQuanX()){if(typeof t=="string")t={url:t};t["method"]="PUT";$task.fetch(t).then(t=>{s(null,this.adapterStatus(t),t.body)},t=>s(t.error,null,null))}else if(this.isNode()){t.method="PUT";this.node.request.put(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}else if(this.isJSBox()){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let i=t.error;if(i)i=JSON.stringify(t.error);let e=t.data;if(typeof e=="object")e=JSON.stringify(t.data);s(i,this.adapterStatus(t.response),e)};$http.post(t)}}costTime(){let t=`${this.name}执行完毕！`;if(this.isNode()&&this.isExecComm){t=`指令【${this.comm[1]}】执行完毕！`}const s=(new Date).getTime();const i=s-this.startTime;const e=i/1e3;this.execCount++;this.costTotalMs+=i;this.log(`${t}耗时【${e}】秒\n总共执行【${this.execCount}】次，平均耗时【${(this.costTotalMs/this.execCount/1e3).toFixed(4)}】秒`);this.setVal(this.costTotalStringKey,JSON.stringify(`${this.costTotalMs},${this.execCount}`))}done(t={}){this.costTime();if(this.isSurge()||this.isQuanX()||this.isLoon()||this.isStash()){$done(t)}}getRequestUrl(){return $request.url}getResponseBody(){return $response.body}isGetCookie(t){return!!($request.method!="OPTIONS"&&this.getRequestUrl().match(t))}isEmpty(t){return typeof t=="undefined"||t==null||t==""||t=="null"||t=="undefined"||t.length===0}randomString(t,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"){t=t||32;let i=s.length;let e="";for(let o=0;o<t;o++){e+=s.charAt(Math.floor(Math.random()*i))}return e}autoComplete(t,s,i,e,o,h,r,n,a,l){t+=``;if(t.length<o){while(t.length<o){if(h==0){t+=e}else{t=e+t}}}if(r){let s=``;for(let t=0;t<n;t++){s+=l}t=t.substring(0,a)+s+t.substring(n+a)}t=s+t+i;return this.toDBC(t)}customReplace(t,s,i,e){try{if(this.isEmpty(i)){i="#{"}if(this.isEmpty(e)){e="}"}for(let o in s){t=t.replace(`${i}${o}${e}`,s[o])}}catch(t){this.logErr(t)}return t}toDBC(t){let s="";for(let i=0;i<t.length;i++){if(t.charCodeAt(i)==32){s=s+String.fromCharCode(12288)}else if(t.charCodeAt(i)<127){s=s+String.fromCharCode(t.charCodeAt(i)+65248)}}return s}hash(t){let s=0,i,e;for(i=0;i<t.length;i++){e=t.charCodeAt(i);s=(s<<5)-s+e;s|=0}return String(s)}formatDate(t,s){let i={"M+":t.getMonth()+1,"d+":t.getDate(),"H+":t.getHours(),"m+":t.getMinutes(),"s+":t.getSeconds(),"q+":Math.floor((t.getMonth()+3)/3),S:t.getMilliseconds()};if(/(y+)/.test(s))s=s.replace(RegExp.$1,(t.getFullYear()+"").substr(4-RegExp.$1.length));for(let t in i)if(new RegExp("("+t+")").test(s))s=s.replace(RegExp.$1,RegExp.$1.length==1?i[t]:("00"+i[t]).substr((""+i[t]).length));return s}}(t,s,i)}
//ToolKit-end
