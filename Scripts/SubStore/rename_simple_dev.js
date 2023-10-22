//############################################
// 脚本作者：@奶茶姐 感谢@key，@sub-store-org
// 重要提示：该脚本是测试脚本，请使用 https://github.com/fmz200/wool_scripts/raw/main/Scripts/SubStore/rename_simple.js
// 脚本地址：https://github.com/fmz200/wool_scripts/raw/main/Scripts/SubStore/rename_simple_dev.js
// 脚本作用：在SubStore内对节点重命名，排序，去除ping失败的节点
// 使用方法：SubStore内选择“脚本操作”，然后填写上面的脚本地址
// 支持平台：✅Loon，✅Surge，❌QuanX(待开发者支持)，❌Stash(待开发者支持)，❌ShadowRocket(待开发者支持)
// 更新时间：2023.05.07 20:25
//############################################

const $ = $substore;
const DELIMITER = "|"; // 分隔符
const {isLoon, isSurge, isQX} = $substore.env;
// 节点转换的目标类型
const target = isLoon ? "Loon" : isSurge ? "Surge" : isQX ? "QX" : undefined;
// 判断传入超时 值，单位：ms
const timeout = $arguments['timeout'] ? $arguments['timeout'] : 5000;
// argument传入 flag 时候，添加国旗
const flag = $arguments['flag'];
// 每一次处理的节点个数
const batch_size = $arguments['batch'] ? $arguments['batch'] : 10;

async function operator(proxies) {
  const startTime = new Date(); // 获取当前时间作为开始时间
  const server_count = proxies.length;
  console.log("✅💕去重前节点个数 = " + server_count);
  console.log("✅💕节点超时时间 = " + timeout);
  console.log("✅💕批处理节点个数 = " + batch_size);
  // console.log("✅💕$environment = " + JSON.stringify($environment));
  // console.log("✅💕$arguments = " + JSON.stringify($arguments));
  // console.log("✅💕去重前的节点信息 = " + JSON.stringify(proxies));

  const support = (isLoon || (isSurge && parseInt($environment['surge-build']) >= 2000));
  if (!support) {
    $.error(`🚫该脚本只支持Loon、Surge，其他平台待开发者支持！`);
    return proxies;
  }

  await Promise.allSettled(proxies.map(async proxy => {
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

  // 去除重复的节点，排序，再加个序号
  proxies = rmDupNameAndGroupAndEnumerate(proxies);
  // console.log("✅💕去重后的节点信息 = " + JSON.stringify(proxies));
  console.log(`✅💕去重后节点个数 = ${proxies.length}，共去除 ${server_count - proxies.length} 个节点`);

  const endTime = new Date(); // 获取当前时间作为结束时间
  const timeDiff = endTime.getTime() - startTime.getTime(); // 获取时间差（以毫秒为单位）
  console.log(`✅💕脚本运行总耗时: ${timeDiff / 1000} seconds`); // 将时间差转换为秒并打印到控制台上

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

async function queryOutInfo(proxy) {
  return new Promise((resolve, reject) => {
    const url = `http://ip-api.com/json?lang=zh-CN&fields=status,message,country,countryCode,city,query`;
    let node = ProxyUtils.produce([proxy], target);

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("请求超时"));
      }, timeout);
    });

    const queryPromise =
      $.http.get({
        url,
        opts: {policy: node}, // QX的写法，目前QX本身不支持
        node: node, // Loon，Surge IOS
        "policy-descriptor": node, // Surge MAC
        // timeout: 2000, // 请求超时，单位ms，默认5000ms
      }).then(resp => {
        const body = JSON.parse(resp.body);
        if (body.status === "success") {
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
        item.name = `${item.name}${DELIMITER}${index < 9 ? '0' : ''}${index + 1}`;
      });
    }
  }

  // 将修改后的集合返回
  return Object.values(groups).flat();
}
