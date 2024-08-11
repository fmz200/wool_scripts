/**
 * 闲鱼 去广告+净化
 * 2024-08-11 13:00:37
 */
const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("/gw/mtop.taobao.idlehome.home.nextfresh")) {
  // 可能存在的首页标签
  delete obj.data.widgetReturnDO;
  // 信息流广告
  if (obj.data?.sections) {
    obj.data.sections = obj.data.sections.filter(section => {
      return !(section.data && (section.data.bizType === "AD" || section.data.bizType === "homepage"));
    });
  }
}

if (url.includes("/gw/mtop.taobao.idle.local.home")) {
  if (obj.data?.sections) {
    obj.data.sections = obj.data.sections.filter(section => {
      return !(section.data && section.data.bizType === "AD");
    });
  }
}

if (url.includes("/gw/mtop.taobao.idle.home.whale.modulet")) {
  delete obj.data.container.sections;
}

if (url.includes("/gw/mtop.taobao.idlemtopsearch.search.shade") || url.includes("/gw/mtop.taobao.idle.user.strategy.list")) {
  delete obj.data;
}

$done({body: JSON.stringify(obj)});
