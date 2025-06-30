/**
 * @author fmz200
 * @function 晓晓优选 测试
 * @date 2024-05-16 08:16:13
 */

let requestUrl = $request.url;
let responseBody = $response.body;

let obj = JSON.parse(responseBody);

// 能量解锁，可以直接兑换好礼
// 官方加了验证，已不可用
// ^https:\/\/xxyx-client-api\.xiaoxiaoyouxuan\.com\/client\/energy\/mall\/getUserEnergy url script-response-body xxyx.js
if (requestUrl.includes("/client/energy/mall/getUserEnergy")) {
  obj.data.energy = 10086;
  console.log('设置energy成功💕');
}

$done({body: JSON.stringify(obj)});
