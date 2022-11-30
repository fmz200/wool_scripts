/*
kwts vip
/v2/api/user/isBuyVip?
/v2/api/user/info?
*/


const path1 = "/user/info";

var obj = JSON.parse($response.body);

if ($request.url.indexOf(path1) != -1){
	obj.data.vipType = 1,
	obj.data.vipExpires = 4811209694000,
	obj.data.autoRenewal = true
}else {
	obj.data.isbuyVip = 1
}

$done({body: JSON.stringify(obj)});