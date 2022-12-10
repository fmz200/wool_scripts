/***********************************

> 應用名稱：B站大会员
> 軟件版本：6.63.0
> 腳本作者：Cuttlefish
> 微信賬號：墨魚手記
> 更新時間：2022-03-28
> 通知頻道：https://t.me/ddgksf2021
> 問題反饋：https://t.me/ddgksf2013_bot
> 特别說明：本腳本僅供學習交流使用，禁止轉載售賣
 
[rewrite_local]

# ～ B站大会员（2022-03-17）@ddgksf2013
^http[s]?:\/\/((app|api)\.(\w{2,15})?\.(com|cn|net|org)).*(playurl|player|reply)?\.(v3|v2|v1)\.(View|Reply|Play(URL|View|Conf)).*$ url script-response-body https://ocd0522.tk/ddgksf2013/Cuttlefish/raw/branch/master/Crack/blvip.js

[mitm] 

hostname=app.bilibili.com, grpc.biliapi.net,*.biliapi.net,app.bilibili.com,api.bilibili.com,api.live.bilibili.com,api.vc.bilibili.com,dataflow.biliapi.com,124.239.240.*,101.89.57.66, 218.94.210.66,240e:b1:9801:206:11:0:0:*

***********************************/