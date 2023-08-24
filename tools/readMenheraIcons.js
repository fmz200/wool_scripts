const fs = require('fs');
const path = require('path');

function readMenheraIcons() {
  const folderPath = '/Users/king/Project-Web/wool_scripts/tools/taskicon';
  const files = fs.readdirSync(folderPath);

  const icons = files.map(file => {
    const fileName = path.parse(file).name;
    const fileUrl = `https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/app/${file}`;

    return {
      "name": fileName,
      "url": fileUrl
    };
  });

  icons.forEach(icon => {
    console.log(icon);
    console.log(",");
  });

  return icons;
}

// 调用方法获取menhera图标信息
const menheraIcons = readMenheraIcons();

// console.log(menheraIcons);
