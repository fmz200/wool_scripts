/***********************************

> 應用名稱：咿啦看書
> 軟件版本：2.8.5
> 下載地址：https://apps.apple.com/cn/app/id1176775033
> 腳本作者：Cuttlefish
> 微信賬號：墨魚手記
> 更新時間：2022-02-17
> 通知頻道：https://t.me/ddgksf2021
> 問題反饋：https://t.me/ddgksf2013_bot
> 特别說明：本腳本僅供學習交流使用，禁止轉載售賣
 
[rewrite_local]

# ～ 咿啦看書解鎖會員權限（2022-02-17）@ddgksf2013
https?:\/\/bookapi\.ellabook\.cn\/rest\/api\/service$ url script-response-body https://ocd0522.tk/ddgksf2013/Cuttlefish/raw/branch/master/Crack/elabook.js

[mitm] 

hostname=bookapi.ellabook.cn

***********************************/





body = $response.body.replace(/ip":"NO"/g, "ip\":\"YES\"")
                     .replace(/ip":"VIP_NO"/g, "ip\":\"VIP_YES\"")
                     .replace(/code":"\d{10}/g, "code\":\"0x00000000")
                     .replace(/status":"\d/g, "status\":\"1");
$done({body});
