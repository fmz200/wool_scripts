/**
 * 作者：@fmz200
 */

const url1 = '/user/profile_pre_edit';

let url = $request.url;
let body = $response.body;
try {
  body = action(url, body);
} catch (e) {
  console.log('脚本运行出现错误，返回源数据⚠️');
  console.log('错误信息：' + e.message);
}
$done({body});


function action(url, body) {
  let resp_data = JSON.parse(body);

  // 1、资料编辑页面 判断是否可编辑
  // https://edith.xiaohongshu.com/api/sns/v1/user/profile_pre_edit
  // https://edith.xiaohongshu.com/api/sns/v1/user/profile_pre_edit url script-response-body red_book.js
  if (url.includes(url1)) {
    console.log('资料编辑页面开始‼️');
    setAllowEditToTrue(resp_data.data);
    console.log('资料编辑页面结束✅');
  }

  return JSON.stringify(resp_data);
}

function setAllowEditToTrue(data) {
  for (const key in data) {
    if (data.hasOwnProperty(key) && typeof data[key] === 'object') {
      data[key].allow_edit = true;
    }
  }
}


