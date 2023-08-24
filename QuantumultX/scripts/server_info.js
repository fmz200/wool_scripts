/**
 *  auther@fmz200
 *  作用：因国内很多软件都显示IP地址，且部分需要住宅IP才能生效(比如抖音)，使用了代理后显示IP未知是因为代理节点是机房的IP，所以写个脚本判断当前节点是不是住宅IP
 *
 *  配置：
 *  [task_local]
 *  event-interaction https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/scripts/server_info.js, tag=节点详情查询, img-url=https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/icon/qure/color/Back.png, enabled=true
 *  使用：配置好以后长按节点执行脚本，如果节点类型的ISP进行大致的判断
 *  因为显示详细ISP的网站需要付费（ipinfo.io），所以只能找个替代的网站（www.cz88.net)
 *
 * http://ip-api.com/json?lang=zh-CN 返回结果：
 *  {
 * "status": "success",
 * "country": "新加坡",
 * "countryCode": "SG",
 * "region": "01",
 * "regionName": "Central Singapore",
 * "city": "新加坡",
 * "zip": "048582",
 * "lat": 1.28009,
 * "lon": 103.851,
 * "timezone": "Asia/Singapore",
 * "isp": "Amazon Technologies Inc.",
 * "org": "AWS EC2 (ap-southeast-1)",
 * "as": "AS16509 Amazon.com, Inc.",
 * "query": "13.251.43.8"
 * }
 **/

let message = "";
get_ip_api();

// 1、先获取当前节点的IP，如果能从$environment中取到，可以省略这一步
function get_ip_api() {
  const url = `http://ip-api.com/json?lang=zh-CN`;
  const opts = {
    policy: $environment.params
  };
  const myRequest = {
    url: url,
    opts: opts,
    timeout: 8000
  };

  $task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "--ip-api--\n" + response.body);
    if (response.body) fetchIPInfo(response.body);
  }, () => {
    message = "</br></br>🛑 查询超时";
    message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">` + message + `</p>`;
    $done({"title": "    📍 节点详情查询", "htmlMessage": message});
  })
}

// 2、获取到IP后再去查询IP的详细信息
function fetchIPInfo(data) {
  const url = `https://www.cz88.net/api/cz88/ip/base?ip=${JSON.parse(data).query}`;
  console.log("url=" + url);
  const myRequest = {
    url: url,
    timeout: 8000
  };

  $task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "--cz88--\n" + response.body);
    if (response.body) json2info(response.body, data);
    $done({"title": "    📍 节点详情查询", "htmlMessage": message});
  }, reason => {
    console.log(reason.error);
    $done();
  });
}

// 3、解析数据
function json2info(data1, data) {
  console.log("开始解析数据、、、\n");
  data1 = JSON.parse(data1).data;
  data = JSON.parse(data);
  console.log("结束解析数据，开始组装内容、、、\n");

  message = "------------------------------";
  // 组装每一行内容
  message += "</br><b>IP：</b>" + data1.ip + "</br>";
  message += "</br><b>运营商(isp)：</b>" + data1.isp + "</br>";
  message += "</br><b>网络类型：</b>" + data1.netWorkType + "</br>";
  message += "</br><b>真人概率：</b>" + data1.score + "</br>";
  message += "</br><b>位置 : </b>" + data1.countryCode + "-" + data1.country + "-" + data1.province + "-" + data1.city + "-" + data1.districts + "</br>";
  message += "</br><b>ZIP：</b>" + data.zip + "</br>";
  message += "</br><b>经纬度 : </b>" + data.lon + " / " + data.lat + "</br>";
  message += "</br><b>时区 : </b>" + data.timezone + "</br>";
  message += "------------------------------" + "</br>"
  message += "<font color=#6959CD><b>节点</b> ➟ " + $environment.params + "</font>";
  message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: lighter">` + message + `</p>`;
  console.log("\n" + message);
}

