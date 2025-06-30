try {
  let obj = JSON.parse($response.body);

  // 去除首页横幅广告
  if (obj.body?.app_home_banner?.data) {
    obj.body.app_home_banner.data = [];
  }

  // 去除理财页横幅广告
  if (obj.body?.tagbanner2024?.data) {
    obj.body.tagbanner2024.data = [];
  }

  $done({ body: JSON.stringify(obj) });
} catch (e) {
  console.log("招商证券广告去除脚本异常：" + e);
  $done({});
}