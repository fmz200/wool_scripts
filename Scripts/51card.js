// 去除首页横幅广告，去除我的广告（只保留设置，个人资料）

if (!$response.body) {
  $done({});
}
const url = $request.url;
let obj = JSON.parse($response.body);

if (obj?.operationResourceDTO) {
  obj.operationResourceDTO = [];
}

if (url.includes("api.u51.com/generic-config-gateway/api")) {
  if (obj?.meTabConfigExts) {
    let reserve = ['设置']
    obj.meTabConfigExts = obj.meTabConfigExts.filter(item => reserve.includes(item.meTabConfigs[0].title));
  }
}

body = JSON.stringify(obj);
$done({body});