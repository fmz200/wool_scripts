/*
Unlocks by Cuttlefish 公众号：墨鱼手记
*/
let body= $response.body; 
var obj = JSON.parse(body); 
obj={"data":{"userId":"1fdbhfn","name":null,"gender":0,"avatar":null,"birthday":null,"mobile":null,"vipState":{"state":1,"forever":false,"startTime":1600334263000,"expireTime":1884343967000}},"code":1}
$done({body: JSON.stringify(obj)});
