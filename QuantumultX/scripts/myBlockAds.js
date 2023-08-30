// 2023-08-25 21:00

if (!$response.body) $done({});
const url = $request.url;
let body = $response.body;

if (body) {
  switch (true) {
    // 爱奇艺-播放广告
    case /^http:\/\/t7z\.cupid\.iqiyi\.com\/mixer\?/.test(url):
      try {
        let obj = JSON.parse(body);
        const item = ["adSlots"];
        for (let i of item) {
          if (obj?.[i]) {
            delete obj[i];
          }
        }
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`爱奇艺-播放广告, 出现异常: ` + error);
      }
      break;
    // 百度网盘-开屏广告
    case /^https:\/\/pan\.baidu\.com\/api\/getsyscfg\?/.test(url):
      try {
        let obj = JSON.parse(body);
        if (obj?.splash_advertise_fetch_config_area?.cfg_list) {
          obj.splash_advertise_fetch_config_area.cfg_list =
            obj.splash_advertise_fetch_config_area.cfg_list.filter(
              (i) =>
                ![
                  "svip_user_special_advertise_config", // 生日开屏
                  "autoScroll_timeInterval", // banner广告轮播间隔时间
                  "splash_svip_default_advertise_config", // 开屏超级会员兜底广告相关配置
                  "splash_default_advertise_config", // 开屏普通用户兜底广告相关配置
                  "splash_advertise_config" // 开屏广告相关配置
                ].includes(i?.node_key)
            );
          for (let i of obj.splash_advertise_fetch_config_area.cfg_list) {
            if (i?.switch) {
              i.switch = "0";
            }
          }
        }
        if (obj?.splash_advertise_type_area?.cfg_list) {
          for (let i of obj.splash_advertise_type_area.cfg_list) {
            if (i?.switch) {
              i.switch = "0";
            }
          }
        }
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`百度网盘-开屏广告, 出现异常: ` + error);
      }
      break;
    // 嘀嗒出行-开屏广告
    case /^https:\/\/capis(-?\w*)?\.didapinche\.com\/ad\/cx\/startup\?/.test(
      url
    ):
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
      } catch (error) {
        console.log(`嘀嗒出行-开屏广告, 出现异常: ` + error);
      }
      break;
    // 多点-开屏广告
    case /^https:\/\/cmsapi\.dmall\.com\/app\/home\/homepageStartUpPic/.test(
      url
    ):
      try {
        let obj = JSON.parse(body);
        for (let i = 0; i < obj["data"]["welcomePage"].length; i++) {
          obj["data"]["welcomePage"][i]["onlineTime"] = 2208960000000;
          obj["data"]["welcomePage"][i]["offlineTime"] = 2209046399000;
        }
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`多点-开屏广告, 出现异常: ` + error);
      }
      break;
    // JavDB
    case /^https:\/\/(api\.yijingluowangluo\.xyz|jdforrepam\.com)\/api\/v\d\/\w+/.test(
      url
    ):
      try {
        let obj = JSON.parse(body);
        if (url.includes("/api/v1/ads")) {
          if (obj.data?.enabled) {
            obj.data.enabled = false;
          }
          if (obj.data?.ads) {
            obj.data.ads = {};
          }
        } else if (url.includes("/api/v1/startup")) {
          if (obj.data?.splash_ad) {
            obj.data.splash_ad.enabled = false;
            obj.data.splash_ad.overtime = 0;
          }
          if (obj.data?.feedback) {
            obj.data.feedback = {};
          }
          if (obj.data?.settings?.NOTICE) {
            delete obj.data.settings.NOTICE;
          }
          if (obj.data?.user) {
            obj.data.user.vip_expired_at = "2101-06-08T17:35:01.000+08:00";
            obj.data.user.is_vip = true;
          }
        } else if (url.includes("/api/v1/users")) {
          if (obj.data?.user) {
            obj.data.user.vip_expired_at = "2101-06-08T17:35:01.000+08:00";
            obj.data.user.is_vip = true;
          }
        } else if (url.includes("/api/v4/movies/")) {
          if (obj.data?.show_vip_banner) {
            obj.data.show_vip_banner = false;
          }
        }
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`JavDB, 出现异常: ` + error);
      }
      break;
    // 京东-开屏广告
    case /^https:\/\/api\.m\.jd\.com\/client\.action\?functionId=start/.test(
      url
    ):
      try {
        let obj = JSON.parse(body);
        for (let i = 0; i < obj.images.length; i++) {
          for (let j = 0; j < obj.images[i].length; j++) {
            if (obj.images[i][j].showTimes) {
              obj.images[i][j].showTimes = 0;
              obj.images[i][j].onlineTime = "2040-01-01 00:00:00";
              obj.images[i][j].referralsTime = "2040-01-01 23:59:59";
              obj.images[i][j].time = 0;
            }
          }
        }
        obj.countdown = 100;
        obj.showTimesDaily = 0;
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`京东-开屏广告, 出现异常: ` + error);
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
      } catch (error) {
        console.log(`联享家-开屏广告, 出现异常: ` + error);
      }
      break;
    // 小爱音箱-开屏广告
    case /^https:\/\/hd\.mina\.mi\.com\/splashscreen\/alert/.test(url):
      try {
        let obj = JSON.parse(body);
        let data = [];
        for (let i = 0; i < obj.data.length; i++) {
          let ad = obj.data[i];
          ad.start = "2208960000000";
          ad.end = "2209046399000";
          ad.stay = 1;
          ad.maxTimes = 1;
          data.push(ad);
        }
        obj.data = data;
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`小爱音箱-开屏广告, 出现异常: ` + error);
      }
      break;
    // 小米商城-开屏广告
    case /^https:\/\/api\.m\.mi\.com\/v1\/app\/start/.test(url):
      try {
        let obj = JSON.parse(body);
        obj.code = 0;
        obj.data.skip_splash = true;
        delete obj.data.splash;
        obj.info = "ok";
        obj.desc = "成功";
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`小米商城-开屏广告, 出现异常: ` + error);
      }
      break;
    // 小米商城-物流页推广
    case /^https:\/\/api\.m\.mi\.com\/v1\/order\/expressView/.test(url):
      try {
        let obj = JSON.parse(body);
        if (obj.data?.bottom?.ad_info) {
          delete obj.data.bottom.ad_info;
        }
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`小米商城-物流页推广, 出现异常: ` + error);
      }
      break;
    // 小米商城-详情页推荐搭配
    case /^https:\/\/api\.m\.mi\.com\/v1\/product\/productView/.test(url):
      try {
        let obj = JSON.parse(body);
        if (obj.data?.real_product_info) {
          delete obj.data.real_product_info;
        }
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`小米商城-详情页推荐搭配, 出现异常: ` + error);
      }
      break;
    // 优酷-播放广告
    case /^https:\/\/un-acs\.youku\.com\/gw\/mtop\.youku\.play\.ups\.appinfo\.get/.test(url):
      try {
        let obj = JSON.parse(body);
        const item = ["ad", "ykad", "watermark"];
        for (let i of item) {
          if (obj.data.data?.[i]) {
            delete obj.data.data[i];
          }
        }
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`优酷-播放广告, 出现异常: ` + error);
      }
      break;
    default:
      break;
  }
  $done({ body });
}
