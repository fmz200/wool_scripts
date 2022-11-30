/*
version     v1.0.1
updatetime  2022-11-04
tgchannel   https://t.me/ddgksf2021
function    小红书去开屏广告、瀑布流广告、启动广告
author      ddgksf2013
*/

if (/^https?:\/\/edith\.xiaohongshu\.com\/api\/sns\/v\d\/system_service\/splash_config/.test($request.url)) {
    var obj = JSON.parse($response.body);
    obj.data.ads_groups.forEach((item) => {
        item.start_time = "2208963661";
        item.end_time = "2209050061";
        item.ads.forEach((i) => {
            i.start_time = "2208963661";
            i.end_time = "2209050061";
        });
    });
    $done({
        body: JSON.stringify(obj),
    });
}
if (/^https?:\/\/edith\.xiaohongshu\.com\/api\/sns\/v\d\/homefeed\?/.test($request.url)) {
    var obj = JSON.parse($response.body);
    obj.data = Object.values(obj.data).filter((item) => !item.is_ads);
    $done({
        body: JSON.stringify(obj),
    });
}
if (/^https?:\/\/edith\.xiaohongshu\.com\/api\/sns\/v\d\/system_service\/config\?/.test($request.url)) {
    var obj = JSON.parse($response.body);
    //obj.data.tabbar.tabs = Object.values(obj.data.tabbar.tabs).filter((item) => !item.title == "购买");
    delete obj.data.store;
    delete obj.data.splash;
    delete obj.data.loading_img;
    $done({
        body: JSON.stringify(obj),
    });
}
