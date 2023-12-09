/**
 * @author fmz200
 * @function 小红书live图无水印保存
 * @date 2023-12-09 10:23:00
 */

// https://edith.xiaohongshu.com/api/sns/v1/note/live_photo/save url script-response-body https://github.com/fmz200/wool_scripts/raw/main/Scripts/xiaohongshu/red_book.js
const url01 = '/v1/note/live_photo/save';

let req_url = $request.url;
let req_body = $request.body;
let req_headers = $request.headers;

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
  // console.log('req_headers：' + JSON.stringify(req_headers));
  console.log('req_body：' + req_body);
  // TODO note_id在req_body里，取值方式没搞定
  const note_id = "";
  // const note_id = req_headers.note_id; // 先塞到headers里，这里取出来
  // const note_id = req_body.substring(req_body.index("=") + 1);
  console.log('小红书note_id=' + note_id);
  if (req_url.includes(url01)) {
    const url = `https://edith.xiaohongshu.com/api/sns/v2/note/feed?ads_track_id=&extra_params=%7B%22screen_width%22%3A393%2C%22screen_height%22%3A852%2C%22is_out_of_china%22%3A0%7D&fetch_mode=1&from_rec_local=0&has_ads_tag=0&note_id=${note_id}&source=my_profile&source_note_id=${note_id}`
    const method = `GET`;
    const myRequest = {
      url: url,
      method: method,
      headers: req_headers
    };

    $task.fetch(myRequest).then(response => {
      // TODO 响应码406不知道为什么，可能与headers有关
      console.log("响应码：" + response.statusCode + "\n\n响应体：\n" + response.body);
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
        new_data.add(item);
      }
      console.log('组装新data完成：' + JSON.stringify(new_data));
      mod_body.data.datas = new_data;
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
