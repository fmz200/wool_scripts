/**
 * 解锁微博会员图标
 *
 * hostname=new.vip.weibo.cn
 * [rewrite_local]
 * ^https?://new\.vip\.weibo\.cn/aj/appicon/list url script-response-body https://github.com/fmz200/wool_scripts/raw/main/Scripts/weibo/weibo_vip.js
 *
 */

var body = $response.body;
var obj = JSON.parse(body);

if (obj.data && obj.data.list) {
  obj.data.list.forEach(function (item) {
    item.cardType = "2";
    item.tag = "";
  });
}

$done({body: JSON.stringify(obj)});