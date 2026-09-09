/**
 * mergeShadow.js - 将 Shadowrocket 拆分模块聚合为 blockAds.srmodule 合集
 *
 * 功能说明：
 * 1. 递归读取 Shadowrocket/module/split 文件夹下的所有 *.srmodule 文件
 * 2. 解析每个文件的显示名（#!name=）与各功能段落
 *    （[Rule] / [Header Rewrite] / [URL Rewrite] / [Body Rewrite] / [Map Local] / [Script] / [MITM]）
 * 3. 按固定段落顺序聚合，段落顺序：
 *    [Rule] → [Header Rewrite] → [URL Rewrite] → [Body Rewrite] → [Map Local] → [Script] → [MITM]
 * 4. 每段内按固定分类顺序输出标记（✅ !! ✅、✅ 1 ✅、✅ 2 ✅、✅ 3 ✅、✅ 5 ✅、✅ A ✅~✅ Z ✅），
 *    分类由 part 文件夹后缀确定；每类内按显示名的拼音排序
 * 5. 每个 APP 块输出：# > 显示名、# hostname = 完整主机名列表、规则内容；
 *    主机名来自该 APP 的 [MITM] 段（去掉 %APPEND% 前缀）
 * 6. 全部 APP 的主机名去重后汇总到末尾 [MITM] 段（hostname = %APPEND% ...）
 * 7. 输出 Shadowrocket/module/blockAds.srmodule
 *
 * 依赖：pinyin（用于将中文名转为拼音排序键）
 *
 * 用法：
 * node tools/splitRules/mergeShadow.js
 */

const fs = require('fs').promises;
const path = require('path');
const { pinyin } = require('pinyin');

// 定位项目根目录（tools/splitRules/ 往上两级）
const baseDir = path.resolve(__dirname, '../..');

// --- 1. 配置区域 ---
const CONFIG = {
  // 输入目录：Shadowrocket 拆分模块
  inputDir: path.join(baseDir, 'Shadowrocket', 'module', 'split'),
  // 输出文件
  outputPath: path.join(baseDir, 'Shadowrocket', 'module', 'blockAds.srmodule'),
  // 聚合文件提交到远端后的 raw 链接（写入文件头）
  rawUrl: 'https://github.com/fmz200/wool_scripts/raw/main/Shadowrocket/module/blockAds.srmodule'
};

// 段落固定顺序
const SECTION_ORDER = [
  'Rule',
  'Header Rewrite',
  'URL Rewrite',
  'Body Rewrite',
  'Map Local',
  'Script',
  'MITM'
];

// 分类固定顺序（对应 part!!, part1, part2, part3, part5, partA~partZ）
const CATEGORY_ORDER = [
  '!!', '1', '2', '3', '5',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

// 聚合文件头模板（沿用 Surge blockAds.module 的合集头）
function buildHeader() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  return [
    '#!name=广告拦截&净化合集',
    '#!desc=(支持约730款APP/小程序)针对部分APP和小程序广告进行拦截，某些APP要清除缓存或者重新安装拦截广告才会生效！规则明细可以查看本插件的注释',
    '#!author=奶思[https://github.com/fmz200]',
    '#!icon=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/AdblockPlus.png',
    '#!category=奶思的模块',
    '#!homepage=https://github.com/fmz200/wool_scripts',
    `#!raw-url=${CONFIG.rawUrl}`,
    '#!tg-channel=https://t.me/inaisi',
    '#!tag=去广告, fmz200, 奶思',
    '#!system=ios',
    `#!date=${dateStr}`,
    '#!remark=下方的所有规则都标注了对应的hostname，可能存在错误或者遗漏，欢迎反馈。对于无法/可选MITM的hostname都特别做了“如开启可自行添加主机名”提示，如果提示后面没有标注主机名则包含所有主机名，否则只包含提示语后面的主机名。',
    '#!arguments=12306_enable:true',
    '',
    '',
    ''
  ].join('\n');
}

/**
 * 递归获取指定目录下的所有 .srmodule 文件路径
 * @param {string} dir - 要遍历的目录路径
 * @returns {Promise<string[]>} 文件完整路径数组
 */
async function getFilesInDir(dir) {
  let files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(await getFilesInDir(fullPath));
    } else if (item.name.endsWith('.srmodule')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * 从 [MITM] 段内容中提取主机名列表（去掉 hostname = %APPEND% 前缀）
 * @param {string[]} lines - [MITM] 段内容行
 * @returns {string[]} 主机名列表
 */
function extractHosts(lines) {
  const hosts = [];
  for (const line of lines) {
    if (!/^hostname\s*=/.test(line)) continue;
    const value = line.replace(/^hostname\s*=\s*/, '').replace(/^%APPEND%\s*/, '');
    for (const item of value.split(',')) {
      const host = item.trim();
      if (host) hosts.push(host);
    }
  }
  return hosts;
}

/**
 * 解析单个拆分文件
 * @param {string} content - 文件内容
 * @param {string} relativeDir - 相对目录（用于确定分类，如 partA）
 * @returns {{name: string, category: string, sections: Map<string, string[]>, hosts: string[]}}
 */
function parseModule(content, relativeDir) {
  const nameMatch = content.match(/^#!name=(.+)$/m);
  const name = nameMatch ? nameMatch[1].trim() : path.basename(relativeDir, '.srmodule');
  const category = relativeDir.replace(/^part/, '') || '!!';

  const sections = new Map();
  const lines = content.split('\n');
  let currentSection = null;

  for (const line of lines) {
    const secMatch = line.match(/^\[(.+)\]$/);
    if (secMatch) {
      currentSection = secMatch[1].trim();
      if (!sections.has(currentSection)) sections.set(currentSection, []);
      continue;
    }
    // 文件头（#!...）与段落之前的内容直接跳过
    if (!currentSection) continue;
    sections.get(currentSection).push(line);
  }

  // 去掉每个段落首尾的空行，保留段内空行
  for (const [sec, secLines] of sections.entries()) {
    let start = 0;
    let end = secLines.length;
    while (start < end && secLines[start].trim() === '') start++;
    while (end > start && secLines[end - 1].trim() === '') end--;
    sections.set(sec, secLines.slice(start, end));
  }

  const hosts = sections.has('MITM') ? extractHosts(sections.get('MITM')) : [];
  // MITM 段不参与逐 APP 块输出
  sections.delete('MITM');

  return { name, category, sections, hosts };
}

/**
 * 生成显示名的拼音排序键：中文转拼音（无声调），英文转小写
 * @param {string} name - 显示名
 * @returns {string} 排序键
 */
function sortKey(name) {
  try {
    const key = pinyin(name, { style: 0, heteronym: false })
      .map((tokens) => tokens[0])
      .join('')
      .toLowerCase();
    return key || name.toLowerCase();
  } catch (err) {
    return name.toLowerCase();
  }
}

/**
 * 分类内按显示名的拼音排序（与 blockAds.module 的排序习惯一致，
 * 英文在前，中文按拼音）
 * @param {{name: string}[]} apps
 */
function sortApps(apps) {
  return apps.sort((a, b) => {
    const keyA = sortKey(a.name);
    const keyB = sortKey(b.name);
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * 生成一个分类的文本（标记 + APP 块）
 * @param {string} category - 分类标记
 * @param {{name: string, hosts: string[], sectionLines: string[]}[]} apps - 该分类下的 APP
 * @returns {string}
 */
function buildCategory(category, apps) {
  const blocks = apps.map((app) => {
    const lines = [`# > ${app.name}`];
    if (app.hosts.length > 0) {
      lines.push(`# hostname = ${app.hosts.join(', ')}`);
    }
    lines.push(...app.sectionLines);
    return lines.join('\n');
  });

  // 分类标记后接 3 个空行；APP 块之间 1 个空行
  return `# >>>>>>>>>>>>>>> ✅ ${category} ✅ <<<<<<<<<<<<<<\n${blocks.join('\n\n')}\n\n\n`;
}

/**
 * 生成一个功能段落的文本
 * @param {string} sectionName - 段落名
 * @param {Map<string, {name: string, hosts: string[], sectionLines: string[]}[]>} appsByCategory
 * @returns {string}
 */
function buildSection(sectionName, appsByCategory) {
  let text = `# >>>>>>>>>>>>>>> 🟣 <<<<<<<<<<<<<<\n[${sectionName}]\n`;
  for (const category of CATEGORY_ORDER) {
    const apps = appsByCategory.get(category);
    if (!apps || apps.length === 0) {
      // 空分类也保留标记
      text += `# >>>>>>>>>>>>>>> ✅ ${category} ✅ <<<<<<<<<<<<<<\n\n\n\n`;
      continue;
    }
    text += buildCategory(category, sortApps(apps));
  }
  return text;
}

/**
 * 主函数
 */
async function main() {
  console.log('[INFO] 开始聚合 Shadowrocket 拆分模块 -> blockAds.srmodule');
  try {
    const allFiles = await getFilesInDir(CONFIG.inputDir);
    if (allFiles.length === 0) {
      console.log('[WARN] 输入文件夹中没有找到任何文件。');
      return;
    }
    console.log(`[INFO] 共找到 ${allFiles.length} 个文件，开始解析...`);

    // 段落名 -> 分类 -> APP 列表
    const sectionData = new Map();
    // 全局主机名（去重，保持首次出现顺序）
    const allHosts = [];
    const hostSet = new Set();

    for (const filePath of allFiles) {
      const relativePath = path.relative(CONFIG.inputDir, filePath);
      const relativeDir = path.dirname(relativePath);
      const content = await fs.readFile(filePath, 'utf-8');
      const app = parseModule(content, relativeDir);

      for (const [sec, secLines] of app.sections.entries()) {
        if (!sectionData.has(sec)) sectionData.set(sec, new Map());
        const appsByCategory = sectionData.get(sec);
        if (!appsByCategory.has(app.category)) appsByCategory.set(app.category, []);
        appsByCategory.get(app.category).push({
          name: app.name,
          hosts: app.hosts,
          sectionLines: secLines
        });
      }

      for (const host of app.hosts) {
        if (!hostSet.has(host)) {
          hostSet.add(host);
          allHosts.push(host);
        }
      }
    }

    // 组装输出
    let output = buildHeader();
    for (const sectionName of SECTION_ORDER) {
      if (sectionName === 'MITM') continue; // MITM 单独输出
      const appsByCategory = sectionData.get(sectionName);
      if (!appsByCategory) continue;
      output += buildSection(sectionName, appsByCategory);
    }

    // 末尾 [MITM]：全部主机名去重汇总
    output += `# >>>>>>>>>>>>>>> 🟣 <<<<<<<<<<<<<<\n[MITM]\nhostname = %APPEND% ${allHosts.join(', ')}\n`;

    // 确保输出目录存在并写入
    await fs.mkdir(path.dirname(CONFIG.outputPath), { recursive: true });
    await fs.writeFile(CONFIG.outputPath, output, 'utf-8');

    // 统计
    const totalBlocks = [...sectionData.values()].reduce(
      (sum, appsByCategory) => sum + [...appsByCategory.values()].reduce((s, apps) => s + apps.length, 0),
      0
    );
    console.log(`[INFO] 共聚合 APP 块 ${totalBlocks} 个（覆盖 ${allFiles.length} 个文件）`);
    console.log(`[INFO] 去重后主机名 ${allHosts.length} 个`);
    console.log(`[SUCCESS] 已生成: ${CONFIG.outputPath}`);
  } catch (error) {
    console.error('[FATAL] 脚本执行过程中发生错误:', error);
    process.exit(1);
  }
}

// 执行主函数
main();
