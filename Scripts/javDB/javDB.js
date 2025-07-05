// ^https:\/\/api\.hechuangxinxi\.xyz\/api\/v4\/plans url reject-dict
// javDB.js
// hostname = api.hechuangxinxi.xyz

let requestUrl = $request.url;
let responseBody = $response.body;

let responseData = JSON.parse(responseBody);

if (requestUrl.includes("/api/v4/plans")) {
  if (responseData.data.plans) {
    responseData.data.plans.forEach(plan => {
      plan.price = 0.01;
    });
  }
  console.log('修改价格成功💕');

  // responseData.data.platforms[0].channels
  if (responseData.data.platforms.length > 0 && responseData.data.platforms[0].channels) {
    responseData.data.platforms[0].channels.forEach(channel => {
      if (channel.methods && channel.methods.length > 0) {
        channel.methods.forEach(subMethods => {
          subMethods.limited_prices = "1";
        });
      }
    });
  }
  console.log('修改支付成功💕');
}

console.log('返回JSON💕' + JSON.stringify(responseData));
$done({body: JSON.stringify(responseData)});
