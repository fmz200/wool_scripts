//############################################
// 原始地址：https://github.com/sub-store-org/Sub-Store/blob/master/scripts/ip-flag.js
// 脚本地址：https://raw.githubusercontent.com/fmz200/wool_scripts/main/scripts/rename_simple.js
// 脚本作用：在SubStore内对节点重命名为：旗帜|地区代码|地区名称|IP|序号，
// 使用方法：SubStore内选择“脚本操作”，然后填写上面的脚本地址
// 支持平台：目前只支持Loon，Surge
// 更新时间：2023.04.22 22:20
// 这个脚本是测试脚本，请使用 server_rename.js
//############################################

const $ = $substore;

let nodes = [];
const DELIMITER = "|"; // 分隔符
const {isLoon, isSurge, isQX} = $substore.env;

let target; // 节点转换的目标类型
if (isLoon) {
  target = "Loon";
} else if (isSurge) {
  target = "Surge";
} else if (isQX) {
  target = "QX";
}

async function operator(proxies) {
  console.log("✅💕初始节点个数 = " + proxies.length);

  let support = false;
  if (isLoon || isQX) {
    support = true;
  } else if (isSurge) {
    const build = $environment['surge-build'];
    if (build && parseInt(build) >= 2000) {
      support = true;
    }
  }

  if (!support) {
    $.error(`🚫IP Flag only supports Loon and Surge!`);
    return proxies;
  }

  const BATCH_SIZE = 10; // 每一次处理的节点个数
  let i = 0;
  while (i < proxies.length) {
    const batch = proxies.slice(i, i + BATCH_SIZE);
    await Promise.allSettled(batch.map(async proxy => {
      try {
        // 查询节点信息，返回为：地区名称|IP|QC
        proxy.name = await queryIpApi(proxy);
      } catch (err) {
        console.log(`✅💕err=${err}`);
      }
    }));

    await sleep(1000);
    i += BATCH_SIZE;
  }
  // 去除重复的节点，判断是否重复就是节点名中的IP
  proxies = removeDuplicateName(proxies);
  console.log(`✅💕去重后的节点个数 = ${proxies.length}`);
  // 再加个序号
  for (let j = 0; j < proxies.length; j++) {
    const index = (j + 1).toString().padStart(2, '0');
    proxies[j].name = proxies[j].name + DELIMITER + index;
  }

  // $.write(JSON.stringify(nodes), "#sub-store-nodes");
  return proxies;
}

// 根据节点名字去除重复的节点
function removeDuplicateName(arr) {
  const nameSet = new Set();
  const result = [];
  for (const e of arr) {
    if (!nameSet.has(e.name) && e.name.endsWith("|QC")) {
      nameSet.add(e.name);
      e.name = e.name.substring(0, e.name.indexOf(DELIMITER));
      result.push(e);
    }
  }
  return result;
}

async function queryIpApi(proxy) {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:78.0) Gecko/20100101 Firefox/78.0",
  };

  return new Promise((resolve, reject) => {
    let node = ProxyUtils.produce([proxy], target);

    // Loon 需要去掉节点名字
    if (isLoon) {
      const s = node.indexOf("=");
      node = node.substring(s + 1);
    }
    // QX只要tag的名字，目前QX本身不支持
    const QXTag = node.substring(node.lastIndexOf("=") + 1);
    const opts = {
      policy: QXTag
    };

    const url = `http://ip-api.com/json?lang=zh-CN`;
    $.http.get({
      url,
      headers,
      opts: opts, // QX的写法
      node: node,
      "policy-descriptor": node
    }).then(resp => {
      const data = JSON.parse(resp.body);
      if (data.status === "success") {
        // 地区名称|IP|QC ：新加坡|13.215.162.99|QC
        resolve(data.country + DELIMITER + data.query + "|QC");
      } else {
        reject(new Error(data.message));
      }
    }).catch(err => {
      console.log("💕err =" + err);
      reject(err);
    });
  });
}