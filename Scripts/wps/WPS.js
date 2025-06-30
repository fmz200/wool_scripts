/*
 * WPS 初始化引导
 * 
 * @author ouocm
 */

// --- 核心函数区域 ---
function deepInPlaceUnescape(obj) {
  for (const key in obj) {
    let value = obj[key];
    if (typeof value === "string" && (value[0] === "{" || value[0] === "[")) {
      try {
        obj[key] = JSON.parse(value);
      } catch (e) {
        /* 解析失败，保持原样 */
      }
    }
    if (typeof obj[key] === "object" && obj[key] !== null) {
      deepInPlaceUnescape(obj[key]);
    }
  }
}

// --- 脚本主逻辑 ---
if (typeof $response !== "undefined") {
  let body = $response.body;
  try {
    let data = JSON.parse(body);
    const keysToReEscape = new Set();

    // --- 单遍扫描 ---
    if (data && data.entries) {
      for (const key in data.entries) {
        let value = data.entries[key];
        // 使用 value[0] 进行字串检查
        if (
          typeof value === "string" &&
          (value[0] === "{" || value[0] === "[")
        ) {
          try {
            const parsedValue = JSON.parse(value);
            data.entries[key] = parsedValue;
            keysToReEscape.add(key);
            deepInPlaceUnescape(parsedValue);
          } catch (e) {
            /* 不是有效的JSON字串，跳过 */
          }
        }
      }
    }

    // --- jq 风格修改 ---
    if (data && data.entries) {
      const entries = data.entries;
      // ---  顶部引导广告栏开关 ---
      if (entries.comp_top_guide) {
        entries.comp_top_guide.switch = 0;
        entries.comp_top_guide.day = "9999";
      }
      // --- 首页横幅广告 ---
      if (entries.home_banner_guide) {
        entries.home_banner_guide.switch = 0;
      }
      // --- 登录提示弹窗 ---
      if (entries.login_tips_pops) {
        entries.login_tips_pops.guide_switch = 0;
      }
      // --- 功能模块浮动广告 ---
      if (entries.module_float_show) {
        entries.module_float_show.switch = 0;
      }
      // 嵌套的每一个switch
      if (entries.module_float_show && entries.module_float_show.modules) {
        if (entries.module_float_show.modules.pdf) {
          entries.module_float_show.modules.pdf.switch = 0;
        }
        if (entries.module_float_show.modules.word) {
          entries.module_float_show.modules.word.switch = 0;
        }
        if (entries.module_float_show.modules.excel) {
          entries.module_float_show.modules.excel.switch = 0;
        }
        if (entries.module_float_show.modules.ppt) {
          entries.module_float_show.modules.ppt.switch = 0;
        }
      }
      // --- 评分引导弹窗 ---
      if (entries.rate_guide) {
        entries.rate_guide.guide_switch = 0;
      }
      // --- 开屏广告 ---
      if (entries.splash_ad) {
        entries.splash_ad.switch = 0;
      }
      // --- 登录订阅引导 ---
      if (entries.us_login_pay_config) {
        entries.us_login_pay_config.pay = 0;
      }
      // --- 用户中心横幅广告 ---
      if (entries.usercenter_banner_config) {
        entries.usercenter_banner_config.switch = 0;
      }
      // --- 登录流程广告 ---
      if (entries.splash_login_process) {
        entries.splash_login_process.login_switch = 0;
      }
      // --- 功能引导、订阅引导 ---
      if (entries.us_launch_config) {
        if (Array.isArray(entries.us_launch_config.launchSteps)) {
          entries.us_launch_config.launchSteps =
            entries.us_launch_config.launchSteps.filter(
              (step) => step !== "guide" && step !== "subscribe"
            );
        }
        if (entries.us_launch_config.subscribe_guide_config) {
          entries.us_launch_config.subscribe_guide_config.preventing_fatigue_times = 0;
          entries.us_launch_config.subscribe_guide_config.preventing_fatigue_days = 9999;
        }
      }
    }

    // --- 重新转义 ---
    if (data && data.entries) {
      for (const key of keysToReEscape) {
        if (
          data.entries[key] &&
          typeof data.entries[key] === "object" &&
          data.entries[key] !== null
        ) {
          data.entries[key] = JSON.stringify(data.entries[key]);
        }
      }
    }

    body = JSON.stringify(data);
  } catch (e) {
    console.log("脚本执行出错: " + e.message);
  }

  $done({ body });
} else {
  $done({});
}
