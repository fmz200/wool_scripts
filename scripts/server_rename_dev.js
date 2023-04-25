//############################################
// 脚本作者：@奶茶姐 感谢@key，sub-store-org
// 重要提示：该脚本是测试脚本，请使用 https://raw.githubusercontent.com/fmz200/wool_scripts/main/scripts/server_rename.js
// 脚本地址：https://raw.githubusercontent.com/fmz200/wool_scripts/main/scripts/server_rename_dev.js
// 脚本作用：在SubStore内对节点重命名
// 使用方法：SubStore内选择“脚本操作”，然后填写上面的脚本地址
// 支持平台：目前只支持Loon，Surge
// 更新时间：2023.04.26 00:05
//############################################

const $ = $substore;
const DELIMITER = "|"; // 分隔符
const {isLoon, isSurge, isQX} = $substore.env;
// 节点转换的目标类型
const target = isLoon ? "Loon" : isSurge ? "Surge" : isQX ? "QX" : undefined;
// 判断传入超时 值，单位：ms
const timeout = $arguments['timeout'] ? $arguments['timeout'] : 4000;
// argument传入 flag 时候，添加国旗
const flag = $arguments['flag'];
// 每一次处理的节点个数
const batch_size = $arguments['batch']? $arguments['batch'] : 20;

async function operator(proxies) {
  const startTime = new Date(); // 获取当前时间作为开始时间
  console.log("✅💕初始节点个数 = " + proxies.length);
  console.log("✅💕超时时间 = " + timeout);
  console.log("✅💕每一次处理的节点个数 = " + batch_size);
  // console.log("✅💕proxies = " + JSON.stringify(proxies));

  const support = (isLoon || isQX || (isSurge && parseInt($environment['surge-build']) >= 2000));
  if (!support) {
    $.error(`🚫IP Flag only supports Loon and Surge!`);
    return proxies;
  }

  let i = 0;
  while (i < proxies.length) {
    const batch = proxies.slice(i, i + batch_size);
    await Promise.allSettled(batch.map(async proxy => {
      try {
        // 查询入口IP信息
        const in_info = await queryDNSInfo(proxy.server);
        // console.log(proxy.server + "✅💕in节点信息 = " + JSON.stringify(in_info));

        // 查询出口IP信息
        const out_info = await queryIpApi(proxy);
        // console.log(proxy.server + "✅💕out节点信息 = " + JSON.stringify(out_info));

        // 节点重命名为：旗帜|策略|序号
        const type = in_info.data === out_info.query ? "直连" : "中转";
        proxy.name = getFlagEmoji(out_info.countryCode) + DELIMITER + type + "->" + out_info.country;

        // 新增一个去重用字段，该字段重复那就是重复节点：入口IP|出口IP
        proxy.qc = in_info.data + DELIMITER + out_info.query;
      } catch (err) {
        console.log(`✅💕err 02 =${err}`);
      }
    }));

    // await sleep(300);
    i += batch_size;
  }
  // console.log("💰💕去重前的节点信息 = " + JSON.stringify(proxies));
  // 去除重复的节点
  proxies = removeDuplicateName(proxies);
  // console.log("✅💕去重后的节点信息 = " + JSON.stringify(proxies));
  console.log(`✅💕去重后的节点个数 = ${proxies.length}`);
  // 加个序号
  for (let j = 0; j < proxies.length; j++) {
    const index = (j + 1).toString().padStart(2, '0');
    proxies[j].name = proxies[j].name + DELIMITER + index;
  }

  const endTime = new Date(); // 获取当前时间作为结束时间
  const timeDiff = endTime.getTime() - startTime.getTime(); // 获取时间差（以毫秒为单位）
  console.log(`✅💕方法总耗时: ${timeDiff / 1000} seconds`); // 将时间差转换为秒并打印到控制台上

  return proxies;
}

// 根据节点名字去除重复的节点
function removeDuplicateName(arr) {
  const nameSet = new Set();
  const result = [];
  for (const e of arr) {
    if (e.qc && !nameSet.has(e.qc)) {
      nameSet.add(e.qc);
      result.push(e);
    }
  }
  return result;
}

async function queryIpApi(proxy) {
  return new Promise((resolve, reject) => {
    const url = `http://ip-api.com/json?lang=zh-CN&fields=status,message,country,countryCode,city,query`;
    let node = ProxyUtils.produce([proxy], target);

    // Loon 需要去掉节点名字
    if (isLoon) {
      node = node.substring(node.indexOf("=") + 1);
    }
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
        const data = JSON.parse(resp.body);
        if (data.status === "success") {
          resolve(data);
        } else {
          reject(new Error(data.message));
        }
      }).catch(err => {
        console.log("💕err 01 =" + err);
        reject(err);
      });
    // 超时处理
    Promise.race([timeoutPromise, queryPromise])
      .catch(err => {
        reject(err);
      });
  });
}

async function queryIpApiInfo(server) {
  return new Promise((resolve, reject) => {
    const url = `http://ip-api.com/json/${server}?lang=zh-CN&fields=status,message,country,countryCode,city,query`;
    $.http.get({
      url
    }).then(resp => {
      const data = JSON.parse(resp.body);
      if (data.status === "success") {
        resolve(data);
      } else {
        reject(new Error(data.message));
      }
    }).catch(err => {
      console.log("💕err 03 =" + err);
      reject(err);
    });
  });
}

//查询入口 阿里dns 不返回国家信息 速度快 去重够用
async function queryDNSInfo(server) {
  return new Promise((resolve, reject) => {
    const url = `http://223.5.5.5/resolve?name=${server}`;
    $.http.get({
      url
    }).then(resp => {
      const data = JSON.parse(resp.body);
      if (data.Status === 0) {
        // Status: 0,成功，返回最下面的ip
        resolve(data.Answer[0]);
      } else if (data.Status === 3) {
        // 阿里dns Status: 3,失败，返回server
        resolve(data.Question);
      } else {
        reject(new Error(data.message));
      }
    }).catch(err => {
      console.log("💕err 03 =" + err);
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
