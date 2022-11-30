/***********************************

> 應用名稱：小打卡(微信小程序)
> 軟件版本：0.0.0
> 下載地址：微信小程序搜索小打卡
> 腳本作者：群友投稿
> 微信賬號：墨魚手記
> 更新時間：2022-03-12
> 通知頻道：https://t.me/ddgksf2021
> 問題反饋：https://t.me/ddgksf2013_bot
> 特別聲明：本腳本僅供學習交流使用，禁止轉載售賣
 
[rewrite_local]

# ～ 小打卡(微信小程序)解鎖會員權限（2022-03-12）@ddgksf2013
^https?:\/\/uranus\.sharedaka\.com\/api\/v3\/user\/info\/get url script-response-body https://github.com/ddgksf2013/Scripts/raw/master/xiaodaka.js

[mitm] 

hostname=uranus.sharedaka.com

***********************************/





var cuttlefish ={"warning":"本腳本僅供學習交流使用，禁止轉載售賣","tgchannel":"https://t.me/ddgksf2021","feedback":"https://t.me/ddgksf2013_bot"}
let obj = JSON.parse($response.body);
obj.data.endTime = 1867996357000;
obj.data.hasOpenedMember = true;
$done({body: JSON.stringify(obj)});
