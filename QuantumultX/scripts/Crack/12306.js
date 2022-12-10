/*

12306 去除倒计时 made by ddgksf2013 on 2022-11-27

请检查你的分流是否有ad.12306.cn，如果有，需要去除（可使用解析器排出#out=12306），不然重写是无法生效的，同时检查是否有与其冲突的重写

[rewrite_local]
^https?:\/\/ad\.12306\.cn\/ad\/ser\/getAdList url script-response-body https://github.com/ddgksf2013/Scripts/raw/main/12306.js

[mitm]
hostname = ad.12306.cn

*/






































var ddgksf2013 = JSON.parse($response.body);
if(ddgksf2013.materialsList){
if(ddgksf2013.materialsList.length==1){
ddgksf2013.materialsList[0].filePath="";
ddgksf2013.advertParam.skipTime=1;
ddgksf2013.advertParam.skipTimeAgain=5;
ddgksf2013.advertParam.showSkipBtn=-1;
}
else if(ddgksf2013.materialsList.length>1){
ddgksf2013.materialsList=[];
}
}
$done({body: JSON.stringify(ddgksf2013)});
