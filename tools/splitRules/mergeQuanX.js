/**
 * mergeQuanX.js - 将 QuantumultX/rewrite/split 拆分文件聚合为一个 rewrite.snippet
 *
 * 功能说明：
 * 1. 递归读取 QuantumultX/rewrite/split 下的所有 .snippet 拆分文件
 * 2. 每个拆分文件包含两类规则和一个 hostname：
 *    - filter 规则（host 系列、IP-CIDR 等）
 *    - rewrite 规则（以 URL 正则开头的行）
 *    - hostname = ...（仅用于汇总到各合集的 [MITM] 注释，不单独输出）
 * 3. 按 blockAds 合集的既有规律重新聚合，目标只有一个文件 QuantumultX/rewrite/rewrite.snippet：
 *    - 文件头沿用当前目标文件的 #! 元数据，仅刷新 #!date（不存在时使用内置模板）
 *    - 分类固定顺序：0~9 -> A~Z -> #；空分类也保留标记行
 *    - 每个 APP 输出 # > 显示名 + # hostname 注释 + 规则内容，同分类内按显示名排序
 *    - 同一 APP 的 filter 规则与 rewrite 规则合并到同一块（filter 在前、rewrite 在后）
 *    - 末尾输出 `hostname = ...` 汇总行
 *
 * 注意：
 * - QuantumultX/rewrite 文件支持混排 filter 与 rewrite 规则，因此不再需要产出
 *   QuantumultX/filter/filter.list（该文件计划废弃，splitQuanX.js 后续改为单文件输入）
 * - 拆分文件里没有段落标记，本脚本按行类型区分 filter / rewrite
 * - 拆分文件中的占位行（this-is-an-example）不进入聚合文件
 *
 * 用法：node tools/splitRules/mergeQuanX.js
 */

const fs = require('fs').promises;
const path = require('path');

// 定位项目根目录（tools/splitRules/ 往上两级；可用环境变量覆盖，便于无破坏性测试）
const baseDir = process.env.WOOL_MERGE_BASE_DIR
  ? path.resolve(process.env.WOOL_MERGE_BASE_DIR)
  : path.resolve(__dirname, '../..');

const CONFIG = {
  inputDir: path.join(baseDir, 'QuantumultX', 'rewrite', 'split'),
  // 唯一目标文件：重写与分流统一写入 rewrite.snippet
  outputFile: path.join(baseDir, 'QuantumultX', 'rewrite', 'rewrite.snippet'),
  // 分类固定顺序（与现有总文件一致：0~9 -> A~Z -> #）
  categoryOrder: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].concat(
    Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
    ['#']
  ),
  // 内置文件头模板（仅当目标文件不存在时使用）
  headerTemplate: [
    '#!name=广告拦截合集-重写',
    '#!desc=(支持约730款APP/小程序)针对部分APP和小程序广告进行拦截，某些APP要清除缓存或者重新安装拦截广告才会生效！',
    '#!author=奶思',
    '#!homepage=https://github.com/fmz200/wool_scripts',
    '#!icon=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/gif/naisi-01.gif',
    '#!raw-url=https://github.com/fmz200/wool_scripts/raw/main/QuantumultX/rewrite/rewrite.snippet',
    '#!tg-channel=https://t.me/inaisi',
    '#!date={date}'
  ]
};

/**
 * 递归获取指定目录下的所有 .snippet 文件路径
 */
async function getFilesInDir(dir) {
  let files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(await getFilesInDir(fullPath));
    } else if (item.name.endsWith('.snippet')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * 判断一行是否为 rewrite 规则（URL 正则/URL 开头，可带可选 ^ 前缀和转义斜杠）
 * 示例：
 * ^https?:\/\/api\.m\.jd\.com\/... url reject
 * https://example.com/... url reject-dict
 */
function isRewriteLine(line) {
  const raw = line.trim();
  // 去掉反斜杠转义后，规则形如 `^https?://...` 或 `http://...`；
  // 注意 `https?` 是规则语法里的量词，文本里是字面 `s?`，不能直接用 `https?` 匹配。
  const unescaped = raw.replace(/\\/g, '');
  // 先剥掉注释符号，再剥掉规则里的可选 `^`（`#^https?...` 这类被注释的规则也要识别）
  const ruleLike = unescaped.replace(/^[;#-]+\s*/, '').replace(/^\^/, '');
  const urlPrefixed = /^(https?:\/\/|https\?:\/\/|http\?:\/\/)/i.test(ruleLike);

  // 被注释掉的普通 URL 引用（如 `# https://www.zhihu.com/question/...`）不是规则；
  // 注释掉的 rewrite 规则带 ` url ` 关键字，正常规则则直接算。
  const hasUrlKeyword = /\surl\s/i.test(unescaped);
  if (!urlPrefixed) {
    // 兼容 `^http(s:\/\/tiebac|:\/\/c\.tieba)\.baidu\.com\/... url ...` 这类缩写写法：
    // 特征就是 URL 前缀 + ` url ` 关键字。
    if (/^https?:?/i.test(ruleLike) && hasUrlKeyword) return true;
    return false;
  }
  if (/^[;#-]/.test(raw)) return hasUrlKeyword;
  return true;
}

/**
 * 判断一行是否为 filter 规则（host / IP / geoip / DOMAIN 系列）
 */
function isFilterLine(line) {
  const t = line.trim().replace(/^[;#-]+\s*/, '');
  return /^(host|ip|geoip|domain)/i.test(t) || /^IP-CIDR/.test(t);
}

/**
 * 解析拆分文件：提取显示名、filter 行、rewrite 行、hostname
 * @returns {{ displayName, category, filterLines, rewriteLines, hosts }}
 */
function parseSplitFile(content, relativeDir) {
  const header = {};
  const lines = content.split('\n');
  const filterLines = [];
  const rewriteLines = [];
  let hosts = [];
  // 注释/空行暂存，等遇到下一条规则行时按规则类型归属；
  // 若文件完全无规则行，暂存内容默认归 filter（最终由 hasRealLine 过滤掉）
  let leadingPending = []; // 文件头/首个规则前的普通注释，归 filter（与现有合集“广告联盟已包含”等占位一致）
  let bodyPending = [];   // 已确定规则类型后的普通注释，跟随当前类型
  let lastKind = null; // 'filter' | 'rewrite' | null

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      (lastKind ? bodyPending : leadingPending).push(line);
      continue;
    }

    // 文件头分隔线（如 #############################################）不进入规则输出
    if (/^#{6,}$/.test(trimmed)) continue;

    // #! 文件头
    if (/^#!([^=]+)=(.*)$/.test(line)) {
      const m = line.match(/^#!([^=]+)=(.*)$/);
      header[m[1].trim()] = m[2].trim();
      continue;
    }

    // 占位行不进入输出
    if (line.includes('this-is-an-example')) continue;

    // “广告联盟已包含”占位注释：即使没有 filter 规则也要保留为 filter 占位块
    // （与现有 filter.list 中盯盯拍/酷安/一刻相册/招钱进宝等占位块一致）
    if (trimmed.includes('广告联盟已包含')) {
      filterLines.push(line);
      continue;
    }

    // hostname 行
    if (/^hostname\s*=/.test(trimmed)) {
      const value = trimmed.replace(/^hostname\s*=\s*/, '').replace(/^%APPEND%\s*/, '');
      hosts = value.split(',').map((h) => h.trim()).filter(Boolean);
      continue;
    }

    if (isRewriteLine(line)) {
      if (bodyPending.length && lastKind === 'rewrite') {
        rewriteLines.push(...bodyPending);
        bodyPending = [];
      }
      lastKind = 'rewrite';
      rewriteLines.push(line);
    } else if (isFilterLine(trimmed)) {
      if (leadingPending.length) {
        filterLines.push(...leadingPending);
        leadingPending = [];
      }
      if (bodyPending.length) {
        filterLines.push(...bodyPending);
        bodyPending = [];
      }
      lastKind = 'filter';
      filterLines.push(line);
    } else {
      // 普通注释行：规则类型已定则跟随，未定则留给 filter
      (lastKind ? bodyPending : leadingPending).push(line);
    }
  }

  // 文件末尾残留的暂存行：跟随最后一种规则类型；无规则则归 filter
  if (leadingPending.length) filterLines.push(...leadingPending);
  if (bodyPending.length) (lastKind === 'rewrite' ? rewriteLines : filterLines).push(...bodyPending);

  // 裁掉每个块首尾的空行（块内注释间的空行保留）
  const trimBlock = (arr) => {
    let start = 0;
    let end = arr.length;
    while (start < end && !arr[start].trim()) start++;
    while (end > start && !arr[end - 1].trim()) end--;
    return arr.slice(start, end);
  };

  // 过滤“只有纯说明注释、没有规则行”的伪块：
  // - filter 块必须含真实规则行（含分号/注释禁用的 filter 规则）或“广告联盟已包含”占位
  // - rewrite 块必须含真实规则行
  const hasFilterContent = (arr) =>
    arr.some((l) => {
      const t = l.trim().replace(/^[;#-]+\s*/, '');
      return /^(host|ip|geoip|domain|IP-CIDR)/i.test(t) || t.includes('广告联盟已包含');
    });
  // rewrite 块允许纯注释：被 # 注释掉的 rewrite 规则（如 `#^https?:... url reject`）也是有效内容
  const hasAnyNonEmpty = (arr) => arr.some((l) => l.trim());
  const realFilter = (hasFilterContent(filterLines) || filterLines.some((l) => l.includes('广告联盟已包含')))
    ? trimBlock(filterLines)
    : [];
  const realRewrite = hasAnyNonEmpty(rewriteLines) ? trimBlock(rewriteLines) : [];

  const displayName = header.name || path.basename(relativeDir, '.snippet');
  const rawCategory = path.basename(path.dirname(relativeDir)).replace(/^part/, '') || '#';
  // 拆分目录里的 part!! 对应现合集分类标记 ✅ # ✅
  const category = rawCategory === '!!' ? '#' : rawCategory;

  return {
    displayName,
    category,
    filterLines: realFilter,
    rewriteLines: realRewrite,
    hosts
  };
}

/**
 * 获取聚合文件头：优先沿用现有 rewrite.snippet 的 #! 元数据，只刷新 #!date
 */
async function getHeaderLines() {
  const file = CONFIG.outputFile;
  let headerLines = [];
  try {
    const existing = await fs.readFile(file, 'utf-8');
    for (const line of existing.split('\n')) {
      // 保留整个文件前缀（#! 元数据 + 说明注释），到第一个分类标记为止
      if (/^# >>>/.test(line)) break;
      headerLines.push(line);
    }
  } catch (err) {
    // 目标文件不存在，使用内置模板
  }

  if (!headerLines.some((line) => line.startsWith('#!'))) {
    headerLines = CONFIG.headerTemplate.slice();
  }

  const now = formatDate(new Date());
  const dateIdx = headerLines.findIndex((line) => line.startsWith('#!date='));
  if (dateIdx >= 0) {
    headerLines[dateIdx] = `#!date=${now}`;
  } else {
    headerLines.push(`#!date=${now}`);
  }
  // 去掉末尾多余的空行，由组装逻辑统一控制间距
  while (headerLines.length && !headerLines[headerLines.length - 1].trim()) headerLines.pop();
  return headerLines;
}

/**
 * 格式化本地时间为 YYYY-MM-DD HH:mm:ss
 */
function formatDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

/**
 * 同分类内 APP 排序：按显示名（中文按拼音，英文按字母）
 */
function compareApps(a, b) {
  return a.displayName.localeCompare(b.displayName, 'zh-CN');
}

/**
 * 组装合集文件（单一 rewrite.snippet）
 * @param {Map<string, Map<string, object>>} appsByCategory - 分类 -> 显示名 -> 数据
 * @param {string[]} allHosts - 汇总 hostname
 * @param {Set<string>} usedCategories
 */
async function buildOutput(appsByCategory, allHosts, usedCategories) {
  const out = [];
  out.push(...(await getHeaderLines()));
  out.push('#############################################');
  out.push('');
  out.push('');

  // 空分类也保留标记行：输出全部固定分类，额外分类追加在后
  const orderedCategories = [...CONFIG.categoryOrder];
  const extraCategories = [...usedCategories].filter((c) => !CONFIG.categoryOrder.includes(c)).sort();
  orderedCategories.push(...extraCategories);

  for (const category of orderedCategories) {
    out.push(`# >>>>>>>>>>>>>>> ✅ ${category} ✅ <<<<<<<<<<<<<<`);
    out.push('');

    const apps = appsByCategory.get(category);
    if (apps && apps.size) {
      const sortedApps = [...apps.values()].sort(compareApps);
      for (const app of sortedApps) {
        out.push(`# > ${app.displayName}`);
        if (app.hosts.length) {
          out.push(`# hostname = ${app.hosts.join(', ')}`);
        }
        out.push(...app.lines);
        out.push('');
      }
    }
    out.push('');
  }

  out.push('');
  out.push('# 去重后的hostname，将对以下域名进行MITM（MAN-IN-THE-MIDDLE：中间人攻击）');
  out.push(`hostname = ${allHosts.join(', ')}`);
  out.push('');

  return out;
}

/**
 * 主函数
 */
async function main() {
  console.log('[INFO] 开始聚合 QuantumultX/rewrite/split -> rewrite.snippet（单一合集）');

  const files = await getFilesInDir(CONFIG.inputDir);
  if (files.length === 0) {
    console.log('[WARN] 输入文件夹中没有找到任何文件。');
    return;
  }
  console.log(`[INFO] 共找到 ${files.length} 个拆分文件`);

  const combinedData = new Map(); // 分类 -> 显示名 -> {displayName, hosts, lines}
  const allHosts = [];
  const hostSet = new Set();
  const usedCategories = new Set();

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf-8');
    const relativePath = path.relative(CONFIG.inputDir, filePath);
    const app = parseSplitFile(content, relativePath);
    usedCategories.add(app.category);

    for (const host of app.hosts) {
      if (!hostSet.has(host)) {
        hostSet.add(host);
        allHosts.push(host);
      }
    }

    // 同一 APP 的 filter 与 rewrite 合并到同一块（filter 在前、rewrite 在后，类型间空一行）
    const lines = [];
    if (app.filterLines.length) lines.push(...app.filterLines);
    if (app.filterLines.length && app.rewriteLines.length) lines.push('');
    if (app.rewriteLines.length) lines.push(...app.rewriteLines);
    if (!lines.length) continue;

    if (!combinedData.has(app.category)) combinedData.set(app.category, new Map());
    combinedData.get(app.category).set(app.displayName, {
      displayName: app.displayName,
      hosts: app.hosts,
      lines
    });
  }

  // 组装并写入单一合集
  const output = await buildOutput(combinedData, allHosts, usedCategories);

  await fs.mkdir(path.dirname(CONFIG.outputFile), { recursive: true });
  await fs.writeFile(CONFIG.outputFile, output.join('\n') + '\n', 'utf-8');

  const countBlocks = (data) => {
    let n = 0;
    for (const apps of data.values()) n += apps.size;
    return n;
  };

  console.log(`[INFO] rewrite.snippet 聚合 APP 块 ${countBlocks(combinedData)} 个`);
  console.log(`[INFO] 汇总 MITM hostname 数量（去重后）: ${allHosts.length}`);
  console.log(`[INFO] 输出文件: ${CONFIG.outputFile}`);
  console.log('[SUCCESS] 聚合完成！');
}

// 执行主函数
main().catch((err) => {
  console.error('[FATAL] 脚本执行出错:', err);
  process.exit(1);
});
