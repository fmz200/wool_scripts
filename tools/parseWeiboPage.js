const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 微博链接
const weiboUrl = 'https://weibo.com/1785396774/4902148368764889';

// 获取微博页面内容
async function getWeiboPage(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching weibo page:', error);
    return null;
  }
}

// 解析微博页面内容，提取图片和视频链接
function parseWeiboPage(pageContent) {
  // 使用正则表达式提取图片链接和视频链接
  const imageRegex = /"url":"(http[^"]+\.(?:jpg|jpeg|png|gif))"/g;
  const videoRegex = /"url":"(http[^"]+\.(?:mp4))"/g;

  const images = [];
  const videos = [];

  let match;
  while ((match = imageRegex.exec(pageContent))) {
    images.push(match[1]);
  }
  while ((match = videoRegex.exec(pageContent))) {
    videos.push(match[1]);
  }

  return {images, videos};
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

// 保存图片和视频文件
async function saveFiles(urls, outputFolder) {
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, {recursive: true});
  }

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const fileName = path.basename(url);
    const outputPath = path.join(outputFolder, fileName);

    await downloadFile(url, outputPath);

    console.log('File saved:', outputPath);
  }
}

// 主函数
async function main() {
  const pageContent = await getWeiboPage(weiboUrl);
  if (!pageContent) {
    console.log('Failed to fetch weibo page.');
    return;
  }

  const {images, videos} = parseWeiboPage(pageContent);

  console.log('Found images:', images);
  console.log('Found videos:', videos);

  await saveFiles(images, 'images');
  await saveFiles(videos, 'videos');
}

// 运行主函数
main();
