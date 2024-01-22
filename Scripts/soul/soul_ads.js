/**
 * @author fmz200
 * @function 去除Soul的广告&解锁部分服务
 * @date 2024-01-22 21:41:00
 */

const targetUrl01 = 'ssp.soulapp.cn/api/q';
const targetUrl02 = '/teenager/config';

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
  if (url.includes(targetUrl01)) {
    responseData.data.prs = [];
    console.log('去除信息流广告💕');
  }

  // 2、青少年模式弹窗
  // https://api-account.soulapp.cn/teenager/config url script-response-body soul_ads.js
  if (url.includes(targetUrl02)) {
    // responseData.data.isPopTeenWindow = false;
    console.log('去除青少年模式弹窗💕');
  }

  if (url.includes("/post/homepage/guide/card") ||
    url.includes("/furion/position/content") ||
    url.includes("/hot/soul/rank") ||
    url.includes("/post/gift/list") ||
    url.includes("/mobile/app/version/queryIos") ||
    url.includes("/winterfell/v2/getIpByDomain")) {
    delete responseData.data;
    console.log('去除各种广告和限制💕');
  }

  if (url.includes("/chat/limitInfo")) {
    responseData.data.limit = false;
    console.log('去除聊天限制💕');
  }
  return JSON.stringify(responseData);
}
