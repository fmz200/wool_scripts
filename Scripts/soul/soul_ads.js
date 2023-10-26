/**
 * @author fmz200
 * @function 去除Soul的部分广告
 * @date 2023-10-26 22:50:13
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

$done({ body: responseBody });

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
    responseData.data.isTeenageModeSquare = false;
    responseData.data.isPopTeenWindow = false;
    console.log('去除青少年模式弹窗💕');
  }

  return JSON.stringify(responseData);
}
