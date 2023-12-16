const url = $request.url;
if (!$response.body) $done({});

let obj = JSON.parse($response.body);

const { bottom_nav_list } = obj.data?.disorder_cards || {};
if (url.includes("/homepage/v1/core") && bottom_nav_list) {
  obj.data.disorder_cards.bottom_nav_list.data = (bottom_nav_list.data || []).filter(item => ["v6x_home", "user_center"].includes(item.id));
  fixPos(obj.data.disorder_cards.bottom_nav_list.data);
}

if (url.includes("/homepage/v1/core")) {
  delete obj.data?.common_params;
  delete obj.data?.omega_params;
  delete obj.data?.order_cards;
}

if (url.includes("/usercenter/me")) {
  const cards = obj.data?.cards || [];
  obj.data.cards = cards.filter((item) => ["priority", "general", "security", "wallet"].includes(item.tag));
  fixPos(obj.data.cards);
}

if (obj?.data?.cards) {
  obj.data.cards.forEach(card => {
    if (card.tag === "wallet") {
      if (card.items) {
        const filteredItems = card.items.filter(item => item.title === "优惠券" || item.title === "出行卡");
        card.items = filteredItems;
      }
      if (card.card_type === 4 && card.bottom_items) {
        const filteredBottomItems = card.bottom_items.filter(item =>
          item.title === "省钱套餐" || item.title === "天天神券"
        );
        card.bottom_items = filteredBottomItems;
      }
    }
  });
}

if (url.includes("/resapi/activity/mget") || url.includes("/dynamic/conf") || url.includes("/homepage/v1/other/fast") || url.includes("/agent/v3/feeds") || url.includes("/resapi/activity/xpget") || url.includes("/gateway")) {
  delete obj.data;
}

$done({ body: JSON.stringify(obj) });

function fixPos(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].pos = i + 1;
  }
}
