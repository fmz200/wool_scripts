const axios = require('axios');
const fs = require('fs');
const path = require('path');

const urlUSFree = "https://rss.applemarketingtools.com/api/v2/us/apps/top-free/100/apps.json";
const urlUSPaid = "https://rss.applemarketingtools.com/api/v2/us/apps/top-paid/100/apps.json";
const urlCNFree = "https://rss.applemarketingtools.com/api/v2/cn/apps/top-free/100/apps.json";
const urlCNPaid = "https://rss.applemarketingtools.com/api/v2/cn/apps/top-paid/100/apps.json";

const saveFolderUS = "app-icons-us";
const saveFolderUSP = "app-icons-us-p";
const saveFolderCN = "app-icons-cn";
const saveFolderCNP = "app-icons-cn-p";

let appIconUSFree = {link: urlUSFree, folder: saveFolderUS};
let appIconUSPaid = {link: urlUSPaid, folder: saveFolderUS, folderP: saveFolderUSP};
let appIconCNFree = {link: urlCNFree, folder: saveFolderCN};
let appIconCNPaid = {link: urlCNPaid, folder: saveFolderCN, folderP: saveFolderCNP};

// 需要修改的地方
let appIcon = appIconUSPaid;
let saveFolder = appIcon.folderP;

// 运行主函数
main().then(r => console.log('end.'));

// 主函数
async function main() {
  const topAppsData = await getTopApps();
  if (!topAppsData) {
    console.log('Failed to fetch top apps data.');
    return;
  }

  const apps = topAppsData.feed.results;
  // console.log('Top Apps:', apps);

  await saveAppIcons(apps, saveFolder);
}

// 获取软件排行榜数据
async function getTopApps() {
  try {

    const response = await axios.get(appIcon.link);
    return response.data;
  } catch (error) {
    console.error('Error fetching top apps:', error);
    return null;
  }
}

// 下载文件
async function downloadFile(url, outputPath) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}

// 保存软件图标
async function saveAppIcons(apps, outputFolder) {
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, {recursive: true});
  }

  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    const iconUrl = app.artworkUrl100.replace("100x100bb", "500x500bb");
    const appName = app.name;
    let fileName = `${appName}.png`;
    // 处理图片名称，去掉软件的介绍
    fileName = extractFilename(fileName);
    const outputPath = path.join(outputFolder, fileName);

    await downloadFile(iconUrl, outputPath);

    console.log('texon saved:', outputPath);
  }
}

function extractFilename(fileName) {
  const punctuationRegex = /[^\u4e00-\u9fa5\w\s-]/g; // 匹配非中文、非字母、非数字、非空格、非连字符的标点符号
  const match = fileName.match(punctuationRegex); // 查找第一个匹配的标点符号
  if (match) {
    const index = fileName.indexOf(match[0]); // 获取标点符号的索引
    let newN = fileName.substring(0, index); // 返回标点符号前面的内容作为新的文件名
    newN = processString(newN);
    fileName = newN + fileName.substring(fileName.lastIndexOf(".")); // 加上文件后缀

    return fileName;
  } else {
    fileName = processString(fileName);
    return fileName; // 如果没有标点符号，则返回原始文件名
  }
}

function processString(str) {
  // 去除所有空格
  const withoutSpaces = str.replace(/\s/g, '');

  // 判断是否存在 '-'，保留 '-' 前面的内容
  if (withoutSpaces.includes('-')) {
    return withoutSpaces.split('-')[0];
  }

  // 如果不存在特定规则，则返回原始字符串
  return withoutSpaces;
}
