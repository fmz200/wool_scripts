/**
 * 汇付天下
 * 2024-08-12 19:00:37
 */
const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("api/miniapp/popular/T_MINIAPP")) {
  delete obj.data;
}

if (url.includes("/api/tactics/ad")) {
  obj.data.splice(0, 3);
}

$done({body: JSON.stringify(obj)});
