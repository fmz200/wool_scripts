//############################################
// 脚本作者：@奶茶姐 感谢@key，@sub-store-org
// 重要提示：该脚本是测试脚本，请使用 https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/rename_simple.js
// 脚本地址：https://github.com/fmz200/wool_scripts/raw/main/Scripts/SubStore/server_rename_dev.js
// 脚本作用：在SubStore内对节点重命名，并去除ping失败的节点
// 使用方法：SubStore内选择“脚本操作”，然后填写上面的脚本地址
// 支持平台：✅Loon，✅Surge，❌QuanX(待开发者支持)，❌Stash(待开发者支持)，❌ShadowRocket(待开发者支持)
// 更新时间：2023.05.07 20:25
//############################################

const RESOURCE_CACHE_KEY = '#sub-store-cached-resource';
const CACHE_EXPIRATION_TIME_MS = 10 * 60 * 1000;
const $ = $substore;

class ResourceCache {
  constructor(expires) {
    this.expires = expires;
    const cachedData = $.read(RESOURCE_CACHE_KEY);
    if (!cachedData) {
      this.resourceCache = {};
      this._persist();
    } else {
      this.resourceCache = JSON.parse(cachedData);
    }
    this._cleanup();
  }

  _cleanup() {
    // clear obsolete cached resource
    let clear = false;
    const now = new Date().getTime();
    Object.keys(this.resourceCache).forEach((id) => {
      const updated = this.resourceCache[id];
      if (!updated.time || now - updated.time > this.expires) {
        delete this.resourceCache[id];
        $.delete(`#${id}`);
        clear = true;
      }
    });
    if (clear) this._persist();
  }

  revokeAll() {
    this.resourceCache = {};
    this._persist();
  }

  _persist() {
    $.write(JSON.stringify(this.resourceCache), RESOURCE_CACHE_KEY);
  }

  get(id) {
    const updated = this.resourceCache[id] && this.resourceCache[id].time;
    if (updated && new Date().getTime() - updated <= this.expires) {
      return this.resourceCache[id].data;
    }
    return null;
  }

  set(id, value) {
    this.resourceCache[id] = {time: new Date().getTime(), data: value}
    this._persist();
  }
}

const resourceCache = new ResourceCache(CACHE_EXPIRATION_TIME_MS);

const DELIMITER = "|"; // 分隔符
const {isLoon, isSurge, isQX, isNode, isStash, isShadowRocket} = $substore.env;
// 节点转换的目标类型
const target = isLoon ? "Loon" : isSurge ? "Surge" : isQX ? "QX" : undefined;
// 判断传入超时 值，单位：ms
const timeout = $arguments['timeout'] ? $arguments['timeout'] : 5000;
// argument传入 flag 时候，添加国旗
const flag = $arguments['flag'];
// 每一次处理的节点个数
const batch_size = $arguments['batch']? $arguments['batch'] : 10;

async function operator(proxies) {
  const startTime = new Date(); // 获取当前时间作为开始时间
  console.log("✅💕初始节点个数 = " + proxies.length);
  console.log("✅💕节点超时时间 = " + timeout);
  console.log("✅💕批处理的节点个数 = " + batch_size);
  // console.log("✅💕去重前的节点信息 = " + JSON.stringify(proxies));

  const support = (isLoon || (isSurge && parseInt($environment['surge-build']) >= 2000));
  if (!support) {
    $.error(`🚫该脚本只支持Loon、Surge，其他平台待开发者支持！`);
    // $notify("♥♥重命名脚本只支持Loon 和 Surge!", "不支持01", "不支持02");
    return proxies;
  }

  let i = 0;
  while (i < proxies.length) {
    const batch = proxies.slice(i, i + batch_size);
    await Promise.allSettled(batch.map(async proxy => {
      try {
        // 查询入口IP信息
        const in_info = await queryInInfo(proxy.server);
        // console.log(proxy.server + "✅💕in节点信息 = " + JSON.stringify(in_info));

        // 查询出口IP信息
        const out_info = await queryOutInfo(proxy);
        // console.log(proxy.server + "✅💕out节点信息 = " + JSON.stringify(out_info));

        // 节点重命名为：旗帜|策略|序号
        const type = in_info.data === out_info.query ? "直连" : "中转";
        proxy.name = getFlagEmoji(out_info.countryCode) + DELIMITER + type + "→" + out_info.country;

        // 新增一个去重用字段，该字段重复就是重复节点：入口IP|出口IP，无此字段表示ping失败
        proxy.qc = in_info.data + DELIMITER + out_info.query;
        proxy.px = out_info.countryCode;
      } catch (err) {
        console.log(`⚠️while err = ${err}`);
      }
    }));

    // await sleep(300);
    i += batch_size;
  }
  // console.log("💰💕去重前的节点信息 = " + JSON.stringify(proxies));
  // 去除重复的节点，排序，再加个序号
  proxies = rmDupNameAndGroupAndEnumerate(proxies);
  // console.log("✅💕去重后的节点信息 = " + JSON.stringify(proxies));
  console.log(`✅💕去重后的节点个数 = ${proxies.length}`);

  const endTime = new Date(); // 获取当前时间作为结束时间
  const timeDiff = endTime.getTime() - startTime.getTime(); // 获取时间差（以毫秒为单位）
  console.log(`✅💕方法总耗时: ${timeDiff / 1000} seconds`); // 将时间差转换为秒并打印到控制台上

  return proxies;
}

// 查询入口 阿里dns
async function queryInInfo(server) {
  return new Promise((resolve, reject) => {
    const data = {data: server};
    const url = `http://223.5.5.5/resolve?name=${server}`;
    $.http.get({
      url
    }).then(resp => {
      const body = JSON.parse(resp.body);
      if (body.Status === 0) {
        // Status: 0,成功，返回最下面的ip
        resolve(body.Answer[body.Answer.length - 1]);
      } else {
        resolve(data);
      }
    }).catch(err => {
      console.log("⚠️In err = " + err);
      resolve(data);
    });
  });
}

const tasks = new Map();
async function queryOutInfo(proxy) {
  const id = getId(proxy);
  const cached = resourceCache.get(id);
  if (cached) {
    return (cached);
  }

  return new Promise((resolve, reject) => {
    const url = `http://ip-api.com/json?lang=zh-CN&fields=status,message,country,countryCode,city,query`;
    let node = ProxyUtils.produce([proxy], target);

    // Loon 需要去掉节点名字
    // if (isLoon) {
    //   node = node.substring(node.indexOf("=") + 1);
    // }
    // QX只要tag的名字，目前QX本身不支持
    const opts = {policy: node.substring(node.lastIndexOf("=") + 1)};

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("请求超时"));
      }, timeout);
    });

    const queryPromise =
      $.http.get({
        url,
        opts: opts, // QX的写法
        node: node, // Loon和Surge IOS
        "policy-descriptor": node // Surge MAC
      }).then(resp => {
        const body = JSON.parse(resp.body);
        if (body.status === "success") {
          resourceCache.set(id, body);
          tasks.set(id, body);
          resolve(body);
        } else {
          reject(new Error(body.message));
        }
      }).catch(err => {
        reject(err);
      });
    // 超时处理
    Promise.race([timeoutPromise, queryPromise])
      .catch(err => {
        reject(err);
      });
  });
}

function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String
    .fromCodePoint(...codePoints)
    .replace(/🇹🇼/g, '🇨🇳');
}

function rmDupNameAndGroupAndEnumerate(arr) {
  // 去重
  const nameSet = new Set();
  const result = [];
  for (const e of arr) {
    if (e.qc && !nameSet.has(e.qc)) {
      nameSet.add(e.qc);
      result.push(e);
    }
  }

  // 将对象按照 sort 属性分组
  const groups = result.reduce((result, item) => {
    const key = item.px;
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {});

  // 给每个分组中的对象的 name 属性加上两位数序号
  for (const groupKey in groups) {
    if (groups.hasOwnProperty(groupKey)) {
      const group = groups[groupKey];
      group.forEach((item, index) => {
        item.name = `${item.name}${DELIMITER}${index < 10 ? '0' : ''}${index + 1}`;
      });
    }
  }

  // 将修改后的集合返回
  return Object.values(groups).flat();
}

var MD5 = function (d) { var r = M(V(Y(X(d), 8 * d.length))); return r.toLowerCase() }; function M(d) { for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++)_ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _); return f } function X(d) { for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++)_[m] = 0; for (m = 0; m < 8 * d.length; m += 8)_[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32; return _ } function V(d) { for (var _ = "", m = 0; m < 32 * d.length; m += 8)_ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255); return _ } function Y(d, _) { d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _; for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) { var h = m, t = f, g = r, e = i; f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e) } return Array(m, f, r, i) } function md5_cmn(d, _, m, f, r, i) { return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m) } function md5_ff(d, _, m, f, r, i, n) { return md5_cmn(_ & m | ~_ & f, d, _, r, i, n) } function md5_gg(d, _, m, f, r, i, n) { return md5_cmn(_ & f | m & ~f, d, _, r, i, n) } function md5_hh(d, _, m, f, r, i, n) { return md5_cmn(_ ^ m ^ f, d, _, r, i, n) } function md5_ii(d, _, m, f, r, i, n) { return md5_cmn(m ^ (_ | ~f), d, _, r, i, n) } function safe_add(d, _) { var m = (65535 & d) + (65535 & _); return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m } function bit_rol(d, _) { return d << _ | d >>> 32 - _ }
