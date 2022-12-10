/***********************************

> 應用名稱：一甜相機
> 軟件版本：2.8.3
> 下載地址：https://apps.apple.com/cn/app/id1415653267
> 腳本作者：Cuttlefish
> 微信賬號：墨魚手記
> 更新時間：2022-02-27
> 通知頻道：https://t.me/ddgksf2021
> 問題反饋：https://t.me/ddgksf2013_bot
> 特別說明：本腳本僅供學習交流使用，禁止轉載售賣
 
[rewrite_local]

# ～ 一甜相機解鎖會員權限（2022-02-27）@ddgksf2013
https?:\/\/m2u-api\.getkwai\.com\/api-server\/api\/v\d\/vip\/vipUserInfo url script-response-body https://ocd0522.tk/ddgksf2013/Cuttlefish/raw/branch/master/Crack/yitianxiangji.js

[mitm] 

hostname=m2u-api.getkwai.com

***********************************/



var cuttlefish ={"warning":"本腳本僅供學習交流使用，禁止轉載售賣","tgchannel":"https://t.me/ddgksf2021","feedback":"https://t.me/ddgksf2013_bot"};
var ddgksf2013 = JSON.parse($response.body);
ddgksf2013.data.vipUserProductInfo = {"expireTime":4075858966000,"subscribeType":1,"trailStatus":0,"isInExpireRenewDuration":0,"reBuyPromotionText":"","myProducts":[],"vip":true};
$done({body: JSON.stringify(ddgksf2013)});




