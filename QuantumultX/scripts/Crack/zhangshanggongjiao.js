/***********************************
> 應用名稱：掌上公交（微信小程序）
> 軟件版本：0.0.0
> 下載地址：微信小程序搜索掌上公交
> 腳本作者：Cuttlefish
> 微信賬號：墨魚手記
> 更新時間：2022-03-01
> 通知頻道：https://t.me/ddgksf2021
> 問題反饋：https://t.me/ddgksf2013_bot
> 特别說明：本腳本僅供學習交流使用，禁止轉載售賣
 
[rewrite_local]

# ～ 掌上公交微信小程序去除广告（2022-03-01）@ddgksf2013
https?:\/\/wx\.mygolbs\.com\/WxBusServer\/ApiData\.do url script-response-body https://ocd0522.tk/ddgksf2013/Cuttlefish/raw/branch/master/Crack/zhangshanggongjiao.js

[mitm]

hostname=wx.mygolbs.com

***********************************/


var cuttlefish ={"warning":"本腳本僅供學習交流使用，禁止轉載售賣","tgchannel":"https://t.me/ddgksf2021","feedback":"https://t.me/ddgksf2013_bot"};
var body = $response.body.replace(/Ad":1/g, 'Ad":0').replace(/Ad_ab":1/g, 'Ad_ab":1')
$done({ body });
