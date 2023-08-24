const fs = require('fs');
const axios = require('axios');
const readline = require('readline');

// 输入文件和输出文件路径
const inputFile = '/Users/king/Project-Web/wool_scripts/Loon/scripts/get_cookie.scripts';
const outputFile = '/Users/king/Project-Web/wool_scripts/Loon/scripts/get_cookie.scripts.output.txt';

// 创建读取文件流
const fileStream = fs.createReadStream(inputFile);

// 创建逐行读取的接口
const rl = readline.createInterface({
  input: fileStream,
  output: process.stdout,
  terminal: false
});

// 创建写入文件流
const writeStream = fs.createWriteStream(outputFile);

// 检测 GitHub 网址的内容是否存在
async function checkGitHubUrlExists(url) {
  try {
    const response = await axios.head(url);
    return response.status === 200; // 如果状态码为 200，则资源存在
  } catch (error) {
    console.log(`异常网址：${url}，错误信息：${error}`);
    return false; // 请求出错或状态码不为 200，资源不存在
  }
}

// 逐行读取文件并处理
rl.on('line', async (line) => {
  // 检查是否以#开头的行
  if (!line.startsWith('#')) {
    // 检查是否包含script-path=
    if (line.includes('script-path=')) {
      const startIndex = line.indexOf('script-path=');
      const endIndex = line.indexOf(',', startIndex);

      if (endIndex === -1) {
        // 如果没有逗号，则直接将整行写入输出文件
        writeStream.write(line + '\n');
        return;
      }

      const scriptPath = line.substring(startIndex + 12, endIndex); // 12是"script-path=".length
      console.log(`检测到网址：${scriptPath}`);
      // 检查脚本路径是否存在
      const githubResourceExists = await checkGitHubUrlExists(scriptPath);

      if (!githubResourceExists) {
        writeStream.write(`#${line}\n`);
      } else {
        writeStream.write(line + '\n');
      }
    } else {
      // 没有包含script-path=，直接写入原内容到输出文件
      writeStream.write(line + '\n');
    }
  } else {
    // 以#开头的行直接写入原内容到输出文件
    writeStream.write(line + '\n');
  }
});

// 结束时关闭写入流
rl.on('close', () => {
  writeStream.end();
});
