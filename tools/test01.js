function convertToCronExpression(data) {
  console.log("初始值：" + data);
  data = "cron=" + data.replace("https", ",script-path=https");
  console.log("转换前：" + data);
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
    const value = keyValue[1].trim();

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

const data1 = '0 1 0 * * ? https://raw.githubusercontent.com/lowking/Scripts/master/ali/aliYunPanCheckIn.js, tag=阿里云盘签到, img-url=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/aliYunPan.png, enabled=true';

const result = convertToCronExpression(data1);
console.log("转换后：" + result);
