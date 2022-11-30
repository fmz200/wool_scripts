/*
Unlocks by Cuttlefish 公众号：墨鱼手记
*/
var body = $response.body.replace(/"academic":false/g, '"academic":true').replace(/"name":"basic"/g, '"name":"business"').replace(/trial":false/g, 'trial":true');
$done({ body });
