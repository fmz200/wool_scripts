/*
Unlocks by Cuttlefish 公众号：墨鱼手记
*/
let url = $request.url;
const path1="v1/auth/device";
const path2="v1/account/details";
let obj = JSON.parse($response.body);
if (url.indexOf(path1) != -1) {
obj["subscription"]={
  "autorenew": true,
  "expiration": "2099-02-15T09:09:14Z",
  "expires": "2099-02-15T09:09:14Z"
 }
}
if (url.indexOf(path2) != -1) {
obj["subscription"]={
  "autorenew": true,
  "expiration": "2099-02-15T09:09:14.000000Z",
  "uuid": "3c5927a6-4e3e-4773-b7af-62506e036dc7",
  "subscription_type": "AppStore",
  "is_expired": false,
  "trial": false
 }
}
$done({body: JSON.stringify(obj)});
