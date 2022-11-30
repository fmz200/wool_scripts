/*
Unlocks by Cuttlefish 公众号：墨鱼手记
*/
var body = $response.body.replace(/foreverVip":\\d+/g, 'foreverVip":1').replace(/tatus":\\d/g, 'tatus":1')
$done({ body });