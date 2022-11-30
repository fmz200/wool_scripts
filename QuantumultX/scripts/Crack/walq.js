/*
我奥篮球 解锁付费直播回放及回放下载
制作时间：2021/05/02
制作者：photonmang
http://api.woaoo.net/.+ url script-response-body https://raw.githubusercontent.com/photonmang/quantumultX/master/JS/walq.js
*/

re('"alreadyPaid":\\w+@"alreadyPaidReplay":\\w+@"alreadyPaidReplayDownload":\\w+@"isPaid":\\w+@"canWatchFree":\\w+@','"alreadyPaid":true@"alreadyPaidReplay":true@"alreadyPaidReplayDownload":true@"isPaid":true@"canWatchFree":true@')

function re() {
 var body = $response.body;
 if (arguments[0].includes("@")) {
  var regs = arguments[0].split("@");
  var strs = arguments[1].split("@");
  for (i = 0;i < regs.length;i++) {
   var reg = new RegExp(regs[i],"g");
   body = body.replace(reg, strs[i]);
 }
}
 else {
  var reg = new RegExp(arguments[0],"g");
  body = body.replace(reg, arguments[1]);
}
 $done(body);
} 
