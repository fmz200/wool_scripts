let new_body = JSON.parse($response.body);
if (new_body.biz) {
  new_body.biz = Object.values(new_body.biz).filter(item => item["type"] !== "promoted");
}
$done({body: JSON.stringify(new_body)});