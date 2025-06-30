/***********************************

> 應用名稱：小打卡(微信小程序)
> 軟件版本：0.0.0
> 下載地址：微信小程序搜索小打卡
> 更新時間：2022-03-12
> 特別聲明：本腳本僅供學習交流使用，禁止轉載售賣
 
[rewrite_local]
# ～ 小打卡(微信小程序)解鎖會員權限（2022-03-12）
^https?:\/\/uranus\.sharedaka\.com\/api\/v3\/user\/info\/get url script-response-body https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/xiaodaka.js

[mitm]
hostname=uranus.sharedaka.com

***********************************/

let obj = JSON.parse($response.body);
obj.data.endTime = 1867996357000;
obj.data.hasOpenedMember = true;
$done({body: JSON.stringify(obj)});
