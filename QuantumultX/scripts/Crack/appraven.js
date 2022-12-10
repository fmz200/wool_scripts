/***********************************
> 應用名稱：appraven
> 軟件版本：1.6.3
> 下載地址：https://apps.apple.com/cn/app/id1490607195
> 腳本作者：Cuttlefish
> 微信賬號：墨魚手記
> 更新時間：2022-03-22
> 腳本功能：⛔自我安慰，只為界面好看，無實際VIP功能⛔
> 通知頻道：https://t.me/ddgksf2021
> 問題反饋：https://t.me/ddgksf2013_bot
> 特别說明：本腳本僅供學習交流使用，禁止轉載售賣
 
[rewrite_local]

# ～ appraven（2022-03-22）@ddgksf2013
^https?:\/\/appraven\.net\/AppRaven\/(app|social|buy) url script-response-body https://ocd0522.tk/ddgksf2013/Cuttlefish/raw/branch/master/Crack/appraven.js

[mitm] 
hostname=appraven.net

***********************************/

var url = $request.url;
var obj = JSON.parse($response.body);
const tmp1 = '/AppRaven/app';
const tmp2 = '/AppRaven/social';
const tmp3 = '/AppRaven/buy';

if (url.indexOf(tmp1) != -1) {
	var body = $response.body.replace(/premium": false/g, 'premium": true');
}
if (url.indexOf(tmp2) != -1) {
	var body = $response.body.replace(/premium": false/g, 'premium": true');
}
if (url.indexOf(tmp3) != -1) {
	obj={"success":true,"message":"1896165181","isReceiptValid":true,"isSubscriptionActive":true};
	body = JSON.stringify(obj);
}
$done({body});
