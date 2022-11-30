/*
Unlock by Cuttlefish 公众号：墨鱼手记
*/
var body = $response.body.replace(/\"vip\":false/, "\"vip\":true");
$done({ body });