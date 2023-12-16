const url = $request.url;

if (!$response.body) {
  $done({});
}

let obj = JSON.parse($response.body);

if (url.includes("/vip") && obj.data.big_banner) {
  delete obj.data.big_banner;
}

if (obj.data.functions) {
  obj.data.functions = obj.data.functions.filter((item) => item.type === "message");
  fixPos(obj.data.functions);
}

if (obj.data.services) {
  obj.data.services = obj.data.services.filter((item) => item.type === "articel_manage" || item.type === "199794" || item.type === "199796");
  fixPos(obj.data.services);
}

if (url.includes("/vip/bottom_card_list") && obj.data.rows) {
  delete obj.data.rows;
}

if (url.includes("/v3/home")) {
  obj.data.component = obj.data.component.filter((item) =>
    item.zz_type === "circular_banner" || item.zz_type === "fixed_banner" || item.zz_type === "filter" || item.zz_type === "list"
  );
  fixPos(obj.data.component);
}

if (url.includes("/util/update") && obj.data.ad_black_list) {
  delete obj.data.ad_black_list;
}

if (obj.data.widget) {
  delete obj.data.widget;
}

if (obj.data.operation_float_screen) {
  delete obj.data.operation_float_screen;
}

if (url.includes("/home/list") && obj.data.banner_v2) {
  delete obj.data.banner_v2;
}

if (obj?.data?.rows?.length > 0) {
  obj.data.rows = obj.data.rows.filter(
    (i) => !(i?.hasOwnProperty("ad_banner_id") || ["ad_campaign_id_", "ad_campaign_name", "abs_position"]?.includes(i?.ad))
  );
}

if (url.includes("/publish") && obj.data.hongbao) {
  delete obj.data.hongbao;
}

if (url.includes("/loading") && obj.data) {
  delete obj.data;
}

if (url.includes("/util/update") &&
  obj.data.operation_float_7_0) {
  delete obj.data.operation_float_7_0;
}

$done({body: JSON.stringify(obj)});

function fixPos(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].pos = i + 1;
  }
}
