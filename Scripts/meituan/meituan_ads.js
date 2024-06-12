/**
 * @author fmz200
 * @function 美团去广告和多余模块 测试
 * @date 2024-02-22 20:20:13
 */

let requestUrl = $request.url;
let responseBody = $response.body;

let obj = JSON.parse(responseBody);

// https://ordercenter.meituan.com/ordercenter/user/showOrderDetail url script-response-body https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/meituan/meituan_ads.js
if (requestUrl.includes("/ordercenter/user/showOrderDetail")) {
  obj.data.partnerData.poiStatus = 0;
  console.log('设置poiStatus为0💕');
}

$done({body: JSON.stringify(obj)});
