let str = "一元机场.com  香港01|专线";
let newStr = str.split("").reverse().join("");
console.log(newStr);

let arr = ['a', 'b', 'c', 'qq', 'b', 'qq', 'wx', 1, 2, 1, 2];
console.log(arr);
let newarr3 = arr.filter(function (ele, index) {
  return arr.indexOf(ele) == index;
});
console.log(newarr3);


function unique(arr) {
  return arr.filter(function (item, index, arr) {
    //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
    return arr.indexOf(item, 0) === index;
  });
}

arr = unique(arr);
console.log(arr);


async function getIpInfo() {
  const url = 'http://ip-api.com/json/?lang=zh-CN&fields=status,message,country,countryCode,query';
  const response = await fetch(url);
  const data = await response.json();
  if (data.status === 'success') {
    const {country, countryCode, query} = data;
    console.log(`IP信息：\nIP地址：${query}\n国家：${country} (${countryCode})`);
  } else {
    console.error(`获取IP信息失败：${data.message}`);
  }
}

getIpInfo();

let obj = JSON.parse($response.body);
obj.data.dataList = obj.data.dataList.filter(i => i.type != "WOW");
obj.data.userTagIdList = obj.data.dataList.size();
// 加一行日志打印obj
console.log("打印json：" + JSON.stringify(obj));
$done({body: JSON.stringify(obj)});