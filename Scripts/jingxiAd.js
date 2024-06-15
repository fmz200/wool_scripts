/**
 * 京喜APP
 */
let obj = JSON.parse($response.body);

if (/^https?:\/\/api\.m\.jd\.com\/api\?functionId=delivery_show/.test($request.url)) {
  obj.data.materialList.startTime = 3667476800000;
  obj.data.materialList.endTime = 3667908800000;
}
$done({body: JSON.stringify(obj)});
