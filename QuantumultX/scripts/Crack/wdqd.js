/*
Unlocks by Cuttlefish 公众号：墨鱼手记
*/
var body = $response.body.replace(/forever":false/g, 'forever":true').replace(/state":2/g, 'state":1')
$done({ body });