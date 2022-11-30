/*
Unlocks by photonmang 公众号：墨鱼手记
*/

let body= $response.body; 
var obj = JSON.parse(body); 
obj.data.business.is_lifelong_vip = true;
obj.data.business.wool = 20210130;
$done({body: JSON.stringify(obj)});
