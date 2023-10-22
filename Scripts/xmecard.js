let obj =
  {
    "result": {
      "imgUrl": "https://raw.githubusercontent.com/fmz200/wool_scripts/main/pic/pop/p0.jpeg",
      "orderBy": 0,
      "cRule": [{"key": "advTime", "sign": "=", "value": "0", "url": "www.baidu.com"}],
      "id": 465,
      "order": 0,
      "title": "手机e通卡",
      "imgId": null,
      "urlParam": "[]",
      "gCode": "startAdv",
      "subTitle": null,
      "url": "-"
    },
    "flag": 0
  };
let body = JSON.stringify(obj);
$done({body});