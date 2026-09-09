/**
 * mergeBlockAds.js - 将 Surge/module/split 拆分模块重新聚合为 Surge/module/blockAds.module
 *
 * 功能说明：
 * 1. 递归读取 Surge/module/split 下的所有 .sgmodule 拆分文件
 * 2. 按照 blockAds.module 的既有规律重新聚合：
 *    - 文件头沿用当前 blockAds.module 的 #! 元数据，仅刷新 #!date（不存在时使用内置模板）
 *    - 段落固定顺序：Rule -> Header Rewrite -> URL Rewrite -> Body Rewrite -> Map Local -> Script -> MITM
 *    - 段内按分类（part!!、part1..part5、partA..partZ）输出 ✅ X ✅ 标记，
 *      固定顺序：!!、1、2、3、5、A~Z；空分类也保留标记行
 *    - 每个 APP 输出 # > 显示名 + # hostname 注释 + 规则内容，同分类内按显示名排序
 *    - [MITM] 汇总全部拆分文件的 hostname（去重、按首次出现顺序）为一行
 *      hostname = %APPEND% ...
 * 3. 输出到 Surge/module/blockAds.module
 *
 * 注意：
 * - 拆分文件各自的 #!desc/#!author/#!raw-url/#!tg-channel/#!arguments 不参与聚合，
 *   聚合文件头以当前 blockAds.module 的元数据为准
 * - 拆分文件里的 [Header Rewrite] 会保留为独立段落（当前总文件历史上把它合并进了
 *   [Map Local]，重新聚合时按"分之和"原则原样保留）
 *
 * 用法：node tools/splitRules/mergeBlockAds.js
 */

const fs = require('fs').promises;
const path = require('path');

// 定位项目根目录（tools/splitRules/ 往上两级）
const baseDir = path.resolve(__dirname, '../..');

const CONFIG = {
  inputDir: path.join(baseDir, 'Surge', 'module', 'split'),
  outputFile: path.join(baseDir, 'Surge', 'module', 'blockAds.module'),
  // 段落固定顺序（拆分文件中出现的全部段落）
  sectionOrder: [
    'Rule',
    'Header Rewrite',
    'URL Rewrite',
    'Body Rewrite',
    'Map Local',
    'Script',
    'MITM'
  ],
  // 分类固定顺序（与现有总文件一致：无 4）
  categoryOrder: ['!!', '1', '2', '3', '5'].concat(
    Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
  ),
  // 内置文件头模板（仅当目标文件不存在时使用）
  headerTemplate: [
    '#!name=广告拦截&净化合集',
    '#!desc=(支持约730款APP/小程序)针对部分APP和小程序广告进行拦截，某些APP要清除缓存或者重新安装拦截广告才会生效！规则明细可以查看本插件的注释',
    '#!author=奶思[https://github.com/fmz200]',
    '#!icon=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/AdblockPlus.png',
    '#!category=奶思的模块',
    '#!homepage=https://github.com/fmz200/wool_scripts',
    '#!raw-url=https://github.com/fmz200/wool_scripts/raw/main/Surge/module/blockAds.module',
    '#!tg-channel=https://t.me/inaisi',
    '#!tag=去广告, fmz200, 奶思',
    '#!system=ios',
    '#!date={date}',
    '#!remark=下方的所有规则都标注了对应的hostname，可能存在错误或者遗漏，欢迎反馈。对于无法/可选MITM的hostname都特别做了“如开启可自行添加主机名”提示，如果提示后面没有标注主机名则包含所有主机名，否则只包含提示语后面的主机名。',
    '#!arguments=12306_enable:true'
  ]
};

/**
 * 递归获取指定目录下的所有 .sgmodule 文件路径
 */
async function getFilesInDir(dir) {
  let files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(await getFilesInDir(fullPath));
    } else if (item.name.endsWith('.sgmodule')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * 解析拆分文件：文件头 #! 字段 + 各段落内容
 * @returns {{ header: Object<string,string>, sections: Map<string,string[]> }}
 */
function parseSplitFile(content) {
  const lines = content.split('\n');
  const header = {};
  const sections = new Map();
  let currentSection = null;
  let buffer = [];

  const flush = () => {
    if (currentSection) {
      sections.set(`[${currentSection}]`, trimLines(buffer));
    }
    buffer = [];
  };

  for (const line of lines) {
    const secMatch = line.match(/^\[([^\]]+)\]\s*$/);
    if (secMatch) {
      flush();
      currentSection = secMatch[1].trim();
      continue;
    }
    if (!currentSection) {
      const headerMatch = line.match(/^#!([^=]+)=(.*)$/);
      if (headerMatch) {
        header[headerMatch[1].trim()] = headerMatch[2].trim();
      }
      continue;
    }
    buffer.push(line);
  }
  flush();
  return { header, sections };
}

/**
 * 去掉段落内容首尾的空行
 */
function trimLines(arr) {
  while (arr.length && !arr[arr.length - 1].trim()) arr.pop();
  while (arr.length && !arr[0].trim()) arr.shift();
  return arr;
}

/**
 * 从 [MITM] 段落内容中提取 hostname 列表（去掉 %APPEND% 前缀，按逗号拆分并去空白）
 */
function extractHosts(lines) {
  const hosts = [];
  for (const line of lines) {
    const match = line.match(/^hostname\s*=\s*(?:%APPEND%\s*)?(.+)$/i);
    if (!match) continue;
    for (const host of match[1].split(',')) {
      const trimmed = host.trim();
      if (trimmed && !hosts.includes(trimmed)) {
        hosts.push(trimmed);
      }
    }
  }
  return hosts;
}

/**
 * 获取聚合文件头：优先沿用现有 blockAds.module 的 #! 元数据，只刷新 #!date
 */
async function getHeaderLines() {
  let headerLines = [];
  try {
    const existing = await fs.readFile(CONFIG.outputFile, 'utf-8');
    for (const line of existing.split('\n')) {
      if (line.startsWith('#!')) {
        headerLines.push(line);
      } else if (line.startsWith('# >>>')) {
        break;
      }
    }
  } catch (err) {
    // 目标文件不存在，使用内置模板
  }

  if (headerLines.length === 0) {
    headerLines = CONFIG.headerTemplate.slice();
  }

  const now = formatDate(new Date());
  const dateIdx = headerLines.findIndex((line) => line.startsWith('#!date='));
  if (dateIdx >= 0) {
    headerLines[dateIdx] = `#!date=${now}`;
  } else {
    headerLines.splice(headerLines.length - 1, 0, `#!date=${now}`);
  }
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
 * 同分类内 APP 排序：按显示名（中文按拼音，英文按字母），平局按文件名
 */
function compareApps(a, b) {
  const byName = a.displayName.localeCompare(b.displayName, 'zh-CN');
  if (byName !== 0) return byName;
  return a.ruleName.localeCompare(b.ruleName, 'zh-CN');
}

/**
 * 主函数
 */
async function main() {
  console.log('[INFO] 开始聚合 Surge/module/split -> Surge/module/blockAds.module');

  const files = await getFilesInDir(CONFIG.inputDir);
  if (files.length === 0) {
    console.log('[WARN] 输入文件夹中没有找到任何文件。');
    return;
  }
  console.log(`[INFO] 共找到 ${files.length} 个拆分文件`);

  // sectionsData: [段落名] -> Map(分类 -> Map(显示名 -> {displayName, ruleName, hosts, lines}))
  const sectionsData = new Map();
  const allHosts = [];
  const hostSet = new Set();
  const usedCategories = new Set();

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf-8');
    const relativePath = path.relative(CONFIG.inputDir, filePath);
    const categoryKey = path.dirname(relativePath).replace(/^part/, '') || '!!';
    usedCategories.add(categoryKey);

    const ruleName = path.basename(filePath, '.sgmodule');
    const { header, sections } = parseSplitFile(content);
    const displayName = header.name || ruleName;
    const hosts = extractHosts(sections.get('[MITM]') || []);

    // 全局 hostname 收集（去重、按首次出现顺序）
    for (const host of hosts) {
      if (!hostSet.has(host)) {
        hostSet.add(host);
        allHosts.push(host);
      }
    }

    for (const [secKey, secLines] of sections.entries()) {
      if (secKey === '[MITM]') continue;
      if (!secLines.length) continue;

      if (!sectionsData.has(secKey)) sectionsData.set(secKey, new Map());
      const byCategory = sectionsData.get(secKey);
      if (!byCategory.has(categoryKey)) byCategory.set(categoryKey, new Map());
      const apps = byCategory.get(categoryKey);
      apps.set(displayName, { displayName, ruleName, hosts, lines: secLines });
    }
  }

  // 段落顺序：已知段落按固定顺序，未知段落追加在后
  const knownSections = CONFIG.sectionOrder.map((name) => `[${name}]`);
  const unknownSections = [...sectionsData.keys()].filter((k) => !knownSections.includes(k));
  if (unknownSections.length) {
    console.log(`[WARN] 发现未在固定顺序中的段落: ${unknownSections.join(', ')}，将追加在末尾`);
  }
  const orderedSections = [...knownSections, ...unknownSections.sort()];

  // 分类顺序：固定顺序优先，其余追加在后
  const orderedCategories = CONFIG.categoryOrder.filter((c) => usedCategories.has(c));
  const extraCategories = [...usedCategories].filter((c) => !CONFIG.categoryOrder.includes(c)).sort();
  orderedCategories.push(...extraCategories);

  // 组装输出
  const out = [];
  out.push(...(await getHeaderLines()));
  out.push('');
  out.push('');

  for (const secKey of orderedSections) {
    out.push('# >>>>>>>>>>>>>>> 🟣 <<<<<<<<<<<<<<');
    out.push(secKey);

    if (secKey === '[MITM]') {
      out.push(`hostname = %APPEND% ${allHosts.join(', ')}`);
      out.push('');
      continue;
    }

    const byCategory = sectionsData.get(secKey);
    for (const category of orderedCategories) {
      out.push(`# >>>>>>>>>>>>>>> ✅ ${category} ✅ <<<<<<<<<<<<<<`);
      out.push('');

      const apps = byCategory && byCategory.get(category);
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
  }

  await fs.mkdir(path.dirname(CONFIG.outputFile), { recursive: true });
  await fs.writeFile(CONFIG.outputFile, out.join('\n') + '\n', 'utf-8');

  // 汇总输出
  console.log('[INFO] 各段落 APP 块数量:');
  for (const secKey of orderedSections) {
    const byCategory = sectionsData.get(secKey);
    let count = 0;
    if (byCategory) {
      for (const apps of byCategory.values()) count += apps.size;
    }
    console.log(`  ${secKey}: ${count}`);
  }
  console.log(`[INFO] 汇总 MITM hostname 数量（去重后）: ${allHosts.length}`);
  console.log(`[INFO] 输出文件: ${CONFIG.outputFile}（共 ${out.length} 行）`);
  console.log('[SUCCESS] 聚合完成！');
}

// 执行主函数
main().catch((err) => {
  console.error('[FATAL] 脚本执行出错:', err);
  process.exit(1);
});
