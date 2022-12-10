/*
version     v0.0.1
updatetime  2022-11-04
tgchannel   https://t.me/ddgksf2021
function    酷安去首页广告、信息流广告、评论广告
author      kk pp


[rewrite_local]
^https?:\/\/api.coolapk.com\/v6\/(feed\/(replyList|detail)|main\/indexV8|dataList) url script-response-body https://github.com/ddgksf2013/Scripts/raw/main/coolapk.js

[mitm]
hostname = api.coolapk.com

*/

if ($request.url.indexOf("replyList") != -1) {
    var bodyObj = JSON.parse($response.body);
    bodyObj.data = Object.values(bodyObj.data).filter((item) => item.id);
    $done({
        body: JSON.stringify(bodyObj),
    });
} else if ($request.url.indexOf("indexV8") != -1) {
    var bodyObj = JSON.parse($response.body);
    bodyObj.data = Object.values(bodyObj.data).filter((item) => !(item["entityTemplate"] == "sponsorCard" || item.entityId == 8639 || item.entityId == 33006 || item.entityId == 32557 || item.title.indexOf("值得买") != -1));
    //去除头条信息流推广和首页轮转
    $done({
        body: JSON.stringify(bodyObj),
    });
} else if ($request.url.indexOf("dataList") != -1) {
    var bodyObj = JSON.parse($response.body);
    bodyObj.data = Object.values(bodyObj.data).filter((item) => !(item["entityTemplate"] == "sponsorCard" || item.title == "精选配件"));
    $done({
        body: JSON.stringify(bodyObj),
    });
} else if ($request.url.indexOf("detail") != -1) {
    var bodyObj = JSON.parse($response.body);
    bodyObj.data.hotReplyRows = Object.values(bodyObj.data.hotReplyRows).filter((item) => item["id"]);
    bodyObj.data.include_goods_ids = [];
    bodyObj.data.include_goods = [];
    $done({
        body: JSON.stringify(bodyObj),
    });
} else {
    $done($response);
}

