/**
 * author:fmz200
 * date:2023-10-09 22:55:13
 */

const url_001 = "/api-a.soulapp.cn/loveBell/uploadPosition";
const url_002 = "/insight.soulapp.cn/mobile/insight/log/upload";

let url = $request.url;
let body = $request.body;

if (url.includes(url_001) || url.includes(url_002)) {
  console.log('匹配到URL✅');
  $done({body: {}});
} else {
  console.log('没有匹配到URL⁉️');
  $done({body: JSON.stringify(body)});
}

