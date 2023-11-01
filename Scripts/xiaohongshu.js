/**
 * @author fmz200
 * @function 小红书
 * @date 2023-11-01 11:50:13
 */

const targetUrl01 = 'api/sns/v5/note/comment/list';

let requestUrl = $request.url;
let responseBody = $response.body;

try {
  responseBody = process(requestUrl, responseBody);
} catch (error) {
  console.log('脚本运行出现错误，部分广告未去除⚠️');
  console.log('错误信息：' + error.message);
}

$done({body: responseBody});

function process(url, data) {
  let responseData = JSON.parse(data);

  // 1、图片无水印
  // https://edith.xiaohongshu.com/api/sns/v5/note/comment/list url script-response-body https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/xiaohongshu/xiaohongshu.js
  if (url.includes(targetUrl01)) {
    processComments(responseData.data.comments);
    console.log('评论区图片添加无水印地址💕');
  }

  return JSON.stringify(responseData);
}

function processComments(comments) {
  comments.forEach(comment => {
    if (comment.pictures) {
      comment.pictures.forEach(picture => {
        picture.origin_url = picture.origin_url + '?imageView2/2/w/2160/format/octet-stream';
        picture.file_id = picture.file_id + '?imageView2/2/w/2160/format/octet-stream';
      });
    }
  });
}