//参考@yichahucha 的脚本

const launchAdUrl1 = '/interface/sdk/sdkad.php';
const launchAdUrl2 = '/wbapplua/wbpullad.lua';

// function needModify(url) {
// 	if(url.indexOf(launchAdUrl1) > -1 || url.indexOf(launchAdUrl2) > -1) {
// 		return true;
// 	}
// 	return false;
// }

function modifyMain(url, data) {
	if(url.indexOf(launchAdUrl1) > -1) {
		let temp = data.match(/\{.*\}/);
		if(!temp) return data;
		data = JSON.parse(temp);
		if (data.ads) data.ads = [];
		if (data.background_delay_display_time) data.background_delay_display_time = 60 * 60 * 24 * 1000;
		if (data.show_push_splash_ad) data.show_push_splash_ad = false;
		return JSON.stringify(data) + 'OK';
	}
	if(url.indexOf(launchAdUrl2) > -1) {
		data = JSON.parse(data);
		if (data.cached_ad && data.cached_ad.ads) {
			data.cached_ad.ads = [];
		}
		return JSON.stringify(data);
	}
	return data;
}

var body = $response.body;
var url = $request.url;
// if(needModify(url)) {
body = modifyMain(url, body);
// }

$done(body);