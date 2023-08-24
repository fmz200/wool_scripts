/**
 * 作者：@fmz200
 * 作用：定时
 * 配置：可以订阅task脚本，也可以添加下方配置
 * [task_local]
 * 0 0 0/4 * * ? https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/scripts/subStoreSyncSubs.js, tag=SubStore同步订阅, img-url=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/SubStore.png, enabled=true
 * 更新：2023.03.12 21:30
 * 同步一个：https://sub.store/api/sync/artifact/yiyuan
 * 同步全部：https://sub.store/api/sync/artifact
 */

const myRequest = {
  url: `https://sub.store/api/sync/artifact`,
  method: `GET`
};
const headers = {
  'authority': 'sub.store',
  'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
  'accept': 'application/json, text/plain, */*',
  'dnt': '1',
  'sec-ch-ua-mobile': '?0',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'sec-ch-ua-platform': '"macOS"',
  'origin': 'https://sub-store.vercel.app',
  'sec-fetch-site': 'cross-site',
  'sec-fetch-mode': 'cors',
  'sec-fetch-dest': 'empty',
  'referer': 'https://sub-store.vercel.app/',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'zh-CN,zh;q=0.9'
};

$task.fetch(myRequest, headers).then(response => {
  console.log("返回码：" + response.statusCode + "\n\n");
  const data = JSON.parse(response.body);
  console.log("同步结束💕💕\n" + JSON.stringify(data));
  $done();
}, reason => {
  console.log(reason.error);
  $done();
});
