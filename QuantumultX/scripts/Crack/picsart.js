/***********************************
> 應用名稱：Picsart美易
> 軟件版本：18.3.2
> 下載地址：https://apps.apple.com/cn/app/id1586286914
> 腳本作者：Cuttlefish
> 微信賬號：墨魚手記
> 更新時間：2022-02-19
> 通知頻道：https://t.me/ddgksf2021
> 問題反饋：https://t.me/ddgksf2013_bot
> 特別說明：本腳本僅供學習交流使用，禁止轉載售賣
 
[rewrite_local]

# ～ Picsart美易解鎖會員權限（2022-02-19）@ddgksf2013
^https?:\/\/api\.meiease\.cn\/shop\/subscription\/validate url script-response-body https://ocd0522.tk/ddgksf2013/Cuttlefish/raw/branch/master/Crack/picsart.js

[mitm] 

hostname=api.meiease.cn
***********************************/



var ddgksf2013={"warning":"本腳本僅供學習交流使用，禁止轉載售賣","tgchannel":"https://t.me/ddgksf2021","feedback":"https://t.me/ddgksf2013_bot","status":"success","reason":"ok","response":{"purchase_date":1645263154000,"expire_date":6049867954000,"app":"com.picsart.editor","subscription_id":"com.picsart.editor.subscription_yearly","order_id":"300001048350229","original_order_id":"600001048350229","status":"SUBSCRIPTION_PURCHASED","is_trial":true,"winback_screen_id":1,"is_eligible_for_introductory":false,"plan_meta":{},"limitation":{"max_count":1000,"limits_exceeded":false},"is_eligible_for_grant":true}}

$done({body: JSON.stringify(ddgksf2013)});
