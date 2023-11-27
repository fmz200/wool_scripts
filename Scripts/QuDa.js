/**
 * @author fmz200
 * @function 去哒 首页开屏广告
 * @date 2023-11-27 22:50:13
 */
var body = $response.body;
var obj = JSON.parse(body);
if (obj.data.length == 600) {
    obj.data = "null";
    $done({body: JSON.stringify(obj)});
} else {
    $done({});
}