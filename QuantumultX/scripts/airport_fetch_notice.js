/**
 * 获取机场公告
 * airport_fetch_notice.js
 * 0 11 * * *
 */
console.log("获取机场公告开始👨‍💻‍👨‍💻‍");
const url_airport = $prefs.valueForKey('url_airport'); // 你的机场地址，例如 www.brd.life
const email_airport = $prefs.valueForKey('email_airport'); // email=你的邮箱，如果失败把@符号写成%40
const password_airport = $prefs.valueForKey('password_airport'); // password=你的密码
console.log(`你的机场地址：${url_airport}\n你的邮箱：${email_airport}\n你的密码：${password_airport}\n`);
sign();

function sign() {
  const url = `https://${url_airport}/api/v1/passport/auth/login`;
  const method = `POST`;
  const headers = {
    'Connection': `keep-alive`,
    'Accept-Encoding': `gzip, deflate, br`,
    'Content-Language': `zh-CN`,
    'Content-Type': `application/x-www-form-urlencoded`,
    'Origin': `https://${url_airport}`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/105.0.5195.147 Mobile/15E148 Safari/604.1`,
    'Cookie': ``,
    'Host': `${url_airport}`,
    'Referer': `https://${url_airport}/`,
    'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
    'Accept': `*/*`
  };
  const body = `email=${email_airport}&password=${password_airport}`;
  const myRequest = {
    url: url, method: method, headers: headers, body: body
  };

  $task.fetch(myRequest).then(response => {
    console.log("登录响应码：" + response.statusCode + "\n\n" + response.body + "\n\n");
    let authData = JSON.parse(response.body).data.auth_data;
    console.log("获取到的token：" + authData + "\n\n");
    if (authData) {
      fetchNotices(authData);
    } else {
      $done();
    }
  }, reason => {
    console.log(reason.error);
    $done();
  });
}

// 拉取通知
function fetchNotices(authData) {
  const url = `https://${url_airport}/api/v1/user/notice/fetch`;
  const method = `GET`;
  const headers = {
    'Authorization': authData,
    'Accept': `*/*`,
    'Connection': `keep-alive`,
    'Referer': `https://${url_airport}/`,
    'Content-Language': `zh-CN`,
    'Host': `${url_airport}`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/105.0.5195.147 Mobile/15E148 Safari/604.1`,
    'Accept-Encoding': `gzip, deflate, br`,
    'Accept-Language': `zh-CN,zh-Hans;q=0.9`
  };
  const body = ``;

  const myRequest = {
    url: url, method: method, headers: headers, body: body
  };

  $task.fetch(myRequest).then(response => {
    console.log("拉取公告响应码：" + response.statusCode + "\n\n");
    const data = JSON.parse(response.body)['data'];
    const title = "通知标题👉" + data[0]['title'];
    const notify = "通知内容👉" + data[0]['content'];
    console.log(notify + "\n\n");
    $notify("♥♥获取机场公告成功", title, notify);
    console.log("获取机场公告结束💕💕");
    $done();
  }, reason => {
    console.log(reason.error);
    $done();
  });

}


