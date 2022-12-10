/*

version     v0.0.1
updatetime  2022-08-18
tgchannel   https://t.me/ddgksf2021
function    京东搜索页面优化
author      ddgksf2013

[rewrite_local]

^https?:\/\/api\.m\.jd\.com\/client\.action\?functionId=hotWords url script-response-body https://github.com/ddgksf2013/Scripts/raw/main/jd_json.js
^https?:\/\/api\.m\.jd\.com\/client\.action\?functionId=hotSearchTerms url script-response-body https://github.com/ddgksf2013/Scripts/raw/main/jd_json.js

[mitm]

hostname = api.m.jd.com

*/



var puimCea1=JSON['\x70\x61\x72\x73\x65']($response['\x62\x6f\x64\x79']);if($request['\x75\x72\x6c']['\x69\x6e\x64\x65\x78\x4f\x66']('\x68\x6f\x74\x57\x6f\x72\x64\x73')!==-1){puimCea1['\x68\x6f\x74\x77\x6f\x72\x64\x73']={};puimCea1['\x74\x61\x62\x73']={};delete puimCea1['\x61\x62\x76\x65\x72']}if($request['\x75\x72\x6c']['\x69\x6e\x64\x65\x78\x4f\x66']('\x68\x6f\x74\x53\x65\x61\x72\x63\x68\x54\x65\x72\x6d\x73')!==-1){puimCea1['\x74\x6f\x70\x44\x61\x74\x61']['\x64\x61\x74\x61']={};puimCea1['\x64\x61\x74\x61']={}}$done({body:JSON['\x73\x74\x72\x69\x6e\x67\x69\x66\x79'](puimCea1)});
