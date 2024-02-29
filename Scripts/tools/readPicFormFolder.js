const fs = require('fs');
const path = require('path');

// 递归遍历文件夹
function traverseFolder(folderPath, callback) {
  fs.readdirSync(folderPath).forEach((file) => {
    const fullPath = path.join(folderPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseFolder(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

// 检查是否为图片文件
function isImageFile(filePath) {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp'];
  const ext = path.extname(filePath).toLowerCase();
  return imageExtensions.includes(ext);
}

// 复制图片文件到目标文件夹
function copyImageToDestination(imagePath, destinationFolder) {
  const fileName = path.basename(imagePath);
  const destinationPath = path.join(destinationFolder, fileName);

  fs.copyFileSync(imagePath, destinationPath);
  console.log(`Copied ${fileName} to ${destinationFolder}`);
}

// 主函数
function main(sourceFolder, destinationFolder) {
  traverseFolder(sourceFolder, (filePath) => {
    if (isImageFile(filePath)) {
      copyImageToDestination(filePath, destinationFolder);
    }
  });
}

// 使用示例
const sourceFolder = 'D:\\softwareFiles\\WeChat';
const destinationFolder = path.join(path.dirname(sourceFolder), 'allPictures');

if (!fs.existsSync(destinationFolder)) {
  fs.mkdirSync(destinationFolder);
}

main(sourceFolder, destinationFolder);
