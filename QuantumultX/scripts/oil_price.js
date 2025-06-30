/**
 * 作者：fmz200，修改自Toperlock的oil_price.js
 * 作用：定时查询油价
 * 定时：QX导入订阅 https://raw.githubusercontent.com/fmz200/wool_scripts/main/boxjs/fmz200_gallery.json
 * 更新：2023-06-08 20:30
 * 使用：搭配BoxJS随时更改地区 https://raw.githubusercontent.com/fmz200/wool_scripts/main/boxjs/fmz200.boxjs.json
 * [task_local]
 * 0 8 * * * https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/scripts/oil_price.js, tag=今日油价, img-url=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/oil.png, enabled=true
 */

// 默认重庆
var region = $prefs.valueForKey('oil_price_region') || "chongqing";

const query_addr = `http://m.qiyoujiage.com/${region}.shtml`;

const myRequest = {
  url: query_addr,
  headers: {
    'referer': 'http://m.qiyoujiage.com/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
  }
};

$task.fetch(myRequest).then(response => {
  console.log(`油价查询开始：${region}`);
  const data = response.body;
  const reg_price = /<dl>[\s\S]+?<dt>(.*油)<\/dt>[\s\S]+?<dd>(.*)\(元\)<\/dd>/gm;
  var prices = [];
  var m = null;
  while ((m = reg_price.exec(data)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === reg_price.lastIndex) {
      reg_price.lastIndex++;
    }
    prices.push({
      name: m[1],
      value: `${m[2]} 元/L`
    });
  }

  var adjust_date = '';
  var adjust_trend = '';
  var adjust_value = '';

  const reg_adjust_tips = /<div class="tishi"> <span>(.*)<\/span><br\/>([\s\S]+?)<br\/>/;
  const adjust_tips_match = data.match(reg_adjust_tips);
  if (adjust_tips_match && adjust_tips_match.length === 3) {
    adjust_date = adjust_tips_match[1].split('价')[1].slice(0, -2);
    adjust_value = adjust_tips_match[2];
    adjust_trend = (adjust_value.indexOf('下调') > -1 || adjust_value.indexOf('下跌') > -1) ? '↓' : '↑';
    const adjust_value_re = /([\d\.]+)元\/升-([\d\.]+)元\/升/;
    const adjust_value_re2 = /[\d\.]+元\/吨/;
    const adjust_value_match = adjust_value.match(adjust_value_re);
    if (adjust_value_match && adjust_value_match.length === 3) {
      adjust_value = `${adjust_value_match[1]}-${adjust_value_match[2]}元/L`;
    } else {
      const adjust_value_match2 = adjust_value.match(adjust_value_re2);
      if (adjust_value_match2) {
        adjust_value = adjust_value_match2[0];
      }
    }
  }

  const friendly_tips = `下次${adjust_date}预计\t${adjust_trend} ${adjust_value}`;
  if (prices.length !== 4) {
    console.log(`解析油价信息失败, URL=${query_addr}`);
    $notify("油价查询", "解析失败", "请检查脚本或反馈给开发者");
    $done({});
  } else {
    const content = `${prices[0].name}\t\t\t${prices[0].value}\n${prices[1].name}\t\t\t${prices[1].value}\n${prices[2].name}\t\t\t${prices[2].value}\n${prices[3].name}\t\t\t${prices[3].value}`;
    $notify("油价查询", `${friendly_tips}`, content);
    console.log(`油价查询结果：\n${content}`);
    $done({});
  }
}, reason => {
  console.log(`查询油价信息失败, URL=${query_addr}`);
  $notify("油价查询", "请求失败", "请检查网络或反馈给开发者");
  $done({});
});
