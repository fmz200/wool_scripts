/*

Author：@ddgksf2013

通知频道：https://t.me/ddgksf2021

更新时间：2022-05-15

公众号墨鱼手记
*/


const scriptName = "RRTV";
const magicJS = new MagicJS(scriptName, "INFO");

const rrtv_tab_home = /.*\/v3plus\/index\/channel\?pageNum=1&position=CHANNEL_INDEX/;
const rrtv_tab_cfg= /.*\/app\/config\/h5NativeBar/;
const rrtv_tab_my = /.*\/v3plus\/index\/channel\?pageNum=1&position=CHANNEL_MY/;
const rrtv_privilege = /.*\/user\/privilege\/list/;
const rrtv_ad_getall = /.*\/ad\/getAll/;
const rrtv_drama_detail = /.*\/drama\/app\/get_combined_drama_detail/;
const rrtv_watch_v4 = /.*\/watch\/v4/;
const rrtv_tv = /.*\/user\/prof/;
const rrtv_level = /.*\/level\/info/;


(() => {
  let body = null;
  if (magicJS.isResponse) {
    switch (true) {
      //首页去广告
      case rrtv_tab_home.test(magicJS.request.url):
        try {
          let obj = JSON.parse(magicJS.response.body);
          delete obj.data.bannerTop;
          for(i = 0;i<obj.data.sections.length;i++){
              if(obj.data.sections[i].id==2717){
                  delete obj.data.sections[i];
              }
          }
          body = JSON.stringify(obj);
        } catch (err) {
          magicJS.logError(`首页去广告出现异常：${err}`);
        }
        break;
      //去除广场
      case rrtv_tab_cfg.test(magicJS.request.url):
        try {
          let obj = JSON.parse(magicJS.response.body);
          obj['data']['homeBarPage'] = [{"darkSelPag":"http://img.rr.tv/barSelpag/20210310/o_1615343956536.pag","selPag":"http://img.rr.tv/barSelpag/20210310/o_1615343961034.pag","pageType":0,"darkUnselImg":"http://img.rr.tv/cover/20210310/o_1615343982560.png","webUrl":"","selImg":"http://img.rr.tv/cover/20210310/o_1615343977931.png","unselImg":"http://img.rr.tv/cover/20210310/o_1615343979417.png","name":"首页","index":1,"nativeAlias":"home","darkSelImg":"http://img.rr.tv/cover/20210310/o_1615343985261.png"},{"darkSelPag":"http://img.rr.tv/barSelpag/20210310/o_1615344101664.pag","selPag":"http://img.rr.tv/barSelpag/20210310/o_1615344101761.pag","pageType":0,"darkUnselImg":"http://img.rr.tv/cover/20210310/o_1615344088886.png","webUrl":"","selImg":"http://img.rr.tv/cover/20210310/o_1615344085709.png","unselImg":"http://img.rr.tv/cover/20210310/o_1615344087390.png","name":"墨魚","index":2,"nativeAlias":"amwayVideo","darkSelImg":"http://img.rr.tv/cover/20210310/o_1615344091229.png"},{"darkSelPag":"http://img.rr.tv/barSelpag/20210310/o_1615344145409.pag","selPag":"http://img.rr.tv/barSelpag/20210310/o_1615344143099.pag","pageType":0,"darkUnselImg":"http://img.rr.tv/img/img/20211013/o_ca5e3b6ce6b747e992789e55222445f2.png","webUrl":"","selImg":"http://img.rr.tv/img/img/20211013/o_14667f24618841a1906fbb2233b8869a.png","unselImg":"http://img.rr.tv/img/img/20211013/o_963933dfc49b4c8bab6e3b36a8a2b42b.png","name":"VIP","index":3,"nativeAlias":"vip","darkSelImg":"http://img.rr.tv/img/img/20211013/o_ad54fb0336764d38910304488804f2a1.png"},{"darkSelPag":"http://img.rr.tv/barSelpag/20210310/o_1615344154522.pag","selPag":"http://img.rr.tv/barSelpag/20210310/o_1615344153652.pag","pageType":0,"darkUnselImg":"http://img.rr.tv/img/img/20211013/o_e35b6941e4a0429486cd5b535337544f.png","webUrl":"","selImg":"http://img.rr.tv/img/img/20211013/o_2e5efef7fd654e3ea8a60e3e719e6e8c.png","unselImg":"http://img.rr.tv/img/img/20211013/o_7492019b1603486383733b7154e967b3.png","name":"我的","index":4,"nativeAlias":"my","darkSelImg":"http://img.rr.tv/img/img/20211013/o_f98a74489e3d4dc9bf8651eea65b949e.png"}];
          body = JSON.stringify(obj);
        } catch (err) {
          magicJS.logError(`广场去广告出现异常：${err}`);
        }
        break;
        //去除商城广告
      case rrtv_tab_my.test(magicJS.request.url):
        try {
          let obj = JSON.parse(magicJS.response.body);
          obj['data']['sections'] = [{"id":2541,"sectionType":"MAGIC_CUBE","displayTitle":"1","startTime":null,"position":23,"display":"SCROLL","moreText":"","sectionContents":[{"feeMode":null,"pictureHeight":null,"targetId":"rrspjump://webview?url=http%3A%2F%2Fmobile.rr.tv%2FappWeb%2F%23%2FbugList","id":34,"pictureWidth":null,"title":"公眾號","targetType":"H5","sectionId":2541,"orderNum":1,"subTitle":null,"icon":"http://img.rr.tv/cover/20210201/o_1612169512400.png"},{"feeMode":null,"pictureHeight":null,"targetId":"rrspjump://webview?url=http%3A%2F%2Fmobile.rr.tv%2Fmission%2F%23%2Fachievement%2Fcenter","id":35,"pictureWidth":null,"title":"墨魚手記","targetType":"H5","sectionId":2541,"orderNum":2,"subTitle":null,"icon":"http://img.rr.tv/cover/20210201/o_1612169790308.png"},],"endTime":null,"targetType":null,"sequence":3,"name":"其他","targetId":"rrspjump://empty"}];
          body = JSON.stringify(obj);
        } catch (err) {
          magicJS.logError(`商城去广告出现异常：${err}`);
        }
        break;
      //rrtv_privilege
      case rrtv_privilege.test(magicJS.request.url):
        try {
          let obj = JSON.parse(magicJS.response.body);
          obj.data = [{"id":1,"effectObject":"video","action":"play","function":"originalPainting","func":"originalPainting","description":"解锁原画","icon":"jiesuoyuanhua","endTime":9999940148000},{"id":4,"effectObject":"video","action":"play","function":"noLimit","func":"noLimit","description":"看剧无限制","icon":"kanjuwuxianzhi","endTime":9999940148000},{"id":23,"effectObject":"video","action":"play","function":"noAd","func":"noAd","description":"看剧无广告","icon":"kanjuwuguanggao","endTime":9999940148000},{"id":43,"effectObject":"danmu","action":"send","function":"superBarrageBlue","func":"superBarrageBlue","description":"超级弹幕","icon":"chaojidanmu","endTime":9999940148000},{"id":46,"effectObject":"video","action":"play","function":"vipVideo","func":"vipVideo","description":"勋章专享剧集","icon":"zhuanxiangjuji","endTime":9999940148000},{"id":45,"effectObject":"mall","action":"sale","function":"mallDiscount","func":"mallDiscount","description":"龙醇商城九折","icon":"longchunshangcheng","endTime":9999940148000},{"id":37,"effectObject":"growth","action":"play","function":"0.4","func":"0.4","description":"看剧经验+40%","icon":"jingyanzhijiacheng","endTime":9999940148000},{"id":25,"effectObject":"nickName","action":"show","function":"nameHighLight","func":"nameHighLight","description":"高亮昵称","icon":"gaoliangnicheng","endTime":9999940148000},{"id":24,"effectObject":"comment","action":"write","function":"highLight","func":"highLight","description":"高亮评论回复","icon":"https://img.rr.tv/static/images/20170926/HighLigthComment@2x.png","endTime":9999940148000},{"id":20,"effectObject":"article","action":"write","function":"highLight","func":"highLight","description":"高亮发帖","icon":"gaoliangfatie","endTime":9999940148000}];
          body = JSON.stringify(obj);
        } catch (err) {
          magicJS.logError(`privilege去广告出现异常：${err}`);
        }
        break;
        //rrtv_ad_getall
      case rrtv_ad_getall.test(magicJS.request.url):
        try {
          let obj = JSON.parse(magicJS.response.body);
          obj.data.adList = [];
          body = JSON.stringify(obj);
        } catch (err) {
          magicJS.logError(`ad_getall去广告出现异常：${err}`);
        }
        break;
         //rrtv_drama
      case rrtv_drama_detail.test(magicJS.request.url):
        try {
          body = magicJS.response.body.replace(/currentQuality":"\w+/g, 'currentQuality":"AI_OD').replace(/canPlay":false/g, 'canPlay":true').replace(/canShowVip":true/g, 'canShowVip":false');         
        } catch (err) {
          magicJS.logError(`drama去广告出现异常：${err}`);
        }
        break;
        //rrtv_watch_4
      case rrtv_watch_v4.test(magicJS.request.url):
        try {
          body = magicJS.response.body.replace(/currentQuality":"\w+/g, 'currentQuality":"AI_OD').replace(/canPlay":false/g, 'canPlay":true').replace(/canShowVip":true/g, 'canShowVip":false');          
        } catch (err) {
          magicJS.logError(`watch_4去广告出现异常：${err}`);
        }
        break;
        //rrtv_pro
      case rrtv_tv.test(magicJS.request.url):
        try {
          let obj = JSON.parse(magicJS.response.body);
          obj.data.user.medalList=[{"name":"大魔王","endTime":"2299-02-22 02:44:53","imgUrl":"http://img.rr.tv/cover/20200424/o_1587720799676.png","id":1}];
          obj.data.user.privilegeList=[{"id":null,"createTimeStr":"","createTime":null,"updateTime":null,"effectObject":"video","action":"play","function":"originalPainting","func":"originalPainting","description":"解锁原画","icon":"jiesuoyuanhua","endTime":9999987654321},{"id":null,"createTimeStr":"","createTime":null,"updateTime":null,"effectObject":"mall","action":"sale","function":"mallDiscount","func":"mallDiscount","description":"龙醇商城九折","icon":"longchunshangcheng","endTime":9999987654321},{"id":null,"createTimeStr":"","createTime":null,"updateTime":null,"effectObject":"article","action":"write","function":"highLight","func":"highLight","description":"高亮发帖","icon":"gaoliangfatie","endTime":9999987654321},{"id":null,"createTimeStr":"","createTime":null,"updateTime":null,"effectObject":"nickName","action":"show","function":"nameHighLight","func":"nameHighLight","description":"高亮昵称","icon":"gaoliangnicheng","endTime":9999987654321},{"id":null,"createTimeStr":"","createTime":null,"updateTime":null,"effectObject":"comment","action":"write","function":"highLight","func":"highLight","description":"高亮评论回复","icon":"huifu","endTime":9999987654321},{"id":null,"createTimeStr":"","createTime":null,"updateTime":null,"effectObject":"danmu","action":"send","function":"superBarrageBlue","func":"superBarrageBlue","description":"超级弹幕","icon":"chaojidanmu","endTime":9999987654321},{"id":null,"createTimeStr":"","createTime":null,"updateTime":null,"effectObject":"video","action":"play","function":"vipVideo","func":"vipVideo","description":"勋章专享剧集","icon":"zhuanxiangjuji","endTime":9999987654321},{"id":null,"createTimeStr":"","createTime":null,"updateTime":null,"effectObject":"growth","action":"play","function":"0.4","func":"0.4","description":"看剧经验+40%","icon":"jingyanzhijiacheng","endTime":9999987654321},{"id":null,"createTimeStr":"","createTime":null,"updateTime":null,"effectObject":"video","action":"play","function":"noLimit","func":"noLimit","description":"看剧无限制","icon":"kanjuwuxianzhi","endTime":9999987654321},{"id":null,"createTimeStr":"","createTime":null,"updateTime":null,"effectObject":"video","action":"play","function":"noAd","func":"noAd","description":"看剧无广告","icon":"kanjuwuguanggao","endTime":9999987654321}];
          obj.data.user.vipMedal={"name":"大魔王","endTime":"2299-02-22 02:44:53","imgUrl":"http://img.rr.tv/cover/20200424/o_1587720799676.png","id":1,"isExpired":false};
          body = JSON.stringify(obj);
        } catch (err) {
          magicJS.logError(`pro去广告出现异常：${err}`);
        }
        break;
        case rrtv_level.test(magicJS.request.url):
        try {
          let obj = JSON.parse(magicJS.response.body);
          obj.data ={
            "level": "1",
            "expiredTime": 2599319252,
            "valid": true
          };
          body = JSON.stringify(obj);
        } catch (err) {
          magicJS.logError(`rrtv_level出现异常：${err}`);
        }
        break;
      default:
        magicJS.logWarning("触发意外的请求处理，请确认脚本或复写配置正常。");
        break;
    }
  } else {
    magicJS.logWarning("触发意外的请求处理，请确认脚本或复写配置正常。");
  }
  if (body) {
    magicJS.done({ body });
  } else {
    magicJS.done();
  }
})();

// @formatter:off
function MagicJS(e="MagicJS",t="INFO"){function s(){_keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",this.encode=function(e){var t,s,o,i,r,n,a,c="",h=0;for(e=_utf8_encode(e);h<e.length;)i=(t=e.charCodeAt(h++))>>2,r=(3&t)<<4|(s=e.charCodeAt(h++))>>4,n=(15&s)<<2|(o=e.charCodeAt(h++))>>6,a=63&o,isNaN(s)?n=a=64:isNaN(o)&&(a=64),c=c+_keyStr.charAt(i)+_keyStr.charAt(r)+_keyStr.charAt(n)+_keyStr.charAt(a);return c},this.decode=function(e){var t,s,o,i,r,n,a="",c=0;for(e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");c<e.length;)t=_keyStr.indexOf(e.charAt(c++))<<2|(i=_keyStr.indexOf(e.charAt(c++)))>>4,s=(15&i)<<4|(r=_keyStr.indexOf(e.charAt(c++)))>>2,o=(3&r)<<6|(n=_keyStr.indexOf(e.charAt(c++))),a+=String.fromCharCode(t),64!=r&&(a+=String.fromCharCode(s)),64!=n&&(a+=String.fromCharCode(o));return a=_utf8_decode(a)},_utf8_encode=function(e){e=e.replace(/\r\n/g,"\n");for(var t="",s=0;s<e.length;s++){var o=e.charCodeAt(s);o<128?t+=String.fromCharCode(o):o>127&&o<2048?(t+=String.fromCharCode(o>>6|192),t+=String.fromCharCode(63&o|128)):(t+=String.fromCharCode(o>>12|224),t+=String.fromCharCode(o>>6&63|128),t+=String.fromCharCode(63&o|128))}return t},_utf8_decode=function(e){for(var t="",s=0,o=c1=c2=0;s<e.length;)(o=e.charCodeAt(s))<128?(t+=String.fromCharCode(o),s++):o>191&&o<224?(c2=e.charCodeAt(s+1),t+=String.fromCharCode((31&o)<<6|63&c2),s+=2):(c2=e.charCodeAt(s+1),c3=e.charCodeAt(s+2),t+=String.fromCharCode((15&o)<<12|(63&c2)<<6|63&c3),s+=3);return t}}return new class{constructor(){if(this.version="2.2.3.1",this.scriptName=e,this.logLevels={DEBUG:5,INFO:4,NOTIFY:3,WARNING:2,ERROR:1,CRITICAL:0,NONE:-1},this.isLoon="undefined"!=typeof $loon,this.isQuanX="undefined"!=typeof $task,this.isJSBox="undefined"!=typeof $drive,this.isNode="undefined"!=typeof module&&!this.isJSBox,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.node={request:void 0,fs:void 0,data:{}},this.iOSUserAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Mobile/15E148 Safari/604.1",this.pcUserAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36 Edg/84.0.522.59",this.logLevel=t,this._barkUrl="",this.b64codecs=new s,this.isNode){this.node.fs=require("fs"),this.node.request=require("request");try{this.node.fs.accessSync("./magic.json",this.node.fs.constants.R_OK|this.node.fs.constants.W_OK)}catch(e){this.node.fs.writeFileSync("./magic.json","{}",{encoding:"utf8"})}this.node.data=require("./magic.json")}else this.isJSBox&&($file.exists("drive://MagicJS")||$file.mkdir("drive://MagicJS"),$file.exists("drive://MagicJS/magic.json")||$file.write({data:$data({string:"{}"}),path:"drive://MagicJS/magic.json"}))}set barkUrl(e){this._barkUrl=e.replace(/\/+$/g,"")}set logLevel(e){this._logLevel="string"==typeof e?e.toUpperCase():"DEBUG"}get logLevel(){return this._logLevel}get isRequest(){return"undefined"!=typeof $request&&"undefined"==typeof $response}get isResponse(){return"undefined"!=typeof $response}get request(){return"undefined"!=typeof $request?$request:void 0}get response(){return"undefined"!=typeof $response?($response.hasOwnProperty("status")&&($response.statusCode=$response.status),$response.hasOwnProperty("statusCode")&&($response.status=$response.statusCode),$response):void 0}get platform(){return this.isSurge?"Surge":this.isQuanX?"Quantumult X":this.isLoon?"Loon":this.isJSBox?"JSBox":this.isNode?"Node.js":"unknown"}read(e,t=""){let s="";this.isSurge||this.isLoon?s=$persistentStore.read(e):this.isQuanX?s=$prefs.valueForKey(e):this.isNode?s=this.node.data:this.isJSBox&&(s=$file.read("drive://MagicJS/magic.json").string);try{this.isNode&&(s=s[e]),this.isJSBox&&(s=JSON.parse(s)[e]),t&&("string"==typeof s&&(s=JSON.parse(s)),s=s&&"object"==typeof s?s[t]:null)}catch(o){this.logError(o),s=t?{}:null,this.del(e)}void 0===s&&(s=null);try{s&&"string"==typeof s&&(s=JSON.parse(s))}catch(e){}return this.logDebug(`READ DATA [${e}]${t?`[${t}]`:""}(${typeof s})\n${JSON.stringify(s)}`),s}write(e,t,s=""){let o=s?{}:"";if(s&&(this.isSurge||this.isLoon)?o=$persistentStore.read(e):s&&this.isQuanX?o=$prefs.valueForKey(e):this.isNode?o=this.node.data:this.isJSBox&&(o=JSON.parse($file.read("drive://MagicJS/magic.json").string)),s){try{"string"==typeof o&&(o=JSON.parse(o)),o="object"==typeof o&&o?o:{}}catch(t){this.logError(t),this.del(e),o={}}this.isJSBox||this.isNode?(o.hasOwnProperty(e)&&"object"==typeof o[e]||(o[e]={}),o[e].hasOwnProperty(s)||(o[e][s]=null),void 0===t?delete o[e][s]:o[e][s]=t):void 0===t?delete o[s]:o[s]=t}else this.isNode||this.isJSBox?void 0===t?delete o[e]:o[e]=t:o=void 0===t?null:t;"object"==typeof o&&(o=JSON.stringify(o)),this.isSurge||this.isLoon?$persistentStore.write(o,e):this.isQuanX?$prefs.setValueForKey(o,e):this.isNode?this.node.fs.writeFileSync("./magic.json",o):this.isJSBox&&$file.write({data:$data({string:o}),path:"drive://MagicJS/magic.json"}),this.logDebug(`WRITE DATA [${e}]${s?`[${s}]`:""}(${typeof t})\n${JSON.stringify(t)}`)}del(e,t=""){this.logDebug(`DELETE KEY [${e}]${t?`[${t}]`:""}`),this.write(e,null,t)}notify(e=this.scriptName,t="",s="",o=""){this.logNotify(`title:${e}\nsubTitle:${t}\nbody:${s}\noptions:${"object"==typeof o?JSON.stringify(o):o}`);if(o=(e=>{let t={};return"string"==typeof e?this.isLoon?t={openUrl:e}:this.isQuanX&&(t={"open-url":e}):"object"==typeof e&&(this.isLoon?(t.openUrl=e["open-url"]?e["open-url"]:"",t.mediaUrl=e["media-url"]?e["media-url"]:""):this.isQuanX&&(t=e["open-url"]||e["media-url"]?e:{})),t})(o),1==arguments.length&&(e=this.scriptName,t="",s=arguments[0]),this.isSurge)$notification.post(e,t,s);else if(this.isLoon)o?$notification.post(e,t,s,o):$notification.post(e,t,s);else if(this.isQuanX)$notify(e,t,s,o);else if(this.isNode){if(this._barkUrl){let o=encodeURI(`${e}/${t}\n${s}`);this.get(`${this._barkUrl}/${o}`,()=>{})}}else if(this.isJSBox){let o={title:e,body:t?`${t}\n${s}`:s};$push.schedule(o)}}log(e,t="INFO"){this.logLevels[this._logLevel]<this.logLevels[t.toUpperCase()]||console.log(`[${t}] [${this.scriptName}]\n${e}\n`)}logDebug(e){this.log(e,"DEBUG")}logInfo(e){this.log(e,"INFO")}logNotify(e){this.log(e,"NOTIFY")}logWarning(e){this.log(e,"WARNING")}logError(e){this.log(e,"ERROR")}adapterHttpOptions(e,t){let s="object"==typeof e?Object.assign({},e):{url:e,headers:{}};s.hasOwnProperty("header")&&!s.hasOwnProperty("headers")&&(s.headers=s.header,delete s.header);const o={accept:"Accept","accept-ch":"Accept-CH","accept-charset":"Accept-Charset","accept-features":"Accept-Features","accept-encoding":"Accept-Encoding","accept-language":"Accept-Language","accept-ranges":"Accept-Ranges","access-control-allow-credentials":"Access-Control-Allow-Credentials","access-control-allow-origin":"Access-Control-Allow-Origin","access-control-allow-methods":"Access-Control-Allow-Methods","access-control-allow-headers":"Access-Control-Allow-Headers","access-control-max-age":"Access-Control-Max-Age","access-control-expose-headers":"Access-Control-Expose-Headers","access-control-request-method":"Access-Control-Request-Method","access-control-request-headers":"Access-Control-Request-Headers",age:"Age",allow:"Allow",alternates:"Alternates",authorization:"Authorization","cache-control":"Cache-Control",connection:"Connection","content-encoding":"Content-Encoding","content-language":"Content-Language","content-length":"Content-Length","content-location":"Content-Location","content-md5":"Content-MD5","content-range":"Content-Range","content-security-policy":"Content-Security-Policy","content-type":"Content-Type",cookie:"Cookie",dnt:"DNT",date:"Date",etag:"ETag",expect:"Expect",expires:"Expires",from:"From",host:"Host","if-match":"If-Match","if-modified-since":"If-Modified-Since","if-none-match":"If-None-Match","if-range":"If-Range","if-unmodified-since":"If-Unmodified-Since","last-event-id":"Last-Event-ID","last-modified":"Last-Modified",link:"Link",location:"Location","max-forwards":"Max-Forwards",negotiate:"Negotiate",origin:"Origin",pragma:"Pragma","proxy-authenticate":"Proxy-Authenticate","proxy-authorization":"Proxy-Authorization",range:"Range",referer:"Referer","retry-after":"Retry-After","sec-websocket-extensions":"Sec-Websocket-Extensions","sec-websocket-key":"Sec-Websocket-Key","sec-websocket-origin":"Sec-Websocket-Origin","sec-websocket-protocol":"Sec-Websocket-Protocol","sec-websocket-version":"Sec-Websocket-Version",server:"Server","set-cookie":"Set-Cookie","set-cookie2":"Set-Cookie2","strict-transport-security":"Strict-Transport-Security",tcn:"TCN",te:"TE",trailer:"Trailer","transfer-encoding":"Transfer-Encoding",upgrade:"Upgrade","user-agent":"User-Agent","variant-vary":"Variant-Vary",vary:"Vary",via:"Via",warning:"Warning","www-authenticate":"WWW-Authenticate","x-content-duration":"X-Content-Duration","x-content-security-policy":"X-Content-Security-Policy","x-dnsprefetch-control":"X-DNSPrefetch-Control","x-frame-options":"X-Frame-Options","x-requested-with":"X-Requested-With","x-surge-skip-scripting":"X-Surge-Skip-Scripting"};if("object"==typeof s.headers)for(let e in s.headers)o[e]&&(s.headers[o[e]]=s.headers[e],delete s.headers[e]);s.headers&&"object"==typeof s.headers&&s.headers["User-Agent"]||(s.headers&&"object"==typeof s.headers||(s.headers={}),this.isNode?s.headers["User-Agent"]=this.pcUserAgent:s.headers["User-Agent"]=this.iOSUserAgent);let i=!1;if(("object"==typeof s.opts&&(!0===s.opts.hints||!0===s.opts["Skip-Scripting"])||"object"==typeof s.headers&&!0===s.headers["X-Surge-Skip-Scripting"])&&(i=!0),i||(this.isSurge?s.headers["X-Surge-Skip-Scripting"]=!1:this.isLoon?s.headers["X-Requested-With"]="XMLHttpRequest":this.isQuanX&&("object"!=typeof s.opts&&(s.opts={}),s.opts.hints=!1)),this.isSurge&&!i||delete s.headers["X-Surge-Skip-Scripting"],!this.isQuanX&&s.hasOwnProperty("opts")&&delete s.opts,this.isQuanX&&s.hasOwnProperty("opts")&&delete s.opts["Skip-Scripting"],"GET"===t&&!this.isNode&&s.body){let e=Object.keys(s.body).map(e=>void 0===s.body?"":`${encodeURIComponent(e)}=${encodeURIComponent(s.body[e])}`).join("&");s.url.indexOf("?")<0&&(s.url+="?"),s.url.lastIndexOf("&")+1!=s.url.length&&s.url.lastIndexOf("?")+1!=s.url.length&&(s.url+="&"),s.url+=e,delete s.body}return this.isQuanX?(s.hasOwnProperty("body")&&"string"!=typeof s.body&&(s.body=JSON.stringify(s.body)),s.method=t):this.isNode?(delete s.headers["Accept-Encoding"],"object"==typeof s.body&&("GET"===t?(s.qs=s.body,delete s.body):"POST"===t&&(s.json=!0,s.body=s.body))):this.isJSBox&&(s.header=s.headers,delete s.headers),s}get(e,t){let s=this.adapterHttpOptions(e,"GET");if(this.logDebug(`HTTP GET: ${JSON.stringify(s)}`),this.isSurge||this.isLoon)$httpClient.get(s,t);else if(this.isQuanX)$task.fetch(s).then(e=>{e.status=e.statusCode,t(null,e,e.body)},e=>t(e.error,null,null));else{if(this.isNode)return this.node.request.get(s,t);this.isJSBox&&(s.handler=(e=>{let s=e.error?JSON.stringify(e.error):void 0,o="object"==typeof e.data?JSON.stringify(e.data):e.data;t(s,e.response,o)}),$http.get(s))}}post(e,t){let s=this.adapterHttpOptions(e,"POST");if(this.logDebug(`HTTP POST: ${JSON.stringify(s)}`),this.isSurge||this.isLoon)$httpClient.post(s,t);else if(this.isQuanX)$task.fetch(s).then(e=>{e.status=e.statusCode,t(null,e,e.body)},e=>{t(e.error,null,null)});else{if(this.isNode)return this.node.request.post(s,t);this.isJSBox&&(s.handler=(e=>{let s=e.error?JSON.stringify(e.error):void 0,o="object"==typeof e.data?JSON.stringify(e.data):e.data;t(s,e.response,o)}),$http.post(s))}}done(e={}){"undefined"!=typeof $done&&$done(e)}b64encode(e){return this.b64codecs.encode(e)}b64decode(e){return this.b64codecs.decode(e)}isToday(e){if(null==e)return!1;{let t=new Date;return"string"==typeof e&&(e=new Date(e)),t.getFullYear()==e.getFullYear()&&t.getMonth()==e.getMonth()&&t.getDay()==e.getDay()}}isNumber(e){return"NaN"!==parseFloat(e).toString()}attempt(e,t=null){return e.then(e=>[null,e]).catch(e=>(this.logError(e),[e,t]))}retry(e,t=5,s=0,o=null){return(...i)=>new Promise((r,n)=>{(function i(...a){Promise.resolve().then(()=>e.apply(this,a)).then(e=>{"function"==typeof o?Promise.resolve().then(()=>o(e)).then(()=>{r(e)}).catch(e=>{this.logError(e),t>=1&&s>0?setTimeout(()=>i.apply(this,a),s):t>=1?i.apply(this,a):n(e),t--}):r(e)}).catch(e=>{this.logError(e),t>=1&&s>0?setTimeout(()=>i.apply(this,a),s):t>=1?i.apply(this,a):n(e),t--})}).apply(this,i)})}formatTime(e,t="yyyy-MM-dd hh:mm:ss"){var s={"M+":e.getMonth()+1,"d+":e.getDate(),"h+":e.getHours(),"m+":e.getMinutes(),"s+":e.getSeconds(),"q+":Math.floor((e.getMonth()+3)/3),S:e.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(e.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in s)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?s[e]:("00"+s[e]).substr((""+s[e]).length)));return t}now(){return this.formatTime(new Date,"yyyy-MM-dd hh:mm:ss")}today(){return this.formatTime(new Date,"yyyy-MM-dd")}sleep(e){return new Promise(t=>setTimeout(t,e))}}(e)}
// @formatter:on
