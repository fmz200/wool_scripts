/**
 * 晓晓优选-获取任务列表
 * 响应体如下
 */
/**
 {
 "code" : 200,
 "success" : true,
 "data" : [
 {
 "isCompleted" : 1,
 "dailyCount" : 1,
 "isContinueComplete" : 0,
 "buttonText" : "已签到",
 "taskType" : 1,
 "taskDesc" : "连续签到，有机会得晓晓红包或晓晓优选兑换券",
 "taskId" : 1,
 "iconUrl" : "https://image.xiaoxiaoyouxuan.com/admin/image_2024011014140903c1e112a8.png",
 "taskName" : "每日签到",
 "completedTimes" : 1,
 "energyBase" : 2,
 "sort" : 1
 },
 {
 "isCompleted" : 0,
 "dailyCount" : 1,
 "isContinueComplete" : 1,
 "buttonText" : "去分享",
 "taskType" : 2,
 "taskDesc" : "坚持分享，积攒更多能量",
 "taskId" : 2,
 "iconUrl" : "https://image.xiaoxiaoyouxuan.com/admin/image_2024011014113850115daf5a.png",
 "taskName" : "分享海报",
 "completedTimes" : 0,
 "energyBase" : 10,
 "sort" : 2
 },
 {
 "isCompleted" : 0,
 "dailyCount" : 20,
 "isContinueComplete" : 1,
 "buttonText" : "去观看",
 "taskType" : 3,
 "taskDesc" : "每天看视频，能量享不停",
 "taskId" : 3,
 "iconUrl" : "https://image.xiaoxiaoyouxuan.com/admin/image_20240110141237223c6844eb.png",
 "taskName" : "观看视频",
 "completedTimes" : 0,
 "energyBase" : 10,
 "sort" : 3
 },
 {
 "isCompleted" : 0,
 "dailyCount" : 4,
 "isContinueComplete" : 1,
 "buttonText" : "去下单",
 "taskType" : 4,
 "taskDesc" : "笔笔订单笔笔返，还能额外攒能量",
 "taskId" : 4,
 "iconUrl" : "https://image.xiaoxiaoyouxuan.com/admin/image_2024011014132230ac3869df.png",
 "taskName" : "完成订单",
 "completedTimes" : 0,
 "energyBase" : 100,
 "sort" : 4
 },
 {
 "isCompleted" : 0,
 "dailyCount" : null,
 "isContinueComplete" : 1,
 "buttonText" : "去完成",
 "taskType" : 5,
 "taskDesc" : "邀请团员注册，即可获得能量",
 "taskId" : 5,
 "iconUrl" : "https://image.xiaoxiaoyouxuan.com/admin/image_20240110141345703349ddbd.png",
 "taskName" : "邀请团员注册",
 "completedTimes" : null,
 "energyBase" : 200,
 "sort" : 5
 }
 ],
 "msg" : "success"
 }
 */
const url = `https://xxyx-client-api.xiaoxiaoyouxuan.com/client/energy/mall/getTaskList?platform=ios`;
const method = `GET`;
const headers = {
  'Accept-Encoding' : `gzip, deflate, br`,
  'Accept' : `*/*`,
  'Connection' : `keep-alive`,
  'xx-platform' : `ios`,
  'Content-Type' : `application/json;charset=utf-8`,
  'Host' : `xxyx-client-api.xiaoxiaoyouxuan.com`,
  'User-Agent' : `XiaoXiaoYouXuan/20127 CFNetwork/1492.0.1 Darwin/23.3.0`,
  'xx-version' : `20127`,
  'Accept-Language' : `zh-TW,zh-Hant;q=0.9`,
  'xx-time' : `1708826570844`,
  'xx-token' : `这里是token`
};
const body = ``;

const myRequest = {
  url: url,
  method: method,
  headers: headers,
  body: body
};

$task.fetch(myRequest).then(response => {
  console.log(response.statusCode + "\n\n" + response.body);
  $done();
}, reason => {
  console.log(reason.error);
  $done();
});
