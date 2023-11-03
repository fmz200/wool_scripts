/*******************************
 * @author fmz200
 * @date 2023-11-03 20:50:13
 * @function 小红书画质增强：加载2K分辨率的图片

[rewrite_local]
https:\/\/edith\.xiaohongshu\.com\/api\/sns\/(v1\/localfeed|v2\/note\/widgets|v2\/note\/feed|v5\/note\/comment\/list|v6\/homefeed) url script-response-body https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/xiaohongshu/xiaohongshu.js

[mitm]
hostname = edith.xiaohongshu.com

*******************************/

let url = $request.url;
let responseBody = $response.body;

try {
  process();
} catch (error) {
  console.log('脚本运行出现错误，部分内容未生效⚠️');
  console.log('错误信息：' + error.message);
}

$done({body: responseBody});

function process() {
  let newNumber = 2160;
  responseBody = JSON.stringify(responseBody);

  const regex1 = /imageView2\/2\/w\/\d+\/format/g;
  responseBody = responseBody.replace(regex1, `imageView2/2/w/${newNumber}/format`);

  const regex2 = /imageView2\/2\/h\/\d+\/format/g;
  responseBody = responseBody.replace(regex2, `imageView2/2/h/${newNumber}/format`);

  console.log('图片画质增强完成完成✅');
  responseBody = JSON.parse(responseBody);
}
