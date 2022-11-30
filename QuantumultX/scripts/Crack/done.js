/*
Unlocks by Cuttlefish 公众号：墨鱼手记
*/
var body = $response.body.replace(/"uvip":"0"/g, '"uvip":"1"').replace(/totime":"\d{4}/g, 'totime":"2029').replace(/nickname":"\\u666e\\u901a\\u7528\\u6237"/g, 'nickname":"\u58a8\u9c7c\u624b\u8bb0"').replace(/uhead":"[^"]+"/g,'uhead":"http:\/\/dbapi.ganbuguo.com\/\/uploads\/file\/20200914\/3f8c5019e2bc056a7b226623205126f3.jpg"')
$done({ body });
