/*
*Update Date: 20201123
*Collected by Cuttlefish
*美颜相机解锁内购
*Author: 黑黑酱
*Url[https://api.meiyan.com/iap/verify.json]
*/

var obj = JSON.parse($response.body);
obj = {
   "meta": {
     "app_validate_result": 0,
     "bundleName": "pay",
     "code": 0,
     "msg": "success",
     "enabled": true,
     "paid": true,
     "user": null,
     "id": 56990,
     "subscription": 0,
     "request_uri": "/iap/verify",
     "error": ""
   },
   "response": {
     "status": 1
   }
 }
$done({body: JSON.stringify(obj)});
