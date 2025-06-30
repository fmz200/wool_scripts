/**
 * @function 酷安广告
 * @date 2023-11-15 17:20:00
 * @quote RuCu6
 */

const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("/feed/detail")) {
  if (obj.data?.hotReplyRows?.length > 0) {
    obj.data.hotReplyRows = obj.data.hotReplyRows.filter((item) => item?.id);
  }
  if (obj.data?.topReplyRows?.length > 0) {
    obj.data.topReplyRows = obj.data.topReplyRows.filter((item) => item?.id);
  }
  const item = ["detailSponsorCard", "include_goods", "include_goods_ids"];
  for (let i of item) {
    if (obj.data?.[i]) {
      obj.data[i] = [];
    }
  }
} else if (url.includes("/feed/replyList")) {
  if (obj.data?.length > 0) {
    obj.data = obj.data.filter((item) => item?.id);
  }
} else if (url.includes("/main/dataList")) {
  if (obj.data?.length > 0) {
    obj.data = obj.data.filter((item) => !(item?.entityTemplate === "sponsorCard" || item?.title === "精选配件"));
  }
} else if (url.includes("/main/indexV8")) {
  if (obj.data?.length > 0) {
    obj.data = obj.data.filter(
      (item) =>
        !(
          item?.entityTemplate === "sponsorCard" ||
          item?.entityId === 8639 ||
          item?.entityId === 29349 ||
          item?.entityId === 33006 ||
          item?.entityId === 32557 ||
          item?.title?.includes("值得买") ||
          item?.title?.includes("红包")
        )
    );
  }
} else if (url.includes("/main/init")) {
  // 整体配置
  if (obj.data?.length > 0) {
    let newDatas = [];
    for (let item of obj.data) {
      // 944热门搜索 945开屏广告 6390首页Tab
      if ([944, 945, 6390]?.includes(item?.entityId)) {
        continue;
      } else {
        if (item?.entityId === 20131) {
          // 发现页 顶部项目
          if (item?.entities?.length > 0) {
            let newEnts = [];
            for (let i of item.entities) {
              if (i?.title === "酷品") {
                continue;
              } else {
                newEnts.push(i);
              }
            }
            item.entities = newEnts;
          }
        }
        newDatas.push(item);
      }
    }
    obj.data = newDatas;
  }
} else if (url.includes("/page/dataList")) {
  if (obj.data?.length > 0) {
    obj.data = obj.data.filter(
      (item) =>
        !(item?.title === "酷安热搜" || item?.entityTemplate === "imageScaleCard" || item?.entityTemplate === "sponsorCard")
    );
  }
}

$done({ body: JSON.stringify(obj) });
