/**
 *  auther@fmz200
 *  作用：因国内很多软件都显示IP地址，且部分需要住宅IP才能生效，比如抖音，使用了代理后显示IP未知，这是因为代理节点是机房的IP
 *  所以写个脚本判断当前节点是不是住宅IP
 *  借鉴：https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/geo_location.js
 *  配置：
 *  [task_local]
 *  event-interaction https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/scripts/server_info.js, tag=节点详情查询, img-url=https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/icon/qure/color/Back.png, enabled=true
 *  使用：配置好以后长按节点执行脚本，如果节点类型是ISP，则是住宅IP
 *
 **/

const url = "https://api.ip.sb/geoip";
const opts = {
  policy: $environment.params
};
const myRequest = {
  url: url,
  opts: opts,
  timeout: 4000
};

$task.fetch(myRequest).then(response => {
  console.log(response.statusCode + "\n\n" + response.body);
  if (response.body) func(JSON.parse(response.body).ip);
}, () => {
  message = "</br></br>🛑 查询超时";
  message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">` + message + `</p>`;
  $done({"title": "🔎 节点详情查询", "htmlMessage": message});
})

function func(ip) {
  const url = `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,asname,reverse,mobile,proxy,hosting,query&lang=zh-CN`;
  console.log("url：" + url);
  const headers = {
    'Accept-Encoding': `gzip, deflate`,
    'Accept': `text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
    'Connection': `keep-alive`,
    'Host': `ip-api.com`,
    'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15`,
    'Upgrade-Insecure-Requests': `1`,
    'Accept-Language': `zh-CN,zh-Hans;q=0.9`
  };
  const myRequest = {
    url: url,
    method: `GET`,
    headers: headers,
    body: ``,
    timeout: 4000
  };
  let message = "";

  $task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    if (response.body) json2info(response.body);
    $done({"title": "    📍 节点详情查询", "htmlMessage": message});
  }, () => {
    message = "</br></br>🛑 查询超时";
    message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">` + message + `</p>`;
    $done({"title": "📍 节点详情查询", "htmlMessage": message});
  })
}

function json2info(data) {
  data = JSON.parse(data);
  message = "------------------------------";
  // 组装每一行内容
  message += "</br><b>IP : </b>" + data.query + "</br>";
  message += "</br><b>ISP : </b>" + data.isp + "</br>";
  message += "</br><b>位置 : </b>" + data.country + " " + data.regionName + "</br>";
  message += "</br><b>经纬度 : </b>" + data.lon + " / " + data.lat + "</br>";
  message += "</br><b>时区 : </b>" + data.timezone + "</br>";
  message += "</br><b>蜂窝网络连接 : </b>" + data.mobile ? "是" : "否" + "</br>";
  message += "</br><b>是否住宅IP : </b>" + data.hosting ? "否" : "是" + "</br>";
  message += "------------------------------" + "</br>"
  message += "<font color=#6959CD><b>节点</b> ➟ " + $environment.params + "</font>";
  message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: lighter">` + message + `</p>`;
  console.log("\n" + message);
}

