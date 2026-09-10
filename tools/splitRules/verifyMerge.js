/**
 * verifyMerge.js - 验证合并脚本是否遗漏规则
 *
 * 对比拆分文件与合并文件的规则内容，用归一化 multiset 精确判断是否有遗漏。
 *
 * 用法：
 *   node tools/splitRules/verifyMerge.js              # 验证全部平台
 *   node tools/splitRules/verifyMerge.js surge         # 仅验证 Surge
 *
 * 验证维度：
 *   1. APP 名称     —— split unique vs merged unique（排除无规则的空 APP）
 *   2. 规则行数     —— 归一化后 multiset 对比（排除头部/段头/注释/hostname）
 *   3. Hostname     —— split 并集 vs merged 全局列表（去重对比）
 *
 * 说明：
 *   - 「归一化」指去掉所有空白，消除 `DOMAIN, x` 与 `DOMAIN,x` 这类格式差异
 *   - multiset 对比统计每行出现次数，避免重复行掩盖真实遗漏
 *   - splitOnlyAllow 配置项可声明「故意保留在拆分文件、不参与合并」的占位规则
 */

const fs = require('fs');
const path = require('path');

const baseDir = process.env.WOOL_MERGE_BASE_DIR
  ? path.resolve(process.env.WOOL_MERGE_BASE_DIR)
  : path.resolve(__dirname, '../..');

const PLATFORMS = {
  loon: {
    name: 'Loon',
    splitDir: ['Loon', 'plugin', 'split'],
    splitExt: '.lpx',
    mergedFile: ['Loon', 'plugin', 'blockAds.plugin'],
    hasSections: true,
  },
  quanx: {
    name: 'QuantumultX',
    splitDir: ['QuantumultX', 'rewrite', 'split'],
    splitExt: '.snippet',
    mergedFile: ['QuantumultX', 'rewrite', 'rewrite.snippet'],
    hasSections: false,
    // 纯分流重写文件导入会报错，因此拆分文件故意加入模板占位符防止报错
    splitOnlyAllow: ['this-is-an-example.com'],
    splitOnlyHostnames: ['this-is-an-example.com'],
  },
  surge: {
    name: 'Surge',
    splitDir: ['Surge', 'module', 'split'],
    splitExt: '.sgmodule',
    mergedFile: ['Surge', 'module', 'blockAds.module'],
    hasSections: true,
  },
  shadowrocket: {
    name: 'Shadowrocket',
    splitDir: ['Shadowrocket', 'module', 'split'],
    splitExt: '.srmodule',
    mergedFile: ['Shadowrocket', 'module', 'blockAds.srmodule'],
    hasSections: true,
  },
};

// ==================== 文件遍历 ====================

function getAllFiles(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) files.push(...getAllFiles(fullPath, ext));
    else if (item.name.endsWith(ext)) files.push(fullPath);
  }
  return files;
}

// ==================== 归一化 ====================

function normalize(line) {
  return line.replace(/\s+/g, '');
}

// ==================== 规则行提取 ====================

/**
 * 从 split 文件提取规则行（归一化）
 */
function extractSplitRules(content, hasSections) {
  const rules = [];
  let inSection = false;
  let inMITM = false;
  let pastSep = false;

  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('#!')) continue;

    if (hasSections) {
      const m = t.match(/^\[([^\]]+)\]$/);
      if (m) {
        inSection = true;
        inMITM = (m[1].trim() === 'MITM');
        continue;
      }
      if (inSection && !inMITM && !t.startsWith('#')) {
        rules.push(normalize(t));
      }
    } else {
      if (t === '#############################################') { pastSep = true; continue; }
      if (pastSep && !t.startsWith('#') && !t.toLowerCase().startsWith('hostname =')) {
        rules.push(normalize(t));
      }
    }
  }
  return rules;
}

/**
 * 从 merged 文件提取规则行（归一化）
 */
function extractMergedRules(content) {
  const rules = [];
  let inMITM = false;

  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('#!')) continue;
    if (t.toLowerCase().startsWith('hostname =')) continue;

    const secMatch = t.match(/^\[([^\]]+)\]$/);
    if (secMatch) {
      inMITM = (secMatch[1].trim() === 'MITM');
      continue;
    }
    if (inMITM) continue;
    if (t.startsWith('#')) continue;

    rules.push(normalize(t));
  }
  return rules;
}

/**
 * 判断 split 文件是否有实际规则内容
 */
function hasRuleContent(content, hasSections) {
  return extractSplitRules(content, hasSections).length > 0;
}

// ==================== Hostname 提取 ====================

function extractHostnames(content) {
  const hosts = new Set();
  for (const line of content.split('\n')) {
    const t = line.trim();
    const m = t.match(/^hostname\s*=\s*(?:%APPEND%\s*)?(.+)$/i);
    if (m) {
      for (const h of m[1].split(',')) {
        const host = h.trim();
        if (host && !host.toLowerCase().startsWith('hostname')) hosts.add(host);
      }
    }
  }
  return hosts;
}

// ==================== Multiset 对比 ====================

function toMultiset(arr) {
  const map = {};
  for (const item of arr) map[item] = (map[item] || 0) + 1;
  return map;
}

/**
 * multiset 对比，支持 allowList 豁免
 * @param {string[]} allowList - 归一化后的子串列表，匹配的行不计入差异
 */
function diffMultiset(splitArr, mergedArr, allowList = []) {
  const sm = toMultiset(splitArr);
  const mm = toMultiset(mergedArr);
  const onlySplit = [];
  const onlyMerged = [];
  let contentDiff = 0;

  const isAllowed = (line) => allowList.some((p) => line.replace(/\\/g, '').includes(p));

  const keys = new Set([...Object.keys(sm), ...Object.keys(mm)]);
  for (const k of keys) {
    const s = sm[k] || 0;
    const m = mm[k] || 0;
    if (s !== m) {
      if (s > m && isAllowed(k)) continue;
      contentDiff += Math.abs(s - m);
      if (s > m) onlySplit.push({ line: k, diff: s - m });
      else onlyMerged.push({ line: k, diff: m - s });
    }
  }
  return { contentDiff, onlySplit, onlyMerged };
}

// ==================== 单平台验证 ====================

async function verifyPlatform(key) {
  const config = PLATFORMS[key];
  if (!config) {
    console.error(`[ERROR] 未知平台: ${key}`);
    return;
  }

  const splitDir = path.join(baseDir, ...config.splitDir);
  const mergedFile = path.join(baseDir, ...config.mergedFile);

  console.log(`\n================ ${config.name} ================`);

  // 1. 收集 split 文件
  const files = getAllFiles(splitDir, config.splitExt);
  console.log(`split 文件数: ${files.length}`);

  // 2. 提取 split 规则 + hostname
  const splitRules = [];
  const splitHostnames = new Set();
  const splitNames = new Set();
  let splitEmpty = 0;
  const splitNameToContent = new Map();

  for (const f of files) {
    const content = fs.readFileSync(f, 'utf-8');
    const nameMatch = content.match(/^#!name=(.+)$/m);
    if (!nameMatch) continue;
    const name = nameMatch[1].trim();
    splitNames.add(name);
    splitNameToContent.set(name, content);

    splitRules.push(...extractSplitRules(content, config.hasSections));
    for (const h of extractHostnames(content)) splitHostnames.add(h);

    if (!hasRuleContent(content, config.hasSections)) splitEmpty++;
  }

  // 3. 提取 merged 规则 + hostname
  const mergedContent = fs.readFileSync(mergedFile, 'utf-8');
  const mergedRules = extractMergedRules(mergedContent);
  const mergedHostnames = extractHostnames(mergedContent);

  const mergedNames = new Set();
  for (const line of mergedContent.split('\n')) {
    const m = line.match(/^# > (.+)$/);
    if (m) mergedNames.add(m[1].trim());
  }

  // 4. APP 名称验证
  const missingApps = [...splitNames].filter(n => !mergedNames.has(n));
  const realMissingApps = missingApps.filter(n => {
    const content = splitNameToContent.get(n);
    return content && hasRuleContent(content, config.hasSections);
  });
  const extraApps = [...mergedNames].filter(n => !splitNames.has(n));

  console.log(`\n[APP] split unique=${splitNames.size}, merged unique=${mergedNames.size}, 空APP=${splitEmpty}`);
  if (realMissingApps.length > 0) {
    console.log(`  \u274C 真实遗漏 APP (${realMissingApps.length}): ${realMissingApps.join(', ')}`);
  } else {
    console.log(`  \u2705 无遗漏 APP`);
  }
  if (extraApps.length > 0) {
    console.log(`  \u26A0\uFE0F merged 多出的 APP (${extraApps.length}): ${extraApps.slice(0, 10).join(', ')}${extraApps.length > 10 ? ' ...' : ''}`);
  }

  // 5. 规则行验证
  const allowList = config.splitOnlyAllow || [];
  const { contentDiff, onlySplit, onlyMerged } = diffMultiset(splitRules, mergedRules, allowList);
  console.log(`\n[\u89C4\u5219] split=${splitRules.length}, merged=${mergedRules.length}, \u5185\u5BB9\u5DEE\u5F02=${contentDiff}`);
  if (contentDiff === 0) {
    console.log(`  \u2705 \u89C4\u5219\u5B8C\u5168\u4E00\u81F4`);
  } else {
    console.log(`  \u274C \u5B58\u5728 ${contentDiff} \u884C\u5185\u5BB9\u5DEE\u5F02`);
    if (onlySplit.length > 0) {
      console.log(`  \u4EC5 split \u6709 (${onlySplit.length} \u6761):`);
      for (const x of onlySplit.slice(0, 8)) {
        console.log(`    -(${x.diff}) ${x.line.substring(0, 80)}`);
      }
    }
    if (onlyMerged.length > 0) {
      console.log(`  \u4EC5 merged \u6709 (${onlyMerged.length} \u6761):`);
      for (const x of onlyMerged.slice(0, 8)) {
        console.log(`    +(${x.diff}) ${x.line.substring(0, 80)}`);
      }
    }
  }

  // 6. Hostname 验证
  const ignoreHosts = new Set(config.splitOnlyHostnames || []);
  const missingHosts = [...splitHostnames].filter(h => !mergedHostnames.has(h) && !ignoreHosts.has(h));
  const extraHosts = [...mergedHostnames].filter(h => !splitHostnames.has(h));
  console.log(`\n[Hostname] split\u5E76\u96C6=${splitHostnames.size}, merged=${mergedHostnames.size}`);
  if (missingHosts.length === 0 && extraHosts.length === 0) {
    console.log(`  \u2705 hostname \u5B8C\u5168\u4E00\u81F4`);
  } else {
    if (missingHosts.length > 0) {
      console.log(`  \u274C merged \u7F3A\u5C11 hostname (${missingHosts.length}): ${missingHosts.slice(0, 10).join(', ')}${missingHosts.length > 10 ? ' ...' : ''}`);
    }
    if (extraHosts.length > 0) {
      console.log(`  \u26A0\uFE0F merged \u591A\u51FA hostname (${extraHosts.length}): ${extraHosts.slice(0, 10).join(', ')}${extraHosts.length > 10 ? ' ...' : ''}`);
    }
  }
}

// ==================== 入口 ====================

async function main() {
  const target = process.argv[2];
  if (target) {
    await verifyPlatform(target);
  } else {
    for (const key of Object.keys(PLATFORMS)) {
      await verifyPlatform(key);
    }
  }
  console.log(`\n\u9A8C\u8BC1\u5B8C\u6210\u3002`);
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
