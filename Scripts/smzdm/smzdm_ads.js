/**
 * @author fmz200
 * @function 什么值得买去广告
 * @date 2025-06-01 14:37:50
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

if (requestUrl.includes("/ranking_list/articles?")) {
  obj.data.rows = obj.data.rows.filter(item => item.model_type !== "ads");
  console.log('去除排行榜广告💕');
}

if (requestUrl.includes("/sou/filter/tags/hot_tags?")) {
  obj.data.search_hot.home = obj.data.search_hot.home.filter(item => item.pos);
  delete obj.data.tonglan;
  console.log('去除搜索热榜广告💕');
}

$done({body: JSON.stringify(obj)});
