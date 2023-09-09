/*
 * 脚本作用：获取应用的cookie或token
 */

// const $ = new API("获取Cookie或Token通用脚本");
const current_url = `${$request.url}`;
console.log(`当前请求的url: ${current_url}`);
const current_headers = JSON.parse(`${$request.headers}`);
console.log(`当前请求的headers: ${current_headers}`);

!(async () => {
    // 什么值得买
    if (current_url.includes(smzdm.url)) {
      const cookie = current_headers['Cookie'] || current_headers['cookie'];
      $.write(cookie, '#SMZDM_COOKIE');
      $.notify(smzdm.msg + '获取cookie成功✅', cookie, cookie);
      console.log(smzdm.msg + '获取到的ck为：' + cookie);
    }

    // 拼多多果园获取token，暂时不确定哪个URL会携带PDDAccessToken
    // Cookie: pdd_vds=xxx; ETag=dKJLmoeS; PDDAccessToken=12HUHDUW; install_token=118E4FCA;
    if (current_url.includes(pdd_orchard.url)) {
      const cookieValue = current_headers["Cookie"] || current_headers["cookie"];
      const token = cookieValue.match(/PDDAccessToken=.+?/);
      if (token) {
        $.write(token, '#ddgyck');
        $.notify(pdd_orchard.msg + 'token获取成功', token, token);
        console.log(pdd_orchard.msg + '获取到的ck为：' + token);
      }
    }

    // 美团
    if (current_url.includes(meituan.url)) {
      const token = current_headers['token'] || current_headers['Token'];
      $.write(token, '#meituanCookie');
      $.notify(meituan.msg + '获取成功✅', token, token);
      console.log(meituan.msg + '获取到的内容为：' + token);
    }

  }
)
().catch((e) => {
  console.log(`获取cookie失败，原因: ${e}`);
  $.notify('获取cookie失败', '', '');
}).finally(() => {
  $.done({});
})

/**
 * 脚本作用：什么值得买，手机APP进入我的页面查看个人资料，即可获取cookie
 * 更新时间：2023.06.06 12:30
 */
const smzdm = {
  url: "user-api.smzdm.com/users/info",
  msg: "什么值得买"
};

/**
 * 脚本作用：拼多多果园获取token
 * 重写地址：暂时没有确定具体是那个请求URL会携带token，因为每次手动抓包获取token的url都不一样
 * 触发类型：request-header
 * 获取方式：小程序或APP进果园逛一圈+浇水，在请求头request-header中搜索PDDAccessToken
 * 注意事项：每次脚本获取会覆盖之前的ck，暂时不支持脚本获取多个token，建议手动抓取然后填到boxjs里面，多账号用@隔开：tk1@tk2
 * 更新时间：2023.01.07 12:30
 */
const pdd_orchard = {
  url: "m.pinduoduo.net/proxy/api/api/server/_stm",
  msg: "拼多多果园"
};

/**
 * 脚本作用：美团获取token
 * 触发类型：request-header
 * 获取方式：点击“我的”-“个人头像”，在请求头request-header中搜索token
 * 更新时间：2023.09.07 17:30
 */
const meituan = {
  url: "/user/v1/info/audit",
  msg: "美团获取token"
};
