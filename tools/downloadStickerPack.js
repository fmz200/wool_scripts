const fetch = require('node-fetch'); // 在Node.js环境下使用fetch，需要引入node-fetch库

const stickerPackUrl = 'https://t.me/addstickers/D_U_4_fx'; // 贴纸包链接

async function downloadStickerPack(stickerPackUrl) {
  try {
    const response = await fetch(stickerPackUrl);

    if (response.ok) {
      const buffer = await response.buffer();
      // 在这里，你可以将buffer保存为文件或进行进一步的处理
      console.log('贴纸包下载成功！');
    } else {
      console.log('无法下载贴纸包。');
    }
  } catch (error) {
    console.log('下载贴纸包时发生错误：', error);
  }
}

downloadStickerPack(stickerPackUrl);
