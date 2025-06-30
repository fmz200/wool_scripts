/*************************************

 项目名称：旅途随身听-首页北京城市导览图片,首页上方轮播图片净化
 使用声明：⚠️仅供参考，🈲转载与售卖！

 **************************************

 [rewrite_local]
 ^https:\/\/www\.1314zhilv\.com\/ltsstnew\/(common\/getJGQIconNew|city\/getAllBannelByCity) url script-response-body https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/lvtusuishenting/ltsst-ad.js

 [mitm]
 hostname = www.1314zhilv.com

 ************************************/

var body = JSON.parse($response.body);
const url = $request.url;

if (url.includes('/ltsstnew/common/getJGQIconNew')) {
  delete body.content.specialBanner;
} else if (url.includes('/ltsstnew/city/getAllBannelByCity')) {
  body.content = body.content.filter(i => i.bannerType === 1);
}

$done({body: JSON.stringify(body)});
