const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function cropImages() {
  const inputDir = '../icons/Stickers';
  const outputDir = '../icons/menhera/pic2';

  // 创建输出目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // 读取输入目录中的图片文件
  const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));

  for (let file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    // 使用sharp库读取图片信息
    const metadata = await sharp(inputPath).metadata();
    const {width, height} = metadata;

    // 计算裁剪尺寸
    const size = Math.min(width, height);
    const left = Math.floor((width - size) / 2);
    const top = Math.floor((height - size) / 2);

    // 执行裁剪操作
    await sharp(inputPath)
      .extract({left, top, width: size, height: size})
      .toFile(outputPath);
  }

  console.log('裁剪完成！');
}

// 调用方法进行裁剪
cropImages();
