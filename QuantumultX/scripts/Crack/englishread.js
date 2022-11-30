/*
Unlocks by demo2099
*/
var body = $response.body;
let url=$request.url;
if(url.endsWith("QueryVipUser")){
body={
  "isVip": true,
  "code": 200,
  "expireDays": 5201314
};
}
body=JSON.stringify(body);$done({body});
