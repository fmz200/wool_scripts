/**
 * 脚本作用：马克喵，每日签到
 * 更新时间：2023.10.14 20:55
 */

const macat_username = $prefs.valueForKey('fmz200.macat_username');
const macat_password = $prefs.valueForKey('fmz200.macat_password');

console.log("登录用户名：" + macat_username + '，登录密码：' + macat_password);
sign();

function sign() {
  const url = `https://www.macat.vip/wp-admin/admin-ajax.php`;
  const method = `POST`;
  const headers = {
    'X-Requested-With': `XMLHttpRequest`,
    'Connection': `keep-alive`,
    'Accept-Encoding': `gzip, deflate, br`,
    'Content-Type': `application/x-www-form-urlencoded; charset=UTF-8`,
    'Origin': `https://www.macat.vip`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/109.0.5414.112 Mobile/15E148 Safari/604.1`,
    'Host': `www.macat.vip`,
    'Referer': `https://www.macat.vip/`,
    'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
    'Accept': `application/json, text/javascript, */*; q=0.01`
  };
  const body = `action=user_login&username=${macat_username}&password=${macat_password}&rememberme=1`;

  const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
  };
  console.log("body：" + body);
  $task.fetch(myRequest).then(response => {
    console.log("响应码：" + response.statusCode + "，内容：" + response.body);
    if (response.statusCode != 200) {
      $.notify('马克喵登录失败', '', '');
      $done();
    }
    const rsp = JSON.parse(response.body);
    if (rsp.status === "1") {
      // 获取cookie
      const cookie = `${$response.headers['Cookie'] || $response.headers['cookie']}`;
      console.log("获取到cookie：" + cookie);
      sign_in(cookie);
    } else {
      $.notify('马克喵签到失败', response.msg, '');
    }
    $done();
  }, reason => {
    console.log(reason.error);
    $done();
  });
}

function sign_in(cookie) {
  const url = `https://www.macat.vip/wp-admin/admin-ajax.php`;
  const method = `POST`;
  const headers = {
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/109.0.5414.83 Mobile/15E148 Safari/604.1`,
    'Cookie': `${cookie}`,
  };
  const body = `action=user_qiandao&nonce=5164837696`;
  const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
  };

  $task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n签到结果为：" + response.body);
    const rsp = JSON.parse(response.body);
    if (rsp.status === "1") {
      $.notify('马克喵签到成功', response.msg, '');
    } else {
      $.notify('马克喵签到失败', response.msg, '');
    }
    $done();
  }, reason => {
    console.log(reason.error);
    $done();
  });
}