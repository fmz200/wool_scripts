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
const flags = new Map([["AC", "🇦🇨"], ["AE", "🇦🇪"], ["AF", "🇦🇫"], ["AI", "🇦🇮"], ["AL", "🇦🇱"], ["AM", "🇦🇲"], ["AQ", "🇦🇶"], ["AR", "🇦🇷"], ["AS", "🇦🇸"], ["AT", "🇦🇹"], ["AU", "🇦🇺"], ["AW", "🇦🇼"], ["AX", "🇦🇽"], ["AZ", "🇦🇿"], ["BA", "🇧🇦"], ["BB", "🇧🇧"], ["BD", "🇧🇩"], ["BE", "🇧🇪"], ["BF", "🇧🇫"], ["BG", "🇧🇬"], ["BH", "🇧🇭"], ["BI", "🇧🇮"], ["BJ", "🇧🇯"], ["BM", "🇧🇲"], ["BN", "🇧🇳"], ["BO", "🇧🇴"], ["BR", "🇧🇷"], ["BS", "🇧🇸"], ["BT", "🇧🇹"], ["BV", "🇧🇻"], ["BW", "🇧🇼"], ["BY", "🇧🇾"], ["BZ", "🇧🇿"], ["CA", "🇨🇦"], ["CF", "🇨🇫"], ["CH", "🇨🇭"], ["CK", "🇨🇰"], ["CL", "🇨🇱"], ["CM", "🇨🇲"], ["CN", "🇨🇳"], ["CO", "🇨🇴"], ["CP", "🇨🇵"], ["CR", "🇨🇷"], ["CU", "🇨🇺"], ["CV", "🇨🇻"], ["CW", "🇨🇼"], ["CX", "🇨🇽"], ["CY", "🇨🇾"], ["CZ", "🇨🇿"], ["DE", "🇩🇪"], ["DG", "🇩🇬"], ["DJ", "🇩🇯"], ["DK", "🇩🇰"], ["DM", "🇩🇲"], ["DO", "🇩🇴"], ["DZ", "🇩🇿"], ["EA", "🇪🇦"], ["EC", "🇪🇨"], ["EE", "🇪🇪"], ["EG", "🇪🇬"], ["EH", "🇪🇭"], ["ER", "🇪🇷"], ["ES", "🇪🇸"], ["ET", "🇪🇹"], ["EU", "🇪🇺"], ["FI", "🇫🇮"], ["FJ", "🇫🇯"], ["FK", "🇫🇰"], ["FM", "🇫🇲"], ["FO", "🇫🇴"], ["FR", "🇫🇷"], ["GA", "🇬🇦"], ["GB", "🇬🇧"], ["HK", "🇭🇰"], ["HU", "🇭🇺"], ["ID", "🇮🇩"], ["IE", "🇮🇪"], ["IL", "🇮🇱"], ["IM", "🇮🇲"], ["IN", "🇮🇳"], ["IS", "🇮🇸"], ["IT", "🇮🇹"], ["JP", "🇯🇵"], ["KR", "🇰🇷"], ["LU", "🇱🇺"], ["MO", "🇲🇴"], ["MX", "🇲🇽"], ["MY", "🇲🇾"], ["NL", "🇳🇱"], ["PH", "🇵🇭"], ["RO", "🇷🇴"], ["RS", "🇷🇸"], ["RU", "🇷🇺"], ["RW", "🇷🇼"], ["SA", "🇸🇦"], ["SB", "🇸🇧"], ["SC", "🇸🇨"], ["SD", "🇸🇩"], ["SE", "🇸🇪"], ["SG", "🇸🇬"], ["TH", "🇹🇭"], ["TN", "🇹🇳"], ["TO", "🇹🇴"], ["TR", "🇹🇷"], ["TV", "🇹🇻"], ["TW", "🇨🇳"], ["UK", "🇬🇧"], ["UM", "🇺🇲"], ["US", "🇺🇸"], ["UY", "🇺🇾"], ["UZ", "🇺🇿"], ["VA", "🇻🇦"], ["VE", "🇻🇪"], ["VG", "🇻🇬"], ["VI", "🇻🇮"], ["VN", "🇻🇳"], ["ZA", "🇿🇦"]]);
let message = "";

$task.fetch(myRequest).then(response => {
  console.log(response.statusCode + "\n\n" + response.body);
  if (response.body) json2info(response.body);
  $done({"title": "    🔎 节点详情查询", "htmlMessage": message});
}, reason => {
  message = "</br></br>🛑 查询超时";
  message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">` + message + `</p>`;
  $done({"title": "🔎 节点详情查询", "htmlMessage": message});
})


function json2info(data) {
  data = JSON.parse(data);
  message = "------------------------------";
  // 组装每一行内容
  message += "</br><b><font  color=>IP</font> : </b><font  color=>" + data.ip + "</font></br>";
  message += "</br><b><font  color=>ISP</font> : </b><font  color=>" + data.isp + "</font></br>";
  message += "</br><b><font  color=>地区</font> : </b><font  color=>" + " ⟦" + flags.get(data.country_code.toUpperCase()) + "⟧" + "</font></br>";
  message += "</br><b><font  color=>城市</font> : </b><font  color=>" + data.country + "</font></br>";
  message += "------------------------------" + "</br>"
  message += "<font color=#6959CD>" + "<b>节点</b> ➟ " + $environment.params + "</font>";
  message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: lighter">` + message + `</p>`;
  console.log("\n" + message);
}

