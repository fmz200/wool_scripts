// 2024-10-15 10:05

const url = $request.url;
const isResp = typeof $response !== "undefined";
let body = $response.body;

switch (isResp) {
  // 草榴社区-评论区广告
  case /^https:\/\/2023\.redircdn\.com\/web\/mob_post\.js\?/.test(url):
    try {
      body = body.replace(/spinit\(\)/g, "rucu6()");
    } catch (err) {
      console.log(`草榴社区-评论区广告, 出现异常: ` + err);
    }
    break;
  // 嘀嗒出行-开屏广告
  case /^https:\/\/capis(-?\w*)?\.didapinche\.com\/ad\/cx\/startup\?/.test(url):
    try {
      let obj = JSON.parse(body);
      if (obj.hasOwnProperty("startupPages")) {
        obj.show_time = 1;
        obj.full_screen = 0;
        let startupPages = [];
        obj.startupPages.forEach((element) => {
          element["width"] = 1;
          element["height"] = 1;
          element["page_url"] = "#";
          startupPages.push(element);
        });
        obj.startupPages = startupPages;
      }
      body = JSON.stringify(obj);
    } catch (err) {
      console.log(`嘀嗒出行-开屏广告, 出现异常: ` + err);
    }
    break;
  // 多点-开屏广告
  case /^https:\/\/cmsapi\.dmall\.com\/app\/home\/homepageStartUpPic/.test(url):
    try {
      let obj = JSON.parse(body);
      for (let i = 0; i < obj["data"]["welcomePage"].length; i++) {
        obj["data"]["welcomePage"][i]["onlineTime"] = 3815740800000; // Unix 时间戳 2090-12-01 00:00:00
        obj["data"]["welcomePage"][i]["offlineTime"] = 3818419199000; // Unix 时间戳 2090-12-31 23:59:59
      }
      body = JSON.stringify(obj);
    } catch (err) {
      console.log(`多点-开屏广告, 出现异常: ` + err);
    }
    break;
  // 联享家-开屏广告
  case /^https:\/\/mi\.gdt\.qq\.com\/gdt_mview\.fcg/.test(url):
    try {
      let obj = JSON.parse(body);
      obj.seq = "0";
      obj.reqinterval = 0;
      delete obj.last_ads;
      delete obj.data;
      body = JSON.stringify(obj);
    } catch (err) {
      console.log(`联享家-开屏广告, 出现异常: ` + err);
    }
    break;
  // 淘宝-开屏视频广告
  case /^https:\/\/guide-acs\.m\.taobao\.com\/gw\/mtop\.taobao\.cloudvideo\.video\.query/.test(url):
    try {
      let obj = JSON.parse(body);
      if (obj?.data?.duration) {
        obj.data.duration = "0";
      }
      if (obj?.data?.resources?.length > 0) {
        obj.data.resources = [];
      }
      if (obj?.data?.caches?.length > 0) {
        obj.data.caches = [];
      }
      if (obj?.data?.respTimeInMs) {
        obj.data.respTimeInMs = "3818332800000";
      }
      body = JSON.stringify(obj);
    } catch (err) {
      console.log(`淘宝-开屏视频广告, 出现异常: ` + err);
    }
    break;
  // 淘宝-开屏图片广告
  case /^https:\/\/guide-acs\.m\.taobao\.com\/gw\/mtop\.taobao\.wireless\.home\.splash\.awesome\.get/.test(url):
    try {
      let obj = JSON.parse(body);
      if (obj?.data?.containers?.splash_home_base) {
        let splash = obj.data.containers.splash_home_base;
        if (splash?.base?.sections?.length > 0) {
          for (let items of splash.base.sections) {
            if ("taobao-splash" in items.bizData) {
              if (items?.bizData?.["taobao-splash"]?.data?.length > 0) {
                for (let item of items.bizData["taobao-splash"].data) {
                  item.waitTime = "0";
                  item.times = "0";
                  item.hotStart = "false";
                  item.haveVoice = "false";
                  item.hideTBLogo = "false";
                  item.enable4G = "false";
                  item.coldStart = "false";
                  item.waitTime = "0";
                  item.startTime = "3818332800000";
                  item.endTime = "3818419199000";
                  item.gmtStart = "2090-12-31 00:00:00";
                  item.gmtEnd = "2090-12-31 23:59:59";
                  item.gmtStartMs = "3818332800000";
                  item.gmtEndMs = "3818419199000";
                  if (item?.imgUrl) {
                    item.imgUrl = "";
                  }
                  if (item?.videoUrl) {
                    item.videoUrl = "";
                  }
                }
              }
            }
          }
        }
      }
      body = JSON.stringify(obj);
    } catch (err) {
      console.log(`淘宝-开屏图片广告, 出现异常: ` + err);
    }
    break;
  // 淘宝-开屏活动
  case /^https:\/\/poplayer\.template\.alibaba\.com\/\w+\.json/.test(url):
    try {
      let obj = JSON.parse(body);
      if (obj?.res?.images?.length > 0) {
        obj.res.images = [];
      }
      if (obj?.res?.videos?.length > 0) {
        obj.res.videos = [];
      }
      if (obj?.enable) {
        obj.enable = false;
      }
      if (obj?.mainRes?.images?.length > 0) {
        obj.mainRes.images = [];
      }
      body = JSON.stringify(obj);
    } catch (err) {
      console.log(`淘宝-开屏活动, 出现异常: ` + err);
    }
    break;
  // 小爱音箱-开屏广告
  case /^https:\/\/hd\.mina\.mi\.com\/splashscreen\/alert/.test(url):
    try {
      let obj = JSON.parse(body);
      let data = [];
      for (let i = 0; i < obj.data.length; i++) {
        let ad = obj.data[i];
        ad.start = "3818332800000";
        ad.end = "3818419199000";
        ad.stay = 1;
        ad.maxTimes = 1;
        data.push(ad);
      }
      obj.data = data;
      body = JSON.stringify(obj);
    } catch (err) {
      console.log(`小爱音箱-开屏广告, 出现异常: ` + err);
    }
    break;
  // 小米商城-开屏广告
  case /^https:\/\/api\.m\.mi\.com\/v1\/app\/start/.test(url):
    try {
      let obj = JSON.parse(body);
      delete obj.data.splash;
      if (obj?.data?.skip_splash) {
        obj.data.skip_splash = true;
      }
      body = JSON.stringify(obj);
    } catch (err) {
      console.log(`小米商城-开屏广告, 出现异常: ` + err);
    }
    break;
  // JavDB
  case /^https:\/\/api\.hechuangxinxi\.xyz\/api\/v\d\/\w+/.test(url):
    try {
      let obj = JSON.parse(body);
      if (url.includes("/api/v1/ads")) {
        // 首页banner
        if (obj?.data?.ads?.index_top?.length > 0) {
          // 黑名单 移除http外链
          obj.data.ads.index_top = obj.data.ads.index_top.filter((i) => !/https?:\/\//.test(i?.url));
        }
        if (obj?.data?.ads?.web_magnets_top?.length > 0) {
          // 黑名单 移除http外链
          obj.data.ads.web_magnets_top = obj.data.ads.web_magnets_top.filter((i) => !/https?:\/\//.test(i?.url));
        }
      } else if (url.includes("/api/v1/startup")) {
        // 开屏广告
        delete obj.data.settings.NOTICE; // 首次进入的提示
        if (obj?.data?.splash_ad) {
          obj.data.splash_ad.enabled = false;
          obj.data.splash_ad.overtime = 0;
        }
        if (obj?.data?.feedback) {
          obj.data.feedback = {};
        }
        if (obj?.data?.user) {
          // obj.data.user.vip_expired_at = "2090-12-31T23:59:59.000+08:00";
          // obj.data.user.is_vip = true;
        }
      } else if (url.includes("/api/v1/users")) {
        // 伪装会员
        if (obj?.data?.user) {
          // obj.data.user.vip_expired_at = "2090-12-31T23:59:59.000+08:00";
          // obj.data.user.is_vip = true;
        }
      } else if (url.includes("/api/v4/movies/")) {
        // 详情页banner
        if (obj?.data?.show_vip_banner) {
          obj.data.show_vip_banner = false;
        }
      } else {
        $done({});
      }
      body = JSON.stringify(obj);
    } catch (err) {
      console.log(`JavDB, 出现异常: ` + err);
    }
    break;
  default:
    $done({});
}

$done({ body });
