/***********************************

> 应用名称：傲软抠图
> 软件版本：1.6.0
> 下载地址：https://apps.apple.com/cn/app/id1490054676
> 脚本作者：Cuttlefish
> 微信账号：墨鱼手记
> 更新时间：2022-09-13
> 通知频道：https://t.me/ddgksf2021
> 问题反馈：https://t.me/ddgksf2013_bot
> 特别说明：本脚本仅供学习交流使用，禁止转载售卖
 
[rewrite_local]

# ～ 傲软抠图解锁会员权限（2022-09-13）@ddgksf2013
https?:\/\/.*\.aoscdn\.com\/base\/vip\/client\/authorizations$ url script-response-body https://ocd0522.tk/ddgksf2013/Cuttlefish/raw/branch/master/Crack/apowersoft.js

[mitm] 

hostname=*.aoscdn.com

***********************************/



var cuttlefish ={"warning":"本腳本僅供學習交流使用，禁止轉載售賣","tgchannel":"https://t.me/ddgksf2021","feedback":"https://t.me/ddgksf2013_bot"};
var ddgksf2013 = {
  "status" : 200,
  "message" : "success",
  "data" : {
    "expired_at" : 4045798296,
    "is_activated" : 1,
    "is_lifetime" : 1,
    "expire_time" : "2099-01-01 00:00:00",
    "device_id" : 600150864,
    "period_type" : "active",
    "remain_days" : 99999,
    "product_id" : 369,
    "has_present" : 0,
    "allowed_device_count" : 1,
    "has_buy_extend" : 0,
    "will_expire" : 0,
    "license_type" : "premium",
    "begin_activated_time" : 1645798296,
    "durations" : 0,
    "vip_special" : 1
  }
};
$done({body: JSON.stringify(ddgksf2013)});
