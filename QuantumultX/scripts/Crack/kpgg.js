/*
Unlocks by Cuttlefish 公众号：墨鱼手记
*/
var body = $response.body.replace(/listAd":"1/g, 'listAd":"0').replace(/AdId":"[^"]*"/g, 'AdId":""').replace(/adid":"[^"]*"/g, 'adid":""');
$done({ body });
