
var date= $response.body.match(/"date":"[^"]*"/g);

var body= $response.body.match(/"download":"[^"]*"/g);

console.log(body);

$notify("扎比科技","", '\n'+date[0]+'\n'+body[0]+'\n\n'+date[1]+'\n'+body[1]+'\n\n'+date[2]+'\n'+body[2]);

$done({ body });

