/**
 * @author fmz200
 * @function 去除Soul的广告&解锁部分服务
 * @date 2024-01-24 21:41:00
 */

let requestUrl = $request.url;
let responseBody = $response.body;

try {
  responseBody = removeAds(requestUrl, responseBody);
} catch (error) {
  console.log('脚本运行出现错误，部分广告未去除⚠️');
  console.log('错误信息：' + error.message);
}

$done({body: responseBody});

function removeAds(url, data) {
  let responseData = JSON.parse(data);

  // 1、信息流广告
  // https://ssp.soulapp.cn/api/q url script-response-body soul_ads.js
  if (url.includes("/api/q")) {
    responseData.data.prs = [];
    console.log('去除信息流广告💕');
  }

  // 2、青少年模式弹窗
  // https://api-account.soulapp.cn/teenager/config url script-response-body soul_ads.js
  if (url.includes("/teenager/config")) {
    // responseData.data.isPopTeenWindow = false;
    console.log('去除青少年模式弹窗💕');
  }

  if (url.includes("/post/homepage/guide/card") || url.includes("/furion/position/content") || url.includes("/hot/soul/rank") ||
    url.includes("/post/gift/list") || url.includes("/mobile/app/version/queryIos") || url.includes("/winterfell/v2/getIpByDomain") ||
    url.includes("/official/scene/module")) {
    delete responseData.data;
    console.log('去除各种广告和限制💕');
  }

  if (url.includes("/chat/limitInfo")) {
    responseData.data.limit = false;
    console.log('去除聊天限制💕');
  }

  if (url.includes("/vip/meet/userInfo")) {
    if (responseData.data.superStarDTO && responseData.data.superStarDTO.superVIP !== undefined) {
      responseData.data.superStarDTO.superVIP = true;
      responseData.data.superStarDTO.validTime = 9887893999000;
      responseData.data.flyPackageDTO.hasFlyPackage = true;
    }
  }

  if (url.includes("/privilege/supervip/status")) {
    if (responseData.data.superVIP !== undefined) {
      responseData.data.superVIP = true;
      responseData.data.remainDay = 9887893999000;
      responseData.data.hasCancelVIPSubscription = false;
      responseData.data.hasCancelVIPSubOfIAP = false;
      responseData.data.hasFlyPackage = true;
    }
  }

  // https://api-pay.soulapp.cn/mall/avatar/product/new/recommend url script-response-body soul_ads.js
  if (url.includes("/mall/avatar/product/new/recommend")) {
    const avatarList = responseData.data.data;
    for (let i = 0; i < avatarList.length; i++) {
      avatarList[i].price = 1;
    }
    console.log('设置头像金币价格💕');
  }

  // https://api-pay.soulapp.cn/personalizeMall/purchase url script-response-body soul_ads.js
  if (url.includes("/personalizeMall/purchase")) {
    responseData.data = {
      "putAvatarResultDesc": "successfully",
      "purchasePrivilegeDetailResponse": true,
      "purchaseSuccess": true,
      "mallPurchaseResultResponse": "mall purchase success",
      "putAvatarResultCode": 10001,
      "purchaseResultCode": 10001,
      "purchaseResultDesc": "购买成功了哦~",
      "putAvatarSuccess": true
    };
    console.log('设置头像购买结果💕');
  }

  return JSON.stringify(responseData);
}
