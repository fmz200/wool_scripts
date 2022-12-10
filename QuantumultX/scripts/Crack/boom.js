/***********************************

> 应用名称：Boom
> 软件版本：2.6.4
> 下载地址：https://apps.apple.com/us/app/id1065511007
> 脚本作者：Cuttlefish
> 微信账号：墨鱼手记
> 解锁说明：解锁高级会员权限
> 更新时间：2022-07-24
> 通知频道：https://t.me/ddgksf2021
> 问题反馈：https://t.me/ddgksf2013_bot
> 特别说明：⛔⛔⛔
           本脚本仅供学习交流使用，禁止转载售卖
           ⛔⛔⛔
[rewrite_local]
  
# ～ boom解锁会员权限（2022-07-24）@ddgksf2013
^https:\/\/apimboom2\.globaldelight\.net\/itunesreceipt_v2\.php$ url script-response-body https://ocd0522.tk/ddgksf2013/Cuttlefish/raw/branch/master/Crack/boom.js

[mitm] 
hostname=apimboom2.globaldelight.net

***********************************/




let obj = JSON.parse($response.body);obj ={"status":"0","receipt-data":{"status":0,"environment":"Production","receipt":{"receipt_type":"Production","app_item_id":1065511007,"receipt_creation_date":"2019-10-30 16:52:23 Etc\\\\/GMT","bundle_id":"com.globaldelight.iBoom","original_purchase_date":"2019-04-17 04:07:39 Etc\\\\/GMT","in_app":[{"quantity":"1","purchase_date_ms":"1555474256000","expires_date":"2099-04-17 04:10:56 Etc\\\\/GMT","expires_date_pst":"2099-04-16 21:10:56 America\\\\/Los_Angeles","is_in_intro_offer_period":"false","transaction_id":"470000445785125","is_trial_period":"false","original_transaction_id":"470000445785125","purchase_date":"2019-04-17 04:10:56 Etc\\\\/GMT","product_id":"com.globaldelight.iBoom.LifetimeDiscountPack","original_purchase_date_pst":"2019-04-16 21:10:59 America\\\\/Los_Angeles","original_purchase_date_ms":"1555474259000","web_order_line_item_id":"470000137081235","expires_date_ms":"1587096656000","purchase_date_pst":"2019-04-16 21:10:56 America\\\\/Los_Angeles","original_purchase_date":"2019-04-17 04:10:59 Etc\\\\/GMT"}],"adam_id":1065511007,"receipt_creation_date_pst":"2019-10-30 09:52:23 America\\\\/Los_Angeles","request_date":"2019-10-30 16:52:29 Etc\\\\/GMT","request_date_pst":"2019-10-30 09:52:29 America\\\\/Los_Angeles","version_external_identifier":832251566,"request_date_ms":"1572454349573","original_purchase_date_pst":"2019-04-16 21:07:39 America\\\\/Los_Angeles","application_version":"1.4.70002","original_purchase_date_ms":"1555474059000","receipt_creation_date_ms":"1572454343000","original_application_version":"1.4.10008","download_id":87042883772350},"latest_receipt_info":[{"quantity":"1","purchase_date_ms":"1555474256000","expires_date":"2099-04-17 04:10:56 Etc\\\\/GMT","expires_date_pst":"2099-04-16 21:10:56 America\\\\/Los_Angeles","is_in_intro_offer_period":"false","transaction_id":"470000445785125","is_trial_period":"false","original_transaction_id":"470000445785125","purchase_date":"2019-04-17 04:10:56 Etc\\\\/GMT","product_id":"com.globaldelight.iBoom.LifetimeDiscountPack","original_purchase_date_pst":"2019-04-16 21:10:59 America\\\\/Los_Angeles","subscription_group_identifier":"20461753","original_purchase_date_ms":"1555474259000","web_order_line_item_id":"470000137081235","expires_date_ms":"4080082256000","purchase_date_pst":"2019-04-16 21:10:56 America\\\\/Los_Angeles","original_purchase_date":"2019-04-17 04:10:59 Etc\\\\/GMT"}],"pending_renewal_info":[{"product_id":"com.globaldelight.iBoom.LifetimeDiscountPack","original_transaction_id":"470000445785125","auto_renew_product_id":"com.globaldelight.iBoom.LifetimeDiscountPack","auto_renew_status":"0"}]}};$done({body: JSON.stringify(obj)});
