/**
 * @author 树先生
 * @function 朴朴超市
 * @date 2025-05-19
 */

let url = $request.url;
let body = $response.body;
let obj = JSON.parse(body);

const search_hot = "/search/hot_keywords";
const recommend = "/resource_preload/list_h5_resource";
const adv = "/advertisement/v1";


if (url.indexOf(search_hot) != -1) {
  obj.data = [];
  body = JSON.stringify(obj);
  $done({body});
}

if (url.indexOf(recommend) != -1) {
  obj.data = obj.data.filter(item => item.filename !== "RecommendProduct.29e31893.js");
  body = JSON.stringify(obj);
  $done({body});
}

if (url.indexOf(adv) != -1) {
  obj.data = obj.data.filter(item => ![30,50,90,320,100,770].includes(item.region_code));
  obj.data = obj.data.map(item => {
    if (item.region_code === 2) {
      // 过滤掉positions数组中component_code, 首页的顶部轮播图广告、主页横幅广告
      item.positions = item.positions.filter(position => ![890, 60, 2, 240, 2503].includes(position.component_code));
    }
    // 返回最终的元素
    return item;
  });

  body = JSON.stringify(obj);
  $done({body});
}

//const typeArr = [50, 2, 90, 770, 80, 320];
//obj.data = obj.data.filter(item => !typeArr.includes(item.position_type));

if (url.indexOf("/search_box/products") != -1) {
  obj.data.feed_banner_cards = [];
  body = JSON.stringify(obj);
  $done({body});
}

if (url.indexOf("/order_settlement/detail") != -1) {
  obj.data.member_card_v2 = {};
  body = JSON.stringify(obj);
  $done({body});
}

if (url.indexOf("/orders/list") != -1) {
  if (obj && obj.data) {
    obj.data.forEach(item => {
      if (item) {
        delete item.just_in_time_comment; // 直接清空字段（不检查是否存在）
      }
    });
  }
  body = JSON.stringify(obj);
  $done({body});
}

body = JSON.stringify(obj);
$done({body});