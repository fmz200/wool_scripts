/**
 * 执行此代码将递归地将源文件夹中的所有文件复制到目标文件夹中，并在控制台打印每个复制的文件路径。
 */

const fs = require('fs');
const path = require('path');
const {copyFile, mkdir} = fs.promises;

async function copyFilesRecursively(sourceDir, targetDir) {
  try {
    await mkdir(targetDir, {recursive: true});

    const files = await fs.promises.readdir(sourceDir);
    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);

      const stat = await fs.promises.stat(sourcePath);
      if (stat.isDirectory()) {
        await copyFilesRecursively(sourcePath, targetPath);
      } else {
        await copyFile(sourcePath, targetPath);
        console.log(`Copied: ${sourcePath} to ${targetPath}`);
      }
    }
  } catch (error) {
    console.error('Error occurred while copying files:', error);
  }
}

const sourceDir = '/Users/king/Downloads/emby-icon-main';
const targetDir = '/Users/king/Downloads/emby-icon-main-01';

copyFilesRecursively(sourceDir, targetDir);
