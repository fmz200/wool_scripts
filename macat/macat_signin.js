/**
 * 马克喵，每日签到
 * 自用的，不一定好使
 */

const cookieVal = $prefs.valueForKey('macat_cookie')
const bodyVal = $prefs.valueForKey('macat_body')
console.log("读取到Token：" + cookieVal + '\n读取到的body为：' + bodyVal);

const url = `https://www.macat.vip/wp-admin/admin-ajax.php`;
const method = `POST`;
const headers = {
  'X-Requested-With': `XMLHttpRequest`,
  'Connection': `keep-alive`,
  'Accept-Encoding': `gzip, deflate, br`,
  'Content-Type': `application/x-www-form-urlencoded; charset=UTF-8`,
  'Origin': `https://www.macat.vip`,
  'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/109.0.5414.83 Mobile/15E148 Safari/604.1`,
  'Cookie': `${cookieVal}`,
  'Host': `www.macat.vip`,
  'Referer': `https://www.macat.vip/user`,
  'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
  'Accept': `application/json, text/javascript, */*; q=0.01`
};
const body = `${bodyVal}`;

const myRequest = {
  url: url,
  method: method,
  headers: headers,
  body: body
};

$task.fetch(myRequest).then(response => {
  console.log(response.statusCode + "\n\n马克喵签到结果为：" + response.body);
  $done();
}, reason => {
  console.log(reason.error);
  $done();
});
