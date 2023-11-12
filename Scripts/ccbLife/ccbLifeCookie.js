const cookieName = '建行生活签到';
const signUrlKey = 'photonmang_signurl_jhsh';
const signHeaderKey = 'photonmang_signheader_jhsh';
const signBodyKey = 'photonmang_signbody_jhsh';
const globalTools = init();

if ($request && $request.method !== 'OPTIONS') {
  const signUrlVal = $request.url;
  const signHeaderVal = JSON.stringify($request.headers);
  const signBodyVal = JSON.stringify($request.body);

  console.log(`签到URL：${signUrlVal}`);
  console.log(`签到header：${signHeaderVal}`);
  console.log(`签到Body：${signBodyVal}`);

  if (signUrlVal) globalTools.setData(signUrlVal, signUrlKey);
  if (signHeaderVal) globalTools.setData(signHeaderVal, signHeaderKey);
  if (signBodyVal) globalTools.setData(signBodyVal, signBodyKey);

  globalTools.msg(cookieName, `获取Cookie: 成功`, ``);
}

function init() {
  let isSurge = () => {
    return this.$httpClient !== undefined;
  }
  let isQuanX = () => {
    return this.$task !== undefined;
  }
  let getData = (key) => {
    if (isSurge()) return $persistentStore.read(key);
    if (isQuanX()) return $prefs.valueForKey(key);
  }
  let setData = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val);
    if (isQuanX()) return $prefs.setValueForKey(key, val);
  }
  let msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body);
    if (isQuanX()) $notify(title, subtitle, body);
  }
  let log = (message) => console.log(message);
  let get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb);
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  let post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  let done = (value = {}) => {
    $done(value)
  }
  return {isSurge, isQuanX, msg, log, getData, setData, get, post, done}
}

globalTools.done();
