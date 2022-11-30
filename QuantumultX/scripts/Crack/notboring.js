/***********************************

> 应用名称：Not Boring 四件套（天气、习惯、日历、时间）
> 软件版本：2.13
> 下载地址：https://apps.apple.com/cn/app
> 脚本作者：Cuttlefish
> 微信账号：墨鱼手记
> 解锁说明：解锁高级会员权限
> 更新时间：2022-11-23
> 通知频道：https://t.me/ddgksf2021
> 贡献投稿：https://t.me/ddgksf2013_bot
> 特别提醒：如需引用请注明出处，谢谢合作！
> 特别说明：⛔⛔⛔
           本脚本仅供学习交流使用（低调），禁止转载、售卖
           ⛔⛔⛔
           
[rewrite_local]
  
# ～ Not Boring 四件套[天气、习惯、日历、时间] 解锁会员权限（2022-11-23）@ddgksf2013
^https?:\/\/api-weather\.andy\.works\/v\d\/\w{13,18}$ url reject-dict
^https:\/\/api\.revenuecat\.com\/.+\/(receipts$|subscribers\/*) url script-echo-response https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/scripts/Crack/notboring.js

[mitm] 

hostname=api-weather.andy.works,api.revenuecat.com

***********************************/























var ddgksf2013={request_date_ms:1669210133364,request_date:"2022-11-23T13:28:53Z",subscriber:{non_subscriptions:{},first_seen:"2022-11-01T21:39:13Z",original_application_version:"0",other_purchases:{},management_url:null,subscriptions:{"com.andyworks.weather.yearlyPatron":{original_purchase_date:"2022-06-10T19:13:15Z",expires_date:"2029-06-17T19:13:14Z",is_sandbox:!1,refunded_at:null,unsubscribe_detected_at:"2022-11-01T21:39:13Z",grace_period_expires_date:null,period_type:"trial",purchase_date:"2022-06-10T19:13:14Z",billing_issues_detected_at:null,ownership_type:"PURCHASED",store:"app_store",auto_resume_date:null}},entitlements:{patron:{grace_period_expires_date:null,purchase_date:"2022-06-10T19:13:14Z",product_identifier:"com.andyworks.weather.yearlyPatron",expires_date:"2029-06-17T19:13:14Z"},skinAndy:{grace_period_expires_date:null,purchase_date:"2022-06-10T19:13:14Z",product_identifier:"com.andyworks.weather.yearlyPatron",expires_date:"2029-06-17T19:13:14Z"},skinMonster:{grace_period_expires_date:null,purchase_date:"2022-06-10T19:13:14Z",product_identifier:"com.andyworks.weather.yearlyPatron",expires_date:"2029-06-17T19:13:14Z"},skinCedar:{grace_period_expires_date:null,purchase_date:"2022-06-10T19:13:14Z",product_identifier:"com.andyworks.weather.yearlyPatron",expires_date:"2029-06-17T19:13:14Z"},skinKarat:{grace_period_expires_date:null,purchase_date:"2022-06-10T19:13:14Z",product_identifier:"com.andyworks.weather.yearlyPatron",expires_date:"2029-06-17T19:13:14Z"},skinOpal:{grace_period_expires_date:null,purchase_date:"2022-06-10T19:13:14Z",product_identifier:"com.andyworks.weather.yearlyPatron",expires_date:"2029-06-17T19:13:14Z"},skinPresstube:{grace_period_expires_date:null,purchase_date:"2022-06-10T19:13:14Z",product_identifier:"com.andyworks.weather.yearlyPatron",expires_date:"2029-06-17T19:13:14Z"},skinChroma:{grace_period_expires_date:null,purchase_date:"2022-06-10T19:13:14Z",product_identifier:"com.andyworks.weather.yearlyPatron",expires_date:"2029-06-17T19:13:14Z"}},original_purchase_date:"2021-12-30T15:33:27Z",original_app_user_id:"93370AA7-A0BC-4D38-908F-781316EA49BD",last_seen:"2022-11-23T13:28:53Z"}};$done({body:JSON.stringify(ddgksf2013)});
