const url = $request.url;
if (!$response.body) $done({});
let body = $response.body;
let obj = JSON.parse(body);
if (url.includes("A3341AB04")) {
  if (obj?.data?.ICON_SKIN_INFO) {
    delete obj.data.ICON_SKIN_INFO;
  }
} else if (url.includes("A3341AB03")) {
  if (obj?.data?.TAG_AD_INFO) {
    delete obj.data.TAG_AD_INFO;
  }
  if (obj?.data?.MEBCT_AD_INFO) {
    delete obj.data.MEBCT_AD_INFO;
  }
  // 我的页-财富会员入口
  if (obj?.data?.MYSELF_ENTRANCE_AD) {
    delete obj.data.MYSELF_ENTRANCE_AD;
  }
} else if (url.includes("A3341A120")) {
  if (obj?.data?.POP_AD_INFO) {
    delete obj.data.POP_AD_INFO;
  }
}

body = JSON.stringify(obj);
$done({body});