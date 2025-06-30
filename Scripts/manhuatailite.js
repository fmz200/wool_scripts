/***********************************

> 應用名稱：漫画台Lite(微信小程序)
> 軟件版本：0.0.0
> 下載地址：微信小程序搜索漫画台Lite
> 更新時間：2022-03-11
> 特別聲明：本腳本僅供學習交流使用，禁止轉載售賣
 
[rewrite_local]
# ～ 漫画台Lite(微信小程序)解鎖會員權限（2022-03-11）
^https?:\/\/comic\.321mh\.com\/app_api\/v\d\/getcomicinfo_body url script-response-body https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/manhuatailite.js

[mitm]
hostname=comic.321mh.com

***********************************/

var body = $response.body.replace(/price":\d+/g,'price":0')
$done({ body });

