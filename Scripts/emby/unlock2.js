/*
引用地址 https://github.com/qiangxinglin/Emby/blob/main/scripts/emby.js
2020-12-20

[rewrite_local]
^https?:\/\/mb3admin\.com\/admin\/service(\/registration\/validateDevice|\/appstore\/register|\/registration\/validate|\/registration\/getStatus|\/supporter\/retrievekey) url script-echo-response https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/emby/unlock2.js

[mitm]
hostname = mb3admin.com
*/

var url = $request.url;
const myStatus = "HTTP/1.1 200 OK";

const myHeaders = {
  Crack: "KS",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Method": "*",
  "Access-Control-Allow-Credentials": "true"
};

if (url.indexOf("/admin/service/registration/validateDevice") != -1) {
  obj = {
    cacheExpirationDays: 365,
    message: "Device Valid",
    resultCode: "GOOD"
  };
} else if (url.indexOf("/admin/service/appstore/register") != -1) {
  obj = {
    featId: "",
    registered: true,
    expDate: "2099-01-01",
    key: ""
  };
} else if (url.indexOf("/admin/service/registration/validate") != -1) {
  obj = {
    featId: "",
    registered: true,
    expDate: "2099-01-01",
    key: ""
  };
} else if (url.indexOf("/admin/service/registration/getStatus") != -1) {
  obj = {
    planType: "Cracked",
    deviceStatus: "",
    subscriptions: []
  };
} else if (url.indexOf("/admin/service/supporter/retrievekey") != -1) {
  obj = {
    Success: false,
    ErrorMessage: "Supporter not found"
  };
}

myData = JSON.stringify(obj);

const myResponse = {
  status: myStatus,
  headers: myHeaders, // Optional.
  body: myData // Optional.
};

var $util = util();
//$util.notify('Emby Premiere 已激活');
$util.done(myResponse);

function util() {
  const isRequest = typeof $request != "undefined";
  const isSurge = typeof $httpClient != "undefined";
  const isQuanX = typeof $task != "undefined";
  const notify = (title, subtitle = "", message = "") => {
    if (isQuanX) $notify(title, subtitle, message);
    if (isSurge) $notification.post(title, subtitle, message);
  };
  const write = (value, key) => {
    if (isQuanX) return $prefs.setValueForKey(value, key);
    if (isSurge) return $persistentStore.write(value, key);
  };
  const read = (key) => {
    if (isQuanX) return $prefs.valueForKey(key);
    if (isSurge) return $persistentStore.read(key);
  };
  const adapterStatus = (response) => {
    if (response) {
      if (response.status) {
        response["statusCode"] = response.status;
      } else if (response.statusCode) {
        response["status"] = response.statusCode;
      }
    }
    return response;
  };
  const get = (options, callback) => {
    if (isQuanX) {
      if (typeof options == "string")
        options = {
          url: options,
          method: "GET"
        };
      $task.fetch(options).then(
          (response) => {
            callback(null, adapterStatus(response), response.body);
          },
          (reason) => callback(reason.error, null, null)
      );
    }
    if (isSurge)
      $httpClient.get(options, (error, response, body) => {
        callback(error, adapterStatus(response), body);
      });
  };
  const post = (options, callback) => {
    if (isQuanX) {
      if (typeof options == "string")
        options = {
          url: options,
          method: "POST"
        };
      $task.fetch(options).then(
          (response) => {
            callback(null, adapterStatus(response), response.body);
          },
          (reason) => callback(reason.error, null, null)
      );
    }
    if (isSurge) {
      $httpClient.post(options, (error, response, body) => {
        callback(error, adapterStatus(response), body);
      });
    }
  };
  const done = (value = {}) => {
    if (isQuanX) return $done(value);
    if (isSurge) isRequest ? $done(value) : $done();
  };
  return {
    isRequest,
    notify,
    write,
    read,
    get,
    post,
    done
  };
}