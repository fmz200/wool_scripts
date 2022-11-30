/*
Unlocks by Cuttlefish 公众号：墨鱼手记
*/
var body = $response.body.replace(/"is_ios_licensed":false/g, '"is_ios_licensed":true');
$done({ body });
