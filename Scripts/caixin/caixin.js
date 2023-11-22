/**
 * @author fmz200
 * @function 阅读财新APP会员文章，需要去某宝购买会员卡密
 * @date 2023-11-22 18:30:13
 *
 * hostname = mappsv5.caixin.com
 * [rewrite_local]
 * https://mappsv5\.caixin\.com/articlev5/(\d+)/(\d+)\.html url script-response-body caixin.js
 */

let req_url = $request.url;
let rsp_body = $response.body;
let kami = ''; // 这里填写卡密
let articleProperties = {};
let articleURL = "";
try {
  modifyMain();
} catch (e) {
  console.log('脚本运行出现错误⚠️');
  console.log('错误信息：' + e.message);
}

function modifyMain() {
  console.log('脚本运行开始');
  if (rsp_body.includes("浏览完整内容，请订阅《财新周刊》")) {
    console.log('会员文章💕');
    sign();
  } else {
    console.log('普通文章💕');
    $done({rsp_body});
  }
}

function sign() {
  console.log('开始登录💕');
  const url = `http://113.207.49.170:8801/api/login.php`;
  const method = `POST`;
  const headers = {
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/119.0.6045.169 Mobile/15E148 Safari/604.1`,
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarylAGNzd3p4Uf34hmM'
  };
  const body = `------WebKitFormBoundarylAGNzd3p4Uf34hmM\nContent-Disposition: form-data; name="kami"\n\n${kami}\n------WebKitFormBoundarylAGNzd3p4Uf34hmM--\n`;
  const myRequest = {
    url: url, method: method, headers: headers, body: body
  };

  $task.fetch(myRequest).then(response => {
    console.log("登录响应码：" + response.statusCode + "\n\n" + response.body + "\n\n");
    let authData = JSON.parse(response.body);
    if (authData.code === 200) {
      fetchArticle(authData.token);
    } else {
      console.log('登录失败❌');
    }
  }, reason => {
    console.log('请求异常❗️');
    console.log(reason.error);
    $done({rsp_body});
  });
}

// 拉取文章
function fetchArticle(authData) {
  // 文章链接示例：https://www.caixin.com/2023-11-20/102137746.html
  const htmlString = rsp_body;
  const startTag = '<script';
  const endTag = '</script>';
  const keyword = 'articleProperties';
  const startIndex = htmlString.indexOf(keyword);
  const startScriptIndex = htmlString.lastIndexOf(startTag, startIndex);
  const endIndex = htmlString.indexOf(endTag, startIndex);

  if (startIndex !== -1 && startScriptIndex !== -1 && endIndex !== -1) {
    articleProperties = htmlString.substring(startIndex + 20, endIndex + endTag.length - 10);
    // console.log(articleProperties);
  } else {
    console.log('未找到匹配的内容或者没有包含articleProperties。');
  }
  articleURL = JSON.parse(articleProperties).from_web_url;
  console.log("文章链接：" + articleURL);

  const url = `http://113.207.49.170:8801/api/news.php`;
  const method = `POST`;
  const headers = {
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/119.0.6045.169 Mobile/15E148 Safari/604.1`,
    'Cookie': `kami=${kami}; token=${authData}`,
  };
  const body = `url=${articleURL}`;

  const myRequest = {
    url: url, method: method, headers: headers, body: body
  };

  $task.fetch(myRequest).then(response => {
    console.log("拉取文章响应码：" + response.statusCode + "\n\n");
    rsp_body = response.body;
    console.log("拉取文章结束💕");
    // console.log("会员文章内容：\n" + new_rsp_body);
    $done({body: rsp_body});
  }, reason => {
    console.log(reason.error);
    $done({rsp_body});
  });
}
