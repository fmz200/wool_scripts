/**
 * syncDb.js - 把 split 目录下的规则文件实时同步到 rule_details 表
 *
 * 设计要点（方案 A）：
 * 1. 每个 merge 脚本聚合完成后调用 syncDb()，按"文件 = 表行"同步。
 * 2. rule_name 主键 = 文件名去扩展名。
 * 3. 清理（删除/缺失）只作用于数据库中确实指向该工具 split 目录的记录，
 *    通过 <rawCol> LIKE '%/<splitRelPath>/%' 做作用域限定，
 *    不会误清 split 目录之外的配置/规则文件（如 Loon/rule/*.list、聚合文件等）。
 * 4. 清理用"置 NULL"而非物理 DELETE，保留 rule_name 主键与公共字段，
 *    避免误删其他工具共用的同一行。
 */

const fs = require('fs').promises;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

/**
 * 递归收集指定目录下指定扩展名的文件
 * @returns {Promise<{fullPath: string, relPath: string}[]>}
 */
async function getFilesInDir(dir, ext, rootDir = dir) {
  const out = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      out.push(...(await getFilesInDir(fullPath, ext, rootDir)));
    } else if (item.name.endsWith(ext)) {
      out.push({ fullPath, relPath: path.relative(rootDir, fullPath) });
    }
  }
  return out;
}

/**
 * 从拆分文件内容提取 #!name 字段
 */
function extractName(content) {
  const m = content.match(/^#!name=(.+)$/m);
  return m ? m[1].trim() : '';
}

/**
 * 从相对路径提取分类 part：partXX -> XX，part!! -> #
 * @param {string} relPath 形如 partW/AppName.lpx
 */
function extractPart(relPath) {
  const dir = path.dirname(relPath);
  const m = dir.match(/^part(.+)$/);
  if (!m) return '!!';
  const raw = m[1];
  return raw === '!!' ? '#' : raw;
}

/**
 * 执行一个 db.run 的 Promise 封装
 */
function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}
function get(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });
}

/**
 * 主入口：同步一个工具 split 目录到数据库
 */
async function syncDb(cfg) {
  const {
    inputDir,
    outputExt,
    dbPath,
    rawCol,
    importCol,
    extraRawCol,
    extraImportCol,
    repoRawBase,
    splitRelPath,
    buildImportUrl = (rawUrl) => rawUrl,
    log = (...args) => console.log(...args)
  } = cfg;

  if (!inputDir || !dbPath || !rawCol || !importCol || !repoRawBase || !splitRelPath) {
    throw new Error('[syncDb] 缺少必要配置项');
  }

  const files = await getFilesInDir(inputDir, outputExt);
  const currentNames = new Set();

  const db = new sqlite3.Database(dbPath);

  try {
    let upserted = 0;
    for (const { fullPath, relPath } of files) {
      const ruleName = path.basename(fullPath, outputExt);
      // 优先复用库中已有的规范名（大小写不敏感），避免磁盘小写名与库中大写名产生双行
      const existingRow = await get(db, 'SELECT rule_name FROM rule_details WHERE rule_name = ? COLLATE NOCASE LIMIT 1', [ruleName]);
      const dbRuleName = existingRow ? existingRow.rule_name : ruleName;
      currentNames.add(dbRuleName.toLowerCase());
      currentNames.add(ruleName.toLowerCase());

      const content = await fs.readFile(fullPath, 'utf-8');
      const cnName = extractName(content) || ruleName;
      const part = extractPart(relPath);

      const rawUrl = `${repoRawBase}/part${part}/${ruleName}${outputExt}`;
      const importUrl = buildImportUrl(rawUrl, cnName);

      const upsertCols = [rawCol, importCol];
      const upsertVals = [rawUrl, importUrl];
      const extra = (extraRawCol && extraImportCol) ? [{ raw: extraRawCol, import: extraImportCol }] : [];

      const setList = [
        'cn_name = excluded.cn_name',
        'part = excluded.part',
        `${rawCol} = excluded.${rawCol}`,
        `${importCol} = excluded.${importCol}`,
        "update_time = datetime('now','localtime')"
      ];
      const insertCols = ['rule_name', 'cn_name', 'part', ...upsertCols];
      const insertPlaceholders = ['?', '?', '?', ...upsertCols.map(() => '?')];
      const insertParams = [dbRuleName, cnName, part, ...upsertVals];

      for (const e of extra) {
        insertCols.push(e.raw, e.import);
        insertPlaceholders.push('?', '?');
        insertParams.push(rawUrl, importUrl);
        setList.push(`${e.raw} = excluded.${e.raw}`, `${e.import} = excluded.${e.import}`);
      }

      const sql = `INSERT INTO rule_details
        (${insertCols.join(', ')}, create_time, update_time)
        VALUES (${insertPlaceholders.join(', ')}, datetime('now','localtime'), datetime('now','localtime'))
        ON CONFLICT(rule_name) DO UPDATE SET ${setList.join(', ')}`;

      await run(db, sql, insertParams);
      upserted++;
    }

    // 作用域限定的清理：只处理确实指向本工具 split 目录的记录
    const scopePattern = `%/${splitRelPath}/%`;
    const staleRows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT rule_name, ${rawCol} AS raw FROM rule_details
         WHERE ${rawCol} IS NOT NULL AND ${rawCol} LIKE ?`,
        [scopePattern],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });

    let cleaned = 0;
    for (const row of staleRows) {
      if (currentNames.has(row.rule_name.toLowerCase())) continue;
      const nullSet = [`${rawCol} = NULL`, `${importCol} = NULL`, "update_time = datetime('now','localtime')"];
      if (extraRawCol && extraImportCol) {
        nullSet.push(`${extraRawCol} = NULL`, `${extraImportCol} = NULL`);
      }
      await run(db, `UPDATE rule_details SET ${nullSet.join(', ')} WHERE rule_name = ?`, [row.rule_name]);
      cleaned++;
    }

    log(`[syncDb] ${splitRelPath}: upsert ${upserted} 行，清理缺失 ${cleaned} 行`);
  } finally {
    await new Promise((resolve) => db.close(resolve));
  }
}

module.exports = { syncDb };
