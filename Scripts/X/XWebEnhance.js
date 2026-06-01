/**
 * @author fmz200
 * @function X(Twitter)网页版功能增强
 * @date 2026-06-01 23:30:00
 */

const $ = new Env("X(Twitter)网页版功能增强");
let req_url = $request.url;
let rsp_body = "{}";
// 检查 $response 是否已定义
if (typeof $response !== 'undefined' && $response !== null) {
  // 如果 $response 已定义且不为 null，则使用 $response.body
  rsp_body = $response.body;
}

let mod_rsp = rsp_body;
try {
  mod_rsp = JSON.parse(rsp_body);
  
  // "顶部标签页" - 从 BoxJS 读取配置动态生成 PinnedTimelines 数据
  if (req_url.includes("/PinnedTimelines?")) {
    // 所有可用标签的完整列表
    const allTimelines = [
      { "__typename": "TagPinnedTimeline", "description": "Politics, Government, Elections, Policy, Congress", "icon_name": "topic_politics", "name": "政治", "scribe": "1925952771733262336", "tab_label": "政治", "tag": "1925952771733262336" },
      { "__typename": "TagPinnedTimeline", "description": "Interest Rates, Federal Reserve, Bonds, Options, Futures, Employment, Energy, Oil, Stocks, Macroeconomics, Economy", "icon_name": "topic_business", "name": "股票与经济", "scribe": "1925952876284727296", "tab_label": "股票", "tag": "1925952876284727296" },
      { "__typename": "TagPinnedTimeline", "description": "Business & Finance, Economy, Markets, Investing, Corporate", "icon_name": "topic_business", "name": "商业与金融", "scribe": "1925949659857530880", "tab_label": "商业", "tag": "1925949659857530880" },
      { "__typename": "TagPinnedTimeline", "description": "Science, Research, Discovery, Biology, Physics", "icon_name": "topic_science", "name": "科学", "scribe": "1925949744683114496", "tab_label": "科学", "tag": "1925949744683114496" },
      { "__typename": "TagPinnedTimeline", "description": "Artificial Intelligence, AI, Machine Learning, ChatGPT, LLM", "icon_name": "topic_ai", "name": "人工智能", "scribe": "1925953013547450368", "tab_label": "AI", "tag": "1925953013547450368" },
      { "__typename": "TagPinnedTimeline", "description": "Cryptocurrency, Crypto, Bitcoin, Ethereum, Blockchain", "icon_name": "topic_crypto", "name": "加密货币", "scribe": "1925949693290295298", "tab_label": "加密", "tag": "1925949693290295298" },
      { "__typename": "TagPinnedTimeline", "description": "News, Breaking News, Headlines, Journalism, Current Events", "icon_name": "topic_news", "name": "新闻", "scribe": "1925949634972626944", "tab_label": "新闻", "tag": "1925949634972626944" },
      { "__typename": "TagPinnedTimeline", "description": "Personal Finance, Budgeting, Saving, Money, Investing", "icon_name": "topic_biz_finance", "name": "个人理财", "scribe": "1925952988486447104", "tab_label": "金融", "tag": "1925952988486447104" },
      { "__typename": "TagPinnedTimeline", "description": "Software Development, Programming, Coding, Developer, Open Source", "icon_name": "topic_software", "name": "软件开发", "scribe": "1925953040130953216", "tab_label": "软件", "tag": "1925953040130953216" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_sports", "name": "体育", "scribe": "1925949452197478400", "tab_label": "体育", "tag": "1925949452197478400" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_technology", "name": "科技", "scribe": "1925949722688126976", "tab_label": "科技", "tag": "1925949722688126976" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_art", "name": "艺术", "scribe": "1925949898106540032", "tab_label": "艺术", "tag": "1925949898106540032" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_movies_tv", "name": "电影与电视", "scribe": "1925949788068909057", "tab_label": "电影与电视", "tag": "1925949788068909057" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_gaming", "name": "游戏", "scribe": "1925949766673797120", "tab_label": "游戏", "tag": "1925949766673797120" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_football", "name": "美式橄榄球", "scribe": "1925950554133446656", "tab_label": "橄榄球", "tag": "1925950554133446656" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_anime", "name": "动漫", "scribe": "1925949503837798401", "tab_label": "动漫", "tag": "1925949503837798401" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_travel", "name": "旅行", "scribe": "1925949812844769280", "tab_label": "旅行", "tag": "1925949812844769280" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_food", "name": "美食与饮品", "scribe": "1925949835649126400", "tab_label": "美食", "tag": "1925949835649126400" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_baseball", "name": "棒球", "scribe": "1925950576740675584", "tab_label": "棒球", "tag": "1925950576740675584" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_basketball", "name": "篮球", "scribe": "1925950530842464256", "tab_label": "篮球", "tag": "1925950530842464256" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_beauty", "name": "美妆", "scribe": "1925950199861538818", "tab_label": "美妆", "tag": "1925950199861538818" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_boxing", "name": "拳击", "scribe": "1925950713982537888", "tab_label": "拳击", "tag": "1925950713982537888" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_soccer", "name": "足球", "scribe": "1925950498420469760", "tab_label": "足球", "tag": "1925950498420469760" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_education", "name": "职业", "scribe": "1925950361245786112", "tab_label": "职业", "tag": "1925950361245786112" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_racing_car", "name": "汽车", "scribe": "1925950007624028160", "tab_label": "汽车", "tag": "1925950007624028160" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_pets", "name": "宠物", "scribe": "1925950249245282304", "tab_label": "宠物", "tag": "1925950249245282304" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_celebrity", "name": "名人", "scribe": "1925949555071176704", "tab_label": "名人", "tag": "1925949555071176704" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_music", "name": "音乐", "scribe": "1925949604224196608", "tab_label": "音乐", "tag": "1925949604224196608" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_music", "name": "乡村音乐", "scribe": "1925952353485602816", "tab_label": "乡村音乐", "tag": "1925952353485602816" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_dance", "name": "舞蹈", "scribe": "1925950383899267072", "tab_label": "舞蹈", "tag": "1925950383899267072" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_relationship", "name": "恋爱与交友", "scribe": "1925950276835454977", "tab_label": "恋爱", "tag": "1925950276835454977" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_design", "name": "设计", "scribe": "1925954681496322048", "tab_label": "设计", "tag": "1925954681496322048" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_education", "name": "教育", "scribe": "1925950405709631490", "tab_label": "教育", "tag": "1925950405709631490" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_music", "name": "电子音乐", "scribe": "1925952257893257217", "tab_label": "电音", "tag": "1925952257893257217" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_business", "name": "创业公司", "scribe": "1925952916411564032", "tab_label": "创业公司", "tag": "1925952916411564032" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_gaming", "name": "电子竞技", "scribe": "1925950783448576000", "tab_label": "电子竞技", "tag": "1925950783448576000" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_family", "name": "婚姻与家庭", "scribe": "1925954059338493952", "tab_label": "家庭", "tag": "1925954059338493952" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_fashion_beauty", "name": "时尚", "scribe": "1925949932181082112", "tab_label": "时尚", "tag": "1925949932181082112" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_music", "name": "流行音乐", "scribe": "1925952179791151105", "tab_label": "流行音乐", "tag": "1925952179791151105" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_golf", "name": "高尔夫", "scribe": "1925950690574180352", "tab_label": "高尔夫", "tag": "1925950690574180352" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_music", "name": "韩流音乐", "scribe": "1925952056088530944", "tab_label": "韩流音乐", "tag": "1925952056088530944" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_memes", "name": "表情包", "scribe": "1925949876694556672", "tab_label": "表情包", "tag": "1925949876694556672" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_health", "name": "健康与健身", "scribe": "1925949856834588672", "tab_label": "健康", "tag": "1925949856834588672" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_boxing", "name": "综合格斗与摔跤", "scribe": "1925950600140718080", "tab_label": "摔跤", "tag": "1925950600140718080" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_racing_car", "name": "赛车与汽车运动", "scribe": "1943810034309246976", "tab_label": "赛车", "tag": "1943810034309246976" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_racing_bike", "name": "摩托车", "scribe": "1925950100397793280", "tab_label": "摩托车", "tag": "1925950100397793280" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_nature", "name": "自然与户外", "scribe": "1925950228047216640", "tab_label": "自然", "tag": "1925950228047216640" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_hockey", "name": "冰球", "scribe": "1925950813043662848", "tab_label": "曲棍球", "tag": "1925950813043662848" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_sports", "name": "奥运会", "scribe": "1943811470724153345", "tab_label": "奥运会", "tag": "1943811470724153345" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_photography", "name": "摄影", "scribe": "1925954143472017408", "tab_label": "照片", "tag": "1925954143472017408" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_podcasts", "name": "播客", "scribe": "1925950433807175680", "tab_label": "播客", "tag": "1925950433807175680" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_realestate", "name": "房地产", "scribe": "1925952947197784064", "tab_label": "房地产", "tag": "1925952947197784064" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_technology", "name": "机器人", "scribe": "1925953169307189248", "tab_label": "机器人", "tag": "1925953169307189248" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_music", "name": "摇滚", "scribe": "1925952228818354177", "tab_label": "摇滚", "tag": "1925952228818354177" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_football", "name": "橄榄球", "scribe": "1925950895595876352", "tab_label": "橄榄球", "tag": "1925950895595876352" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_shopping", "name": "购物", "scribe": "1925949979966701568", "tab_label": "购物", "tag": "1925949979966701568" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_skiing", "name": "冰雪运动", "scribe": "1925950954962096130", "tab_label": "冰雪运动", "tag": "1925950954962096130" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_space", "name": "太空", "scribe": "1925953141452718081", "tab_label": "太空", "tag": "1925953141452718081" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_sports", "name": "网球", "scribe": "1925950625835008001", "tab_label": "网球", "tag": "1925950625835008001" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_home", "name": "家居园艺", "scribe": "1925950341452845057", "tab_label": "首页", "tag": "1925950341452845057" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_cricket", "name": "板球", "scribe": "1925950653035151360", "tab_label": "板球", "tag": "1925950653035151360" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_racing_car", "name": "一级方程式", "scribe": "1925950746756800513", "tab_label": "F1", "tag": "1925950746756800513" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_cycling", "name": "骑行", "scribe": "1925950926910582786", "tab_label": "骑行", "tag": "1925950926910582786" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_music", "name": "J-Pop", "scribe": "1925952123960709120", "tab_label": "J-Pop", "tag": "1925952123960709120" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_music", "name": "音乐会", "scribe": "1925952145615974400", "tab_label": "音乐会", "tag": "1925952145615974400" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_music", "name": "嘻哈", "scribe": "1925952203962896384", "tab_label": "嘻哈", "tag": "1925952203962896384" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_music", "name": "爵士乐", "scribe": "1925952300213768192", "tab_label": "爵士乐", "tag": "1925952300213768192" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_news", "name": "犯罪", "scribe": "1925952744239620096", "tab_label": "犯罪", "tag": "1925952744239620096" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_politics", "name": "选举", "scribe": "1925952820714332161", "tab_label": "选举", "tag": "1925952820714332161" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_science", "name": "生物技术", "scribe": "1925953107038519296", "tab_label": "生物技术", "tag": "1925953107038519296" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_health", "name": "心理健康", "scribe": "1925953421338726400", "tab_label": "心理健康", "tag": "1925953421338726400" },
      { "__typename": "TagPinnedTimeline", "icon_name": "topic_art", "name": "数字艺术", "scribe": "1925954197326831616", "tab_label": "数字艺术", "tag": "1925954197326831616" }
    ];

    // 构建 tag -> 数据 的查找表
    const timelineMap = {};
    allTimelines.forEach(item => { timelineMap[item.tag] = item; });

    // 从 BoxJS 读取用户配置的标签顺序
    const selectedTagsStr = $.getdata("X_web_pinned_timelines");
    let pinnedTimelines;

    if (selectedTagsStr && selectedTagsStr.trim()) {
      // 按用户配置的顺序生成数据
      const selectedTags = selectedTagsStr.split(",").map(s => s.trim()).filter(s => s);
      pinnedTimelines = [];
      const invalidTags = [];
      selectedTags.forEach(tag => {
        if (timelineMap[tag]) {
          pinnedTimelines.push(timelineMap[tag]);
        } else {
          invalidTags.push(tag);
        }
      });
      if (invalidTags.length > 0) {
        console.log(`⚠️无效的标签tag: ${invalidTags.join(",")}`);
      }
      console.log(`✅PinnedTimelines从BoxJS读取配置，共${pinnedTimelines.length}个标签`);
    } else {
      // 未配置时使用默认标签
      pinnedTimelines = allTimelines.slice(0, 9);
      console.log(`✅PinnedTimelines使用默认标签（BoxJS未配置）`);
    }

    mod_rsp = {
      "data": {
        "pinned_timelines": {
          "pinned_timelines": pinnedTimelines
        }
      }
    };
    console.log(`✅PinnedTimelines返回已选的的标签页数据`);
  }
} catch (error) {
  console.log('脚本运行出现错误，部分广告未去除⚠️错误信息：' + error.message);
}

/*
$done()方法参数说明：
  $done(): 不传任何参数，表示放弃该请求，请求连接会直接断开
  $done({}): 空js对象，请求继续，任何请求参数不会有任何变化
  $done({   status:200,   headers:{},   body:"xxx" })
 */
$.done({body: JSON.stringify(mod_rsp)});


/*********************************** ENV *************************************/
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;"POST"===e&&(s=this.post);const i=new Promise(((e,i)=>{s.call(this,t,((t,s,o)=>{t?i(t):e(s)}))}));return t.timeout?((t,e=1e3)=>Promise.race([t,new Promise(((t,s)=>{setTimeout((()=>{s(new Error("请求超时"))}),e)}))]))(i,t.timeout):i}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.logLevels={debug:0,info:1,warn:2,error:3},this.logLevelPrefixs={debug:"[DEBUG] ",info:"[INFO] ",warn:"[WARN] ",error:"[ERROR] "},this.logLevel="info",this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null,...s){try{return JSON.stringify(t,...s)}catch{return e}}getjson(t,e){let s=e;if(this.getdata(t))try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise((e=>{this.get({url:t},((t,s,i)=>e(i)))}))}runScript(t,e){return new Promise((s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,a]=i.split("@"),n={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"},policy:"DIRECT",timeout:o};this.post(n,((t,e,i)=>s(i)))})).catch((t=>this.logErr(t)))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t||(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce(((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{}),t)[e[e.length-1]]=s),t}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),a=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(a);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.cookie&&void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar)))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",((t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}})).then((t=>{const{statusCode:i,statusCode:o,headers:r,rawBody:a}=t,n=s.decode(a,this.encoding);e(null,{status:i,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:i,response:o}=t;e(i,o,o&&s.decode(o.rawBody,this.encoding))}));break}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let i=require("iconv-lite");this.initGotEnv(t);const{url:o,...r}=t;this.got[s](o,r).then((t=>{const{statusCode:s,statusCode:o,headers:r,rawBody:a}=t,n=i.decode(a,this.encoding);e(null,{status:s,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:s,response:o}=t;e(s,o,o&&i.decode(o.rawBody,this.encoding))}));break}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}queryStr(t){let e="";for(const s in t){let i=t[s];null!=i&&""!==i&&("object"==typeof i&&(i=JSON.stringify(i)),e+=`${s}=${i}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",i="",o={}){const r=t=>{const{$open:e,$copy:s,$media:i,$mediaMime:o}=t;switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{const r={};let a=t.openUrl||t.url||t["open-url"]||e;a&&Object.assign(r,{action:"open-url",url:a});let n=t["update-pasteboard"]||t.updatePasteboard||s;if(n&&Object.assign(r,{action:"clipboard",text:n}),i){let t,e,s;if(i.startsWith("http"))t=i;else if(i.startsWith("data:")){const[t]=i.split(";"),[,o]=i.split(",");e=o,s=t.replace("data:","")}else{e=i,s=(t=>{const e={JVBERi0:"application/pdf",R0lGODdh:"image/gif",R0lGODlh:"image/gif",iVBORw0KGgo:"image/png","/9j/":"image/jpg"};for(var s in e)if(0===t.indexOf(s))return e[s];return null})(i)}Object.assign(r,{"media-url":t,"media-base64":e,"media-base64-mime":o??s})}return Object.assign(r,{"auto-dismiss":t["auto-dismiss"],sound:t.sound}),r}case"Loon":{const s={};let o=t.openUrl||t.url||t["open-url"]||e;o&&Object.assign(s,{openUrl:o});let r=t.mediaUrl||t["media-url"];return i?.startsWith("http")&&(r=i),r&&Object.assign(s,{mediaUrl:r}),console.log(JSON.stringify(s)),s}case"Quantumult X":{const o={};let r=t["open-url"]||t.url||t.openUrl||e;r&&Object.assign(o,{"open-url":r});let a=t["media-url"]||t.mediaUrl;i?.startsWith("http")&&(a=i),a&&Object.assign(o,{"media-url":a});let n=t["update-pasteboard"]||t.updatePasteboard||s;return n&&Object.assign(o,{"update-pasteboard":n}),console.log(JSON.stringify(o)),o}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,i,r(o));break;case"Quantumult X":$notify(e,s,i,r(o));break;case"Node.js":break}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}debug(...t){this.logLevels[this.logLevel]<=this.logLevels.debug&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.debug}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}info(...t){this.logLevels[this.logLevel]<=this.logLevels.info&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.info}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}warn(...t){this.logLevels[this.logLevel]<=this.logLevels.warn&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.warn}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}error(...t){this.logLevels[this.logLevel]<=this.logLevels.error&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.error}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.map((t=>t??String(t))).join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,e,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,e,void 0!==t.message?t.message:t,t.stack);break}}wait(t){return new Promise((e=>setTimeout(e,t)))}done(t={}){const e=((new Date).getTime()-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${e} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
/*****************************************************************************/
