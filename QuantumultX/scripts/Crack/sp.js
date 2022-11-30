/*
Unlocks by Cuttlefish 公众号：墨鱼手记
*/
let body= $response.body; 
var obj = JSON.parse(body); 
obj={
  "receiptStatus": "ok",
  "isEligibleForIntroPeriod": true,
  "subscriptionState": "notActive",
  "receiptId": 1607615220000,
  "isScanner7User": true,
  "inAppStates": [{
    "type": "custom purchase",
    "productId": "scannerpro7-user",
    "entitlements": []
  }],
  "chargingPlatform": "iOS AppStore",
  "bundleId": "com.readdle.Scanner"
}
$done({body: JSON.stringify(obj)});
