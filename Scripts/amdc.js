// 使用AMDC的APP有：咸鱼、淘宝、盒马、高德、菜鸟、飞猪
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];

if (
  ua.indexOf("AMap") !== -1 ||
  ua.indexOf("Cainiao") !== -1 ||
  ua.indexOf("Moon") !== -1 ||
  ua.indexOf("%E9%A3%9E%E7%8C%AA%E6%97%85%E8%A1%8C") !== -1
) {
  $done({body: ""});
} else {
  $done({});
}
