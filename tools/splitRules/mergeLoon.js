/**
 * mergeLoon.js - 将 Loon/plugin/split 拆分插件聚合为 blockAds.plugin
 *
 * 功能说明：
 * 1. 递归读取 Loon/plugin/split 下的所有 .lpx 拆分文件
 * 2. 按照 blockAds.plugin 的既有规律重新聚合：
 *    - 文件头沿用当前 blockAds.plugin 的 #! 元数据，仅刷新 #!date
 *    - 段落固定顺序：Argument -> Rule -> Rewrite -> Script -> MITM
 *    - 段内按分类（part!!、part1..part5、partA..partZ）输出 ✅ X ✅ 标记，
 *      固定顺序：!!、1、2、3、5、A~Z；空分类也保留标记行
 *    - [Argument] 汇总全部拆分文件的 Argument 配置（去重、按显示名排序）
 *    - 每个 APP 输出 # > 显示名 + # hostname 注释 + 规则内容，同分类内按显示名排序
 *    - [MITM] 汇总全部拆分文件的 hostname（去重、按首次出现顺序）为一行
 *      hostname = *.svg, hostname = ...（沿用现有合集的 %APPEND% 形式）
 * 3. 只输出 Loon/plugin/blockAds.plugin。拆分文件里的 Rewrite / Script 已是新语法，
 *
 * 注意：
 * - 拆分文件各自的 #!desc/#!author/#!raw-url/#!tg-channel/#!arguments 不参与聚合，
 *   聚合文件头以当前 blockAds.plugin 的元数据为准
 * - [Argument] 段不是按 APP 块输出，而是汇总全部参数行；
 *   当前 blockAds.plugin 里同时存在 `[Argument]` 和单独的 `[Rule]`/`[Rewrite]`/`[Script]` 段落，
 *   这里按"分之和"原则只输出拆分文件里真实存在的段落
 *
 * 用法：node tools/splitRules/mergeLoon.js
 */

const fs = require('fs').promises;
const path = require('path');
const { syncDb } = require('./syncDb.js');

// 定位项目根目录（tools/splitRules/ 往上两级；可用环境变量覆盖，便于无破坏性测试）
const baseDir = process.env.WOOL_MERGE_BASE_DIR
  ? path.resolve(process.env.WOOL_MERGE_BASE_DIR)
  : path.resolve(__dirname, '../..');

const CONFIG = {
  inputDir: path.join(baseDir, 'Loon', 'plugin', 'split'),
  outputFile: path.join(baseDir, 'Loon', 'plugin', 'blockAds.plugin'),
  dbPath: path.join(baseDir, 'db', 'inaisi.db'),
  repoRawBase: 'https://github.com/fmz200/wool_scripts/raw/main/Loon/plugin/split',
  splitRelPath: 'Loon/plugin/split',
  rawCol: 'loon_raw_url',
  importCol: 'loon_import_url',
  // 段落固定顺序（与现有总文件一致）
  sectionOrder: ['Argument', 'Rule', 'Rewrite', 'Script', 'MITM'],
  // 分类固定顺序（与现有总文件一致：0~9 -> A~Z -> #）
  categoryOrder: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].concat(
    Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
    ['#']
  ),
  // 内置文件头模板（仅当目标文件不存在时使用）
  headerTemplate: [
    '#!name=广告拦截&净化合集',
    '#!desc=(支持约730款APP/小程序)针对部分APP和小程序广告进行拦截，某些APP要清除缓存或者重新安装拦截广告才会生效！规则明细可以查看本插件的注释',
    '#!author=奶思[https://github.com/fmz200]',
    '#!icon=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/AdblockPlus.png',
    '#!category=奶思的模块',
    '#!homepage=https://github.com/fmz200/wool_scripts',
    '#!raw-url=https://github.com/fmz200/wool_scripts/raw/main/Loon/plugin/blockAds.plugin',
    '#!tg-channel=https://t.me/inaisi',
    '#!tag=去广告, fmz200, 奶思',
    '#!system=iOS, iPadOS',
    '#!loon_version =',
    '#!date={date}',
    '#!remark=下方的所有规则都标注了对应的hostname，可能存在错误或者遗漏，欢迎反馈。对于无法/可选MITM的hostname都特别做了“如开启可自行添加主机名”提示，如果提示后面没有标注主机名则包含所有主机名，否则只包含提示语后面的主机名。'
  ],
  // 段落前装饰注释（与现有 blockAds.plugin 的分隔风格一致）
  sectionDecoration: {
    'Argument': [],
    'Rule': [],
    'Rewrite': ['# =====================================', '# 复写', '# ====================================='],
    'Script': ['# =====================================', '# 脚本', '# ====================================='],
    'MITM': ['# =====================================', '# MITM：中间人攻击，解密/跳过相关域名的内容，"-"开头为跳过', '# =====================================']
  }
};

/**
 * 递归获取指定目录下的所有 .lpx 文件路径
 */
async function getFilesInDir(dir) {
  let files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(await getFilesInDir(fullPath));
    } else if (item.name.endsWith('.lpx')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * 解析拆分文件：文件头（#! 字段） + 各段落内容
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
 * 从 [MITM] 段落内容中提取 hostname 列表
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
 * 获取聚合文件头：优先沿用现有 blockAds.plugin 的 #! 元数据，只刷新 #!date
 * @param {{file: string, template: string[]}} headerConfig - 头部来源文件与内置模板
 */
async function getHeaderLines(headerConfig) {
  let headerLines = [];
  try {
    const existing = await fs.readFile(headerConfig.file, 'utf-8');
    for (const line of existing.split('\n')) {
      // 保留整个文件前缀（#! 元数据 + 说明注释），到第一个段落标记为止
      if (/^# >>>/.test(line) || /^\[[^\]]+\]\s*$/.test(line)) break;
      headerLines.push(line);
    }
  } catch (err) {
    // 目标文件不存在，使用内置模板
  }

  if (!headerLines.some((line) => line.startsWith('#!'))) {
    headerLines = headerConfig.template.slice();
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
 * 组装插件全文。规则行按拆分文件原文抄入，不改写语法。
 * @param {object} args
 * @param {Map<string, Map<string, Map<string, object>>>} args.sectionsData
 * @param {Map<string, Map<string, object>>} args.argumentData
 * @param {string[]} args.allHosts
 * @param {string[]} args.orderedSections
 * @param {string[]} args.orderedCategories
 * @param {{file: string, template: string[]}} args.headerConfig
 * @returns {Promise<string[]>}
 */
async function buildPluginText({
  sectionsData,
  argumentData,
  allHosts,
  orderedSections,
  orderedCategories,
  headerConfig
}) {
  const out = [];
  out.push(...(await getHeaderLines(headerConfig)));
  out.push('');

  for (const secKey of orderedSections) {
    if (secKey === '[Argument]') {
      out.push('[Argument]');
      const argLines = [];
      for (const category of orderedCategories) {
        const args = argumentData.get(category);
        if (!args || args.size === 0) continue;
        const sortedArgs = [...args.values()].sort((a, b) =>
          a.displayName.localeCompare(b.displayName, 'zh-CN')
        );
        for (const arg of sortedArgs) {
          argLines.push(`${arg.key} = ${arg.value}`);
        }
      }
      if (argLines.length) {
        out.push(...[...new Set(argLines)]);
      }
      out.push('');
      out.push('');
      continue;
    }

    const decoration = CONFIG.sectionDecoration[secKey] || [];
    if (decoration.length) {
      out.push(...decoration);
    }
    out.push(secKey);

    if (secKey === '[MITM]') {
      out.push(`hostname = ${allHosts.join(', ')}`);
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

  return out;
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
 * 主函数
 */
async function main() {
  console.log('[INFO] 开始聚合 Loon/plugin/split -> blockAds.plugin');

  const files = await getFilesInDir(CONFIG.inputDir);
  if (files.length === 0) {
    console.log('[WARN] 输入文件夹中没有找到任何文件。');
    return;
  }
  console.log(`[INFO] 共找到 ${files.length} 个拆分文件`);

  // sectionsData: [段落名] -> Map(分类 -> Map(显示名 -> {displayName, ruleName, hosts, lines}))
  const sectionsData = new Map();
  // argumentData: 分类 -> Map(显示名 -> [{displayName, key, value}])
  const argumentData = new Map();
  const allHosts = [];
  const hostSet = new Set();
  const usedCategories = new Set();

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf-8');
    const relativePath = path.relative(CONFIG.inputDir, filePath);
    const rawCategory = path.dirname(relativePath).replace(/^part/, '') || '!!';
    // 拆分目录里的 part!! 对应现合集分类标记 ✅ # ✅（与 splitLoon.js 的映射一致）
    const categoryKey = rawCategory === '!!' ? '#' : rawCategory;
    usedCategories.add(categoryKey);

    const ruleName = path.basename(filePath, '.lpx');
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
      if (secKey === '[Argument]') {
        for (const line of secLines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eqIdx = trimmed.indexOf('=');
          const key = eqIdx >= 0 ? trimmed.slice(0, eqIdx).trim() : trimmed;
          if (!key) continue;
          const value = eqIdx >= 0 ? trimmed.slice(eqIdx + 1).trim() : '';
          if (!argumentData.has(categoryKey)) argumentData.set(categoryKey, new Map());
          const args = argumentData.get(categoryKey);
          args.set(key, { displayName, key, value });
        }
        continue;
      }
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

  // 空分类也保留标记行：输出全部固定分类，额外分类追加在后
  const orderedCategories = [...CONFIG.categoryOrder];
  const extraCategories = [...usedCategories].filter((c) => !CONFIG.categoryOrder.includes(c)).sort();
  orderedCategories.push(...extraCategories);

  const out = await buildPluginText({
    sectionsData,
    argumentData,
    allHosts,
    orderedSections,
    orderedCategories,
    headerConfig: { file: CONFIG.outputFile, template: CONFIG.headerTemplate }
  });

  await fs.mkdir(path.dirname(CONFIG.outputFile), { recursive: true });
  await fs.writeFile(CONFIG.outputFile, out.join('\n') + '\n', 'utf-8');

  // 汇总输出
  console.log('[INFO] 各段落 APP 块数量:');
  for (const secKey of orderedSections) {
    if (secKey === '[Argument]') continue;
    const byCategory = sectionsData.get(secKey);
    let count = 0;
    if (byCategory) {
      for (const apps of byCategory.values()) count += apps.size;
    }
    console.log(`  ${secKey}: ${count}`);
  }
  console.log(`[INFO] [Argument] 参数行数: ${new Set([...argumentData.values()].flatMap((m) => [...m.keys()])).size}`);
  console.log(`[INFO] 汇总 MITM hostname 数量（去重后）: ${allHosts.length}`);
  console.log(`[INFO] 输出文件: ${CONFIG.outputFile}（共 ${out.length} 行）`);
  console.log('[SUCCESS] 聚合完成！');
  // 聚合完成后同步数据库：split 目录 -> rule_details 表
  await syncDb({
    inputDir: CONFIG.inputDir,
    outputExt: '.lpx',
    dbPath: CONFIG.dbPath,
    rawCol: CONFIG.rawCol,
    importCol: CONFIG.importCol,
    repoRawBase: CONFIG.repoRawBase,
    splitRelPath: CONFIG.splitRelPath,
    buildImportUrl: (rawUrl) =>
      `https://www.nsloon.com/openloon/import?plugin=${encodeURIComponent(rawUrl)}`
  });
}

// 执行主函数
main().catch((err) => {
  console.error('[FATAL] 脚本执行出错:', err);
  process.exit(1);
});
