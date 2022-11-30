/*
Unlocks by Cuttlefish 公众号：墨鱼手记
*/


var origin= $response.body.match(/"originalUrl":"[^"]*"/g);

var body= $response.body.match(/"download1080Url":"[^"]*"/g);

console.log(body);

$notify("墨鱼手记","", '\n'+origin[0]+'\n\n'+body[0]+'\n\n');


$done({ body });
