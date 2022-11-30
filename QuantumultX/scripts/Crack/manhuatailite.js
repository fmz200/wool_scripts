/***********************************

> 應用名稱：漫画台Lite(微信小程序)
> 軟件版本：0.0.0
> 下載地址：微信小程序搜索漫画台Lite
> 腳本作者：Cuttlefish
> 微信賬號：墨魚手記
> 更新時間：2022-03-11
> 通知頻道：https://t.me/ddgksf2021
> 問題反饋：https://t.me/ddgksf2013_bot
> 特別聲明：本腳本僅供學習交流使用，禁止轉載售賣
 
[rewrite_local]

# ～ 漫画台Lite(微信小程序)解鎖會員權限（2022-03-11）@ddgksf2013
^https?:\/\/comic\.321mh\.com\/app_api\/v\d\/getcomicinfo_body url script-response-body https://github.com/ddgksf2013/Scripts/raw/master/manhuatailite.js

[mitm] 

hostname=comic.321mh.com

***********************************/


var cuttlefish ={"warning":"本腳本僅供學習交流使用，禁止轉載售賣","tgchannel":"https://t.me/ddgksf2021","feedback":"https://t.me/ddgksf2013_bot"}
var body = $response.body.replace(/price":\d+/g,'price":0')
$done({ body });

