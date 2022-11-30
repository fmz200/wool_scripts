//下载启动
if (/^https?:\/\/testflight\.apple\.com\/v2\/accounts\/.*\/apps\/\d*\/builds\/\d*\/install/.test(url)) {
	var tmp= $request.url.match(/apps\/\d*\/builds\/\d*\/install/g);
	modifiedPath = '/v2/accounts/'+modifiedPath+'/'+tmp[0];
}
//点开新tf+接受tf
if (/^https?:\/\/testflight\.apple\.com\/v3\/accounts\/[a-z0-9_-]+\/ru\/[a-zA-Z0-9_-]+/.test(url)) {
	var tmp= $request.url.match(/ru\/.*/g);
	modifiedPath = '/v3/accounts/'+modifiedPath+'/'+tmp[0];
//console.log(modifiedPath);
	
}
//个人页面
if (/^https?:\/\/testflight\.apple\.com\/v3\/accounts\/[a-z0-9_-]+\/apps/.test(url)) {
	var tmp= $request.url.match(/apps.*/g);
modifiedPath = '/v3/accounts/'+modifiedPath+'/'+tmp[0];
	
}
//单个tf页面
if (/^https?:\/\/testflight\.apple\.com\/v2\/accounts\/.*\/apps\/\d*\/builds\/\d*$/.test(url)) {
	var tmp= $request.url.match(/apps\/\d*\/builds\/\d*$/g);
	modifiedPath = '/v2/accounts/'+modifiedPath+'/'+tmp[0];
	
}
//单个tf历史build页面
if (/^https?:\/\/testflight\.apple\.com\/v2\/accounts\/.*\/apps\/\d*\/platforms\/ios\/trains/.test(url)) {
	var tmp= $request.url.match(/apps\/\d*\/platforms\/ios\/trains.*/g);
	modifiedPath = '/v2/accounts/'+modifiedPath+'/'+tmp[0];

}

$done({path: modifiedPath, headers : modifiedHeaders});