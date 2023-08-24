/**
 * 此代码将遍历源文件夹下的所有图片文件，将图片的四个角设置为圆角后输出到目标文件夹，并在控制台打印每个处理过的文件路径。
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
console.log(sharp.version);

async function roundCorners(sourceDir, targetDir, cornerRadius) {
  try {
    // 创建目标文件夹
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 读取源文件夹中的所有文件
    const files = fs.readdirSync(sourceDir);

    // 遍历每个文件
    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);

      // 检查文件是否为图片
      if (fs.statSync(sourcePath).isFile() && isImageFile(file)) {
        // 使用sharp库处理图片
        await sharp(sourcePath)
          .resize({ width: sharp.width, height: sharp.height, fit: 'cover', position: 'center' })
          .overlayWith(
            `<svg><rect x="0" y="0" width="100%" height="100%" rx="${cornerRadius}" ry="${cornerRadius}" /></svg>`,
            { cutout: true }
          )
          .toFile(targetPath);

        console.log(`Processed: ${sourcePath} => ${targetPath}`);
      }
    }
  } catch (error) {
    console.error('Error occurred while processing images:', error);
  }
}

// 检查文件是否为图片文件
function isImageFile(file) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  const ext = path.extname(file).toLowerCase();
  return imageExtensions.includes(ext);
}

const sourceDir = './app-icons'; // 替换为源文件夹路径
const targetDir = './app-icons-round'; // 替换为目标文件夹路径
const cornerRadius = 100; // 替换为所需的圆角半径

roundCorners(sourceDir, targetDir, cornerRadius);

