/***********************************
> 应用名称：百度文库
> 脚本功能：解锁VIP文档阅读权限
> 特别说明：本脚本仅供学习交流使用，禁止转载、售卖

[rewrite_local]
# 百度文库☆解锁VIP文档阅读权限（2022-10-17）
^https:\/\/appwk\.baidu\.com\/naapi\/user\/getinfo url script-response-body https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/baidu/baiduLib.js

[mitm]
hostname=appwk.baidu.com
***********************************/

let obj = JSON.parse($response.body);

obj.data.vip.base_vip_info = {
  uid: 12345678,
  type: 2,
  start_time: 1622222200,
  end_time: 4622222200,
  is_vip: 1,
  remain_day: 999,
  pro_total: 5,
  normal_total: 5
};

$done({ body: JSON.stringify(obj) });
