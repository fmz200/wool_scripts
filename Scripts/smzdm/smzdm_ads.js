/**
 * @author fmz200
 * @function 什么值得买去广告
 * @date 2024-01-17 22:50:13
 */

let requestUrl = $request.url;
let responseBody = $response.body;

let obj = JSON.parse(responseBody);

// https://user-api.smzdm.com/vip/creator_user_center
if (requestUrl.includes("/vip/creator_user_center")) {
  obj.data = {};
  console.log('去除个人中心广告💕');
}

// https://app-api.smzdm.com/util/update
if (requestUrl.includes("/util/update")) {
  obj.data.operation_float = [];
  console.log('去除弹窗图片广告💕');
}

$done({body: JSON.stringify(obj)});
