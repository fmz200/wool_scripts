const fs = require('fs');
const path = require('path');

const currentFolderPath = __dirname;
console.log('当前项目运行的文件夹路径：', currentFolderPath);

const name = "app-icons-free-cn";
const folderPath = `${currentFolderPath}/${name}`; // 替换为实际的文件夹路径
const outputPath = `${currentFolderPath}/${name}.json`; // 替换为输出 JSON 文件的路径

const iconFiles = fs.readdirSync(folderPath);

const icons = iconFiles.map(file => {
  const fileName = file.replace('.png', ''); // 去掉文件名的后缀
  const pUrl = `https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/${name}/${file}`;
  return {
    "name": fileName,
    "url": pUrl
  };
});

const jsonData = JSON.stringify(icons, null, 2);

fs.writeFileSync(outputPath, jsonData);

console.log('JSON content has been written to output.json.');
