/*
脚本功能：Symbolab 解锁高级功能 (需登录)

# Symbolab 解锁订阅
^https?:\/\/scibug\.com\/appleSubscriptionValidate$

*/




let obj = JSON.parse($response.body);

obj= {"valid":true,"hasUserConsumedAppleFreeTrial":false,"isCurrentlyInFreeTrial":false,"newlyAssociated":false,"membership":{"isCurrentlyInFreeTrial":false,"valid":true,"hasUserConsumedAppleFreeTrial":false,"newlyAssociated":false}}

$done({body: JSON.stringify(obj)});
