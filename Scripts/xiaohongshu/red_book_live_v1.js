/**
 * @author fmz200
 * @function 小红书live图无水印保存
 * @description 版本1：请求feed接口时将请求参数保存，live接口取出参数原样请求（重新组装请求发现URL参数顺序打乱都会返回406...）
 * @date 2023-12-09 10:23:00
 */

// https://edith.xiaohongshu.com/api/sns/v1/note/live_photo/save url script-response-body https://github.com/fmz200/wool_scripts/raw/main/Scripts/xiaohongshu/red_book_live_v1.js
const url01 = '/v1/note/live_photo/save';

let req_url = $request.url;
let rsp_body = $response.body;
let mod_body = JSON.parse(rsp_body);
try {
  process();
} catch (e) {
  console.log('脚本运行出现错误⚠️');
  console.log('错误信息：' + e.message);
  $done({rsp_body});
}

function process() {
  console.log('脚本运行开始');
  console.log('原body：' + JSON.stringify(rsp_body));
  if (req_url.includes(url01)) {
    const myRequestCache = JSON.parse($prefs.valueForKey("fmz200.xiaohongshu.feed"));
    console.log("读取缓存key：fmz200.xiaohongshu.feed.req");
    $task.fetch(myRequestCache).then(response => {
      console.log("响应码：" + response.statusCode + "\n\n");
      console.log("响应体：" + response.body + "\n\n");
      if (response.statusCode !== 200) {
        $done({rsp_body});
      }
      let new_body = JSON.parse(response.body);
      let new_data = [];
      for (const images of new_body.data[0].note_list[0].images_list) {
        const item = {
          file_id: images.live_photo_file_id,
          video_id: images.live_photo.media.video_id,
          url: images.live_photo.media.stream.h265[0].master_url,
          author: "@fmz200"
        };
        new_data.push(item);
      }
      mod_body.data.datas = new_data;
      console.log('新body：' + JSON.stringify(mod_body));
      $done({body: JSON.stringify(mod_body)});
    }, reason => {
      console.log("请求错误将返回原响应体，信息：" + reason.error);
      $done({rsp_body});
    });
  } else {
    console.log('未匹配到live接口');
    $done({rsp_body});
  }
}
