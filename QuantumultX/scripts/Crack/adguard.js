let obj = JSON.parse($response.body);
obj={"products":[{"product_id":"com.adguard.lifetimePurchase","premium_status":"ACTIVE"}]};
$done({body: JSON.stringify(obj)});
