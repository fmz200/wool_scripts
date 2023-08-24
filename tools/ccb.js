const data = `Host: yunbusiness.ccb.com
MID: 165
Content-Type: application/json;charset=utf-8
Accept: application/json,text/javascript,*/*
Sec-Fetch-Site: cross-site
clientInfo: {"appVersion":"2.1.3.003","resourseBundleVersion":"","deviceId":"90D60640-635A-4AC0-B14F-43B716526561","deviceModel":"iPhone14,2","osType":"iOS","osVersion":"17.0","mac":"","dFingerprint":"5ce3dcdf-6d66-475b-9db4-d916c6fb282b","gpsCityCode":"110000","cityCode":"110000"}
Accept-Language: zh-TW,zh-Hant;q=0.9
Accept-Encoding: gzip, deflate, br
CHANNEL_NUM: 0
mbskey: NV9dtifMnXFgqeuDTYP225RCjRG3zbQzSqKUmLdNepLXna9T6fTcmx9xyRKZo9tc%2CaPDmv9EqwQfWn
Origin: file://
mbc_user_info: TUJDQ0IvKi8vKi8vKi8vKi8vKi8vKi8vKi8vKi8vKi8vKi8vKi8vKi8vKi8vKi9iZDA5
Sec-Fetch-Mode: cors
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/CloudMercWebView/UnionPay/1.0 CCBLoongPay
skey: bHT5by
Content-Length: 147
Sec-Fetch-Dest: empty
Connection: keep-alive`;

const lines = data.split("\n");
const jsonObject = {};

lines.forEach(line => {
  const [key, value] = line.split(": ");
  if (key && value) {
    jsonObject[key] = value;
  }
});

const jsonStr = JSON.stringify(jsonObject, null, 2);
console.log(jsonStr);
