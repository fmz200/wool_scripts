/*
脚本作者：Maasea
引用地址：https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Enpass/enpass.js

[rewrite_local]
# Enpass Password Manager解锁订阅 //license.enpass.io
^https?:\/\/license\.enpass\.io\/api\/v1\/subscription\/me  url script-response-body https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/Enpass/enpass.js

[mitm]
hostname = license.enpass.io
*/

var obj = JSON.parse($response.body);

obj.license = "premium";
obj.info = {
  purchase_type: "inapp",
  store: "ios",
  id: "ENP_IAP_LTP",
  userid: "000000",
  transaction_id: "1000000000000000",
  logo: ""
};

$done({ body: JSON.stringify(obj) });