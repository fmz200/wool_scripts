
// ==UserScript==
// @Name              小小影视免广告
// @Author            Cuttlefish
// @TgChannel         https://t.me/ddgksf2021
// @WechatID          公众号墨鱼手记
// @UpdateTime        20220212      
// ==/UserScript==

const path1 = "1/ucp/index";
const path2 = "2init";
const path3 = "/vod/reqplay/";
const path4 = "getGlobalData";
let obj = JSON.parse($response.body);

if ($request.url.indexOf(path1) != -1){
	obj.data.uinfo["down_daily_remainders"] = "678";
 	obj.data.uinfo["play_daily_remainders"] = "876";
	obj.data.uinfo["curr_group"] = "5";
	obj.data.user["isvip"] = "1";
 	obj.data.user["goldcoin"] = "666";
}
if ($request.url.indexOf(path2) != -1){
 	obj.data.user["isvip"] = "1";
 	obj.data.user["goldcoin"] = "999";
}
if ($request.url.indexOf(path3) != -1){
	//obj.data="ANAAAAJQAEIAAAB2HgAR+gAAAABVnPUNAAAJ3qQ+aPQXAAAAAAcuASJRNVRlUmUCAlRQVE4GagYnAR4CTAYYAm1WYQRpVRtWIQZfUmYAYlQFVzUFKlosVSEFRFoYVxNTNwBoUGQHSwdhB0gHXwdeB0AHdwdtB3IHMQdvB3EHTwc/BygHXgdVB3QHNQd3B1AHKAdrBzIHMwdyB3MHfwd9B3QHLAc1B3UHQwdGB00HLAdPB0AHUAdsB1AHfQdoB0EHXwdsB0YHcQd+BzQHYQczB0gHaQdMBz8HYAd+B34HdQdLB2MHXwdDB3cHZAdMBzcHYAc6BzpSUAETU0hUMV1/Ax8HOQEcVGQLIVdzAmxSUlV1V2YGYFUSUyUFfFsSBVRbAlo3Vz0BeAVHUCpTYVotB35QHAVpUhxSJlIVUmpSClJgUiJSY1IwUnlSGFIXUjlSG1IhUmtSYlIlUn1SNlIoUiNSB1ITUmtSEFIgUmRSG1IDUhdSGVIbUn1SHVJ9UmZSGVIFUjRSP1IhUhFSIlIaUgZSJVJ9UhlSY1JkUnlSFlJkUhNSAFIXUj1SA1IhUghSYVIzUmpSeVIRUjRSGFIEUhBSAVJ5UiZSYlJiUgpSFlI6UgJSNFJqUmtSAFIwUmRSCFIjUgNSHFI+Uj1SFlJgUmRSB1JiUhNSGlI4UhFSAVJrUjBSClIjUitSFVIlUh1SZlJkUgVSa1IoUjdSa1IcUmZSM1I/UgNSKFJnUjdSGlIgUhlSEFIFUiZSNlIDUhpSYlIcUjpSfVIiUmBSMVIjUjxSIVIHUhtSGVIfUnlSHFICUhhSFFIxUjtSClI0UipSFVIWUmdSN1IiUjZSHVITUjZSBFIiUmNSZFIEUh9SYVIYUjFSY1J5UhhSFFJnUmBSPlJ5UihSPFIYUjRSFFIWUhRSH1IUUgVSfVJlUhVSFVIoUihSOFI0Uj1SJ1IrUiJSEFIrUgZSMVI1UjFSIlIcUhRSKFIiUh9SBlI4UgtSA1IBUmJSGVJkUh9SPlIVUmVSYlIxUiRSBlIHUn1SMFJhUgpSalI6UmJSC1I4UhxSAlI+UgBSJVI8UghSFVJrUjZSEVJgUipSKlIDUgRSM1IhUiVSb1JvALcHxVSvVbddhFa2VeYDyATTUOoAzAKXAbxagVHTVrdUzwG1BeBb3VveUrdS11bbULgHswa/V7FTwQKvBuBRxQC+";
}
if ($request.url.indexOf(path4) != -1) {
	//delete obj.data.adrows;
	delete obj.data.popuptext_iOS;
	//delete obj.data.adgroups;
	//delete obj.data.appver;
	delete obj.data.iOS_adgroups;
	delete obj.data.Android_adgroups;
	delete obj.data.sdkrows_iOS;
	delete obj.data.sdkrows_Android;
     //delete obj.data.app_launch_type_adshow;
	obj.data.app_launch_times_adshow=-1;
}
$done({body: JSON.stringify(obj)});
