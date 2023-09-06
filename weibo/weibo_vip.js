const url1 = '/aj/appicon/list';
const url2 = '/aj/activity/userinfo';

let url = $request.url;
let body = $response.body;
try {
  body = modifyMain(url, body);
} catch (e) {
  console.log('脚本运行出现错误，返回源数据⚠️');
  console.log('错误信息：' + e.message);
}
$done({body});

function modifyMain(url, data) {
  let resp_data = JSON.parse(data);
  // 1、查询图标列表以及是否为VIP
  if (url.includes(url1)) {
    const modifiedResponse = replaceVipInfo(resp_data);
    console.log("修改后的图标以及VIP数据：" + JSON.stringify(modifiedResponse));
    return JSON.stringify(resp_data);
  }

  // 2、查询是否为VIP
  if (url.includes(url2)) {
    const modifiedResponse = setVipLevel(resp_data);
    console.log("修改后的VIP数据：" + JSON.stringify(modifiedResponse));
    return JSON.stringify(resp_data);
  }
}

function setVipLevel(responseBody) {
  try {
    // 将响应体解析为 JSON 对象
    const responseObject = responseBody;

    // 检查是否存在 "data" 字段，并且其中包含 "is_vip" 字段
    if (responseObject && responseObject.data && responseObject.data.is_vip !== undefined) {
      // 设置 "is_vip" 字段的值为3
      responseObject.data.is_vip = 3;

      // 将修改后的 JSON 对象转换回字符串
      const modifiedResponse = JSON.stringify(responseObject);

      return modifiedResponse;
    } else {
      // 如果响应体中缺少必要字段，返回原始响应
      return responseBody;
    }
  } catch (error) {
    // 如果解析或修改失败，返回原始响应
    return responseBody;
  }
}

function replaceVipInfo(responseBody) {
  try {
    // 将响应体解析为 JSON 对象
    const responseObject = responseBody;

    // 替换 "vip_info" 对象为指定信息
    responseObject.data.vip_info = {
      "gif_icon": "https://h5.sinaimg.cn/upload/108/830/2022/10/19/vip7_default.gif",
      "vip_end_date": "2099-11-15 VIP到期，续费即享40+会员特权",
      "user_type": 3,
      "vip_level": "7",
      "isVip": 1,
      "icon": "https://h5.sinaimg.cn/upload/108/1866/2022/11/02/vip_7.png",
      "large_icon": "https://h5.sinaimg.cn/upload/108/830/2022/10/19/icon_vip7.png"
    };

    // 将修改后的 JSON 对象转换回字符串
    const modifiedResponse = JSON.stringify(responseObject);

    return modifiedResponse;
  } catch (error) {
    // 如果解析或替换失败，返回原始响应
    return responseBody;
  }
}
