/*

🐏 微信阅读（全自动），阅读得积分，100积分换1元
👀 请复制下面的链接在微信中打开👇👇👇
🔗 主选打开地址：https://shrtm.nu/Yn6h
🔗 积分提现地址：https://shrtm.nu/k8Pp
👀 Tg通知频道：https://t.me/ddgksf2021
🚩 建议积分每天兑换，并清空，不要积累
🍄 如需引用请注明出处，谢谢合作！


【QuantumultX】 :
*************************
[rewrite_local]
^https?://mp\.weixin\.qq\.com/s\?.* url script-response-body https://github.com/ddgksf2013/Scripts/raw/main/wechat_auto_read.js
*************************

【Loon】 :
*************************
[Script]
http-response ^https?://mp\.weixin\.qq\.com/s\?.* script-path=https://github.com/ddgksf2013/Scripts/raw/main/wechat_auto_read.js, requires-body=true, timeout=10, tag=微信自动阅读（羊毛） 
*************************

【Surge】 :
*************************
[Script]
微信自动阅读（羊毛） = type=http-response,pattern=^https?://mp\.weixin\.qq\.com/s\?.*,script-path=https://github.com/ddgksf2013/Scripts/raw/main/wechat_auto_read.js, requires-body=true
*************************

【小火箭】 :
*************************
[Script]
微信自动阅读（羊毛） = type=http-response,script-path=https://github.com/ddgksf2013/Scripts/raw/main/wechat_auto_read.js,pattern=^https?://mp\.weixin\.qq\.com/s\?.*,max-size=131072,requires-body=true,timeout=10,enable=true
*************************

[mitm]
hostname = mp.weixin.qq.com

*/

var body = $response.body
    .replace(/<\/script>/, 'setTimeout(()=>window.history.back(),5000); </script>');
$done({ body });
