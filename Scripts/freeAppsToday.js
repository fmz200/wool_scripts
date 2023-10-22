const $ = new Xiaobai();

// 填key就行
const key = $prefs.valueForKey('freeAppsTodayKey');

const myRequest = {
  url: "https://api.gofans.cn/v1/m/app_records?page=1&limit=10",
  headers: {
    referer: "https://m.gofans.cn/",
    origin: "https://m.gofans.cn",
  },
};

const uuid_cache = async (req, uuid, readData) => {
  const stringLen = (str, num) => (str.length <= num ? str : str.substring(0, num));
  if ((readData = getRead[uuid])) {
    uuidArr.push(uuid);
    return {...readData, type: true};
  }
  let [data] = await $.get(req);
  data["description"] = stringLen(data["description"], 200);
  const regex = /price|track_url|name|primary_genre_name|icon|description|version|original_price|kind_name/;
  data = Object.keys(data).reduce((result, key) => (regex.test(key) && (result[key] = data[key]), result), {});
  newArr.push(uuid);
  getRead[uuid] = data;
  return data;
};


const currentTime = () => new Date().toLocaleString();

class NoteObject {
  constructor(key) {
    this.key = typeof $argument !== "undefined" ? $argument : key;

    this.barkObject = (name, body, icon, obj) => ({
      url: "https://api.day.app/push",
      headers: {"Content-Type": "application/json; charset=utf-8"},
      timeout: 3,
      body: $.jsonS({
        title: name,
        body: body,
        icon: icon,
        device_key: this.key,
        ...obj,
      }),
    });
  }

  notif({price, track_url, name, primary_genre_name, icon, description, version, original_price, kind_name, type}) {
    const body = `类别:${primary_genre_name}  版本:${version}\n原价:${original_price}  现价:${price}  平台:${kind_name}\n${description}`;
    const obj = {
      group: (initialize && kind_name) || type ? kind_name : "",
      level: "passive",
      url: track_url,
    };
    return this.key
      ? $.post(this.barkObject(name, body, icon, obj))
      : $.msg(name, "", body, {url: track_url, media: icon});
  }

  end(name, body, icon) {
    return this.key
      ? $.post(this.barkObject(name, body, icon))
      : $.msg(name, "", body);
  }
}

const uuidArr = [];
const newArr = [];
const getRead = $.jsonP($.read("APP") || "{}");
const initialize = Object.keys(getRead).length === 0;
const note = new NoteObject(key);

$.get(myRequest)
  .then(([{data}]) => {
    if (!data) throw "空数据"
    const uuid_Request = data.map(({uuid}) => [uuid, {...myRequest, url: `https://api.gofans.cn/v1/m/apps/${uuid}`}]);
    // 并发请求获取应用程序详细数据
    return Promise.allSettled(uuid_Request.map(([uuid, req]) => uuid_cache(req, uuid)));
  })
  .then((json) =>
    // 筛选出成功的请求，并返回数据
    json.reduce((prev, {status, value}) => (status === "fulfilled" ? [...prev, value] : prev), [])
  )
  .then((noteData) =>
    // 并发请求发送推送通知
    Promise.allSettled(noteData.map((val) => note.notif(val)))
  )
  .then(() => {
    // 更新数据
    const sum = newArr.length;
    const sumArr = [...uuidArr, ...newArr];
    const getReakeys = Object.keys(getRead);
    let message = "APP暂无更新";
    if (sum || sumArr.length !== getReakeys.length) {
      message = `APP已更新 数量: ${newArr.length}\n${newArr.map((val) => getRead[val].name).join("  ")}`;
      getReakeys.forEach((key) => {
        sumArr.includes(key) || delete getRead[key];
      });
      $.write($.jsonS(getRead), "APP");
    }
    // 发送结束通知
    note.end(
      "限免APP",
      `刷新时间 ${currentTime()}\n${message}`,
      "https://pic.616pic.com/ys_b_img/00/58/60/IiOiwSSokt.jpg",
    );
  })
  .catch((err) => {
    $.log(err, data);
    $.msg("", err, data);
  })
  .finally(() => $done());

function Xiaobai() {
  const isSurge = typeof $httpClient !== "undefined";

  const reqPro = (method, options, parse) => {
    return new Promise((resolve, reject) => {
      const cb = (err, resp, body) => err ? reject(err) : resolve([parse ? body : JSON.parse(body), resp]);

      if (isSurge) {
        $httpClient[method](options, cb);
      } else {
        typeof options === "string" && (options = {url: `${options}`});
        options.method = method.toUpperCase();
        $task.fetch(options)
          .then(({headers, statusCode, body}) =>
            resolve([parse ? body : JSON.parse(body), {...headers, status: statusCode}])
          )
          .catch(r =>
            reject(r.error)
          );
      }
    });
  }

  this.get = (options, parse) => reqPro("get", options, parse);

  this.post = (options, parse) => reqPro("post", options, parse);

  this.read = key => isSurge
    ? $persistentStore.read(key)
    : $prefs.valueForKey(key);

  this.write = (key, val) => isSurge
    ? $persistentStore.write(key, val)
    : $prefs.setValueForKey(key, val);

  this.msg = (t, s, b, u) => {
    const {url, media} = u || {};
    isSurge
      ? $notification.post(t, s, b, url && {url: url})
      : $notify(t, s, b, {"open-url": url, "media-url": media});
  };

  this.log = (...x) =>
    console.log(["", ...x].map(arg => typeof arg === "object" ? JSON.stringify(arg) : arg).join("\n"));

  this.jsonS = x => JSON.stringify(x);
  this.jsonP = x => JSON.parse(x);
}
