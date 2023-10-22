/**
 * 作者：@fmz200
 * 作用：定时获取抖音小姐姐的视频链接，点击通知即可跳转
 * 配置：可以订阅task脚本，也可以添加下方配置
 * [task_local]
 * 0 0 8-22 * * ? https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/dyGirlVideo.js, tag=抖音小姐姐视频, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/TikTok_2.png, enabled=true
 * 更新：2023.03.12 21:30
 */

const myRequest = {
  url: `https://zj.v.api.aa1.cn/api/video_dyv2`,
  method: `GET`
};

$task.fetch(myRequest).then(response => {
  console.log("code：" + response.statusCode + "\n\n");
  const data = JSON.parse(response.body);
  if (data.code == "0") {
    const media_url = "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/TikTok_1.png";
    // quanX点击通知跳转open-url，长按通知可直接显示media-url内容不用跳转
    const link = {"open-url": data.url, "media-url": data.url}
    const title = data.dsc;
    console.log(title + "\n\n");
    $notify("获取抖音小姐姐短视频成功💖\n", "长按直接看，点击可跳转💖\n", title, link);
  }
  console.log("js结束💕💕");
  $done();
}, reason => {
  console.log(reason.error);
  $done();
});
