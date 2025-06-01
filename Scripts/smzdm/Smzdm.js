// 2024-09-08 20:59
// 修改：2025-06-01 14:37:50 
const url = $request.url;

if (!$response.body) {
  $done({});
}

let obj = JSON.parse($response.body);

if (url.includes("/v3/home")) {
  const recursivelyFilterByCellType = (data) => {
    if (Array.isArray(data)) {
      return data.map(item => recursivelyFilterByCellType(item)).filter(Boolean);
    } else if (typeof data === 'object') {
      if (data['cell_type'] === '23008' || data['cell_type'] === '23005' || data['cell_type'] === '23024') {
        return null;
      } else {
        for (const key in data) {
          data[key] = recursivelyFilterByCellType(data[key]);
        }
        return data;
      }
    }
    return data;
  };

  obj.data = recursivelyFilterByCellType(obj.data);
}

const fixPos = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    arr[i].pos = i + 1;
  }
};

if (url.includes("/vip") && obj.data.big_banner) {
  delete obj.data.big_banner;
  delete obj.data.top_banner;
  delete obj.data.yaoqingshaiwu;
}

if (url.includes("/publish/get_bubble") && obj.data) {
  delete obj.data;
}

if (url.includes("/v3/home") && obj.data && obj.data.functions) {
  obj.data.functions = obj.data.functions.filter((item) => item.type === "message");
  fixPos(obj.data.functions);
}

if (obj && obj.data && obj.data.services) {
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

if (url.includes("/util/update") && obj.data) {
  if (obj.data.ad_black_list) {
    delete obj.data.ad_black_list;
  }

  if (obj && obj.data && obj.data.operation_float) {
    delete obj.data.operation_float;
  }

  if (obj.data.haojia_widget) {
    delete obj.data.haojia_widget;
  }
}


if (obj && obj.data && obj.data.widget) {
  delete obj.data.widget;
}

if (obj && obj.data && obj.data.operation_float_screen) {
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

if (url.includes("/publish") && obj.data && obj.data.hongbao) {
  delete obj.data.hongbao;
}

if (url.includes("/loading") && obj && obj.data) {
  delete obj.data;
}

if (url.includes("/ajax_app/ajax_get_footer_list") && obj.data.activity_banner && obj.data.activity_banner.hot_widget) {
  obj.data.activity_banner.hot_widget.forEach(widget => {
    if (widget.pic_url) {
      delete widget.pic_url;
    }
  });
}

if (url.includes("/v1/app/home") && obj.data) {
  if (obj.data) {
    obj.data = obj.data.filter((item) => item.id === "40" || item.id === "20");
    fixPos(obj.data);
  }
}

$done({ body: JSON.stringify(obj) });