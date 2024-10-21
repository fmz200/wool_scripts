/*
脚本作者：DecoAri
引用地址：https://github.com/DecoAri/JavaScript/blob/main/Surge/TF_keys.js
具体使用步骤
1: 导入插件
2: 到Mitm页面启用 Mitm over Http2
3: 启动VPN，进入到TestFlight App，显示通知信息获取成功
4: 到配置-> 持久化数据 -> 导入指定数据  key填写APP_ID，value填写你要加入的TF的ID，（ID为链接 https://testflight.apple.com/join/LPQmtkUs 的join后的字符串（也就是此例子的“LPQmtkUs”）⚠️：支持无限个TF链接，每个链接需要用英文逗号“,”隔开（如： LPQmtkUs,Hgun65jg,8yhJgv）
）
*/
const reg1 = /^https:\/\/testflight\.apple\.com\/v3\/accounts\/(.*)\/apps$/;
const reg2 = /^https:\/\/testflight\.apple\.com\/join\/(.*)/;
if (reg1.test($request.url)) {
    $persistentStore.write(null, 'request_id')
    let url = $request.url
    let key = url.replace(/(.*accounts\/)(.*)(\/apps)/, '$2')
    let session_id = $request.headers['X-Session-Id'] || $request.headers['x-session-id']
    let session_digest = $request.headers['X-Session-Digest'] || $request.headers['x-session-digest']
    let request_id = $request.headers['X-Request-Id'] || $request.headers['x-request-id']
    let ua = $request.headers['User-Agent'] || $request.headers['user-agent']
    $persistentStore.write(key, 'key')
    $persistentStore.write(session_id, 'session_id')
    $persistentStore.write(session_digest, 'session_digest')
    $persistentStore.write(request_id, 'request_id')
    $persistentStore.write(ua, 'tf_ua')
    console.log($request.headers)
    if ($persistentStore.read('request_id') !== null) {
      $notification.post('TF信息获取', '信息获取成功，请关闭脚本！','')

    } else {
      $notification.post('TF信息获取','信息获取失败，请打开Mitm over HTTP2开关，并重启VPN和TestFlight App！','')
    }
    $done({})
}
if (reg2.test($request.url)) {
  let appId = $persistentStore.read("APP_ID");
  if (!appId) {
    appId = "";
  }
  let arr = appId.split(",");
  const id = reg2.exec($request.url)[1];
  arr.push(id);
  arr = unique(arr).filter((a) => a);
  if (arr.length > 0) {
    appId = arr.join(",");
  }
  $persistentStore.write(appId, "APP_ID");
  $notification.post("TestFlight自动加入", `已添加APP_ID: ${id}`, `当前ID: ${appId}`);
  $done({})
}
function unique(arr) {
  return Array.from(new Set(arr));
}