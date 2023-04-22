//############################################
// 原始地址：https://github.com/sub-store-org/Sub-Store/blob/master/scripts/ip-flag.js
// 脚本地址：https://raw.githubusercontent.com/fmz200/wool_scripts/main/scripts/rename_simple_dev.js
// 脚本作用：在SubStore内对节点重命名为：旗帜|地区代码|地区名称|IP|序号，
// 使用方法：SubStore内选择“脚本操作”，然后填写上面的脚本地址
// 支持平台：目前只支持Loon，Surge
// 更新时间：2023.04.22 22:20
// 这个脚本是测试脚本，请使用 server_rename.js
//############################################
const $ = $substore;

const DELIMITER = "|"; // 分隔符
const {isLoon, isSurge, isQX} = $substore.env;

const support = (isLoon || isQX || (isSurge && parseInt($environment['surge-build']) >= 2000));

async function operator(proxies) {
  console.log(`✅💕初始节点个数 = ${proxies.length}`);

  if (!support) {
    $.error(`🚫IP Flag only supports Loon and Surge!`);
    return proxies;
  }

  const BATCH_SIZE = 10; // 每一次处理的节点个数
  const proxyBatch = [];
  for (let i = 0; i < proxies.length; i++) {
    proxyBatch.push(proxies[i]);
    if (proxyBatch.length === BATCH_SIZE || i === proxies.length - 1) {
      await processBatch(proxyBatch);
      proxyBatch.length = 0;
    }
  }

  proxies = removeDuplicateName(proxies);
  console.log(`✅💕去重后的节点个数 = ${proxies.length}`);

  for (let i = 0; i < proxies.length; i++) {
    const index = (i + 1).toString().padStart(2, '0');
    proxies[i].name = proxies[i].name + DELIMITER + index;
  }

  return proxies;
}

async function processBatch(batch) {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:78.0) Gecko/20100101 Firefox/78.0",
  };

  const nodes = ProxyUtils.produce(batch, target);
  const queries = nodes.map(node => {
    if (isLoon) {
      node = node.substring(node.indexOf("=") + 1);
    }
    return `http://ip-api.com/json?lang=zh-CN&query=${node}`;
  });

  const responses = await Promise.allSettled(queries.map(query => $.http.get({url: query, headers, node: nodes, "policy-descriptor": nodes})));

  for (let i = 0; i < nodes.length; i++) {
    const data = JSON.parse(responses[i].value.body);
    if (data.status === "success") {
      // 地区名称|IP|QC ：新加坡|13.215.162.99|QC
      batch[i].name = `${data.country}${DELIMITER}${data.query}${DELIMITER}QC`;
    } else {
      console.log(`✅💕Error: ${data.message}`);
    }
  }
}

function removeDuplicateName(arr) {
  const nameSet = new Set();
  return arr.filter(e => {
    if (nameSet.has(e.name) || !e.name.endsWith("|QC")) {
      return false;
    }
    nameSet.add(e.name);
    // 地区名称：新加坡
    e.name = e.name.substring(0, e.name.indexOf(DELIMITER));
    return true;
  });
}
