/***********************************

> 應用名稱：起伏
> 軟件版本：1.10
> 下載地址：https://apps.apple.com/cn/app/id1581387090
> 腳本作者：Cuttlefish
> 微信賬號：墨魚手記
> 更新時間：2022-02-19
> 通知頻道：https://t.me/ddgksf2021
> 問題反饋：https://t.me/ddgksf2013_bot
> 特別說明：本腳本僅供學習交流使用，禁止轉載售賣
 
[rewrite_local]

# ～ 起伏解鎖會員權限（2022-02-19）@ddgksf2013
https?:\/\/api\.risingfalling\.com\/api\/vip\/detail url script-response-body https://ocd0522.tk/ddgksf2013/Cuttlefish/raw/branch/master/Crack/qifu.js

[mitm] 

hostname=api.risingfalling.com

***********************************/



















var cuttlefish ={"warning":"本腳本僅供學習交流使用，禁止轉載售賣","tgchannel":"https://t.me/ddgksf2021","feedback":"https://t.me/ddgksf2013_bot"}
var ddgksf2013 = JSON.parse($response.body);
ddgksf2013.body={"isVip":true,"vipEndTime":4102283483000};
$done({body: JSON.stringify(ddgksf2013)});
