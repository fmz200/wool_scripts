const fs = require('fs');

function readAndParseJSON() {
  try {
    const filePath = '../boxjs/fmz200_gallery.json';
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    const tasks = jsonData["task"];

    for (let item of tasks) {
      const expression = convertToCronExpression(item);
      console.log(/*"转换后：" + */expression);
    }

    // 遍历属性值
    // for (let key in jsonData) {
    //   const value = jsonData[key];
    //   console.log(`${key}: ${value}`);
    // }
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
  }
}

readAndParseJSON();

function convertToCronExpression(data) {
  //console.log("初始值：" + data);
  data = "cron=" + data.replace("https", ",script-path=https");
  // console.log("转换前：" + data);
  const parts = data.split(',');

  let cronExp = '';
  let scriptPath = '';
  let timeout = '300';
  let tag = '';
  let imgUrl = '';
  let enabled = '';

  for (let part of parts) {
    const keyValue = part.trim().split('=');
    const key = keyValue[0].trim();
    const value = keyValue[1];

    switch (key) {
      case 'cron':
        cronExp = value;
        break;
      case 'script-path':
        scriptPath = value;
        break;
      case 'tag':
        tag = value;
        break;
      case 'img-url':
        imgUrl = value;
        break;
      case 'enabled':
        enabled = value;
        break;
      default:
        break;
    }
  }

  return `cron "${cronExp}" script-path=${scriptPath}, timeout=${timeout}, tag=${tag}, img-url=${imgUrl}, enabled=${enabled}`;
}
