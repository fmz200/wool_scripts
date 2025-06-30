// 2023-08-19 16:00

/**
 [rewrite_local]
 ^https:\/\/tiku\.fenbi\.com\/activity\/app\/launcher\? url script-response-body https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/fenbi.js

 [mitm]
 hostname = tiku.fenbi.com
 */

//^https:\/\/tiku\.fenbi\.com\/iphone\/(shenlun|xingce|sqgj)\/banners\/v2?.* url script-response-body https://raw.githubusercontent.com/githubacct001/QuantumultX/secret/Rewrite/Fenbi/fbgk.js

const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("/activity/app/launcher")) {
  if (obj?.data?.length > 0) {
    obj.data.forEach((i) => {
      i.startTime = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
      i.endTime = 2209046399; // Unix 时间戳 2040-01-01 23:59:59
    });
  }
}

$done({ body: JSON.stringify(obj) });