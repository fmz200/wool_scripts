/*
Unlocks by Cuttlefish 公众号：墨鱼手记
*/
var body = $response.body.replace(/Ad":"\d"/g, 'Ad":"0"').replace(/ad":true/g, 'ad":false').replace(/AdId":"[^"]*"/g, 'AdId":""').replace(/adid":"[^"]*"/g, 'adid":""');
$done({ body });
