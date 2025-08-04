/**
 * @author fmz200
 * @function 微博网页版广告
 * @date 2025-07-31 18:39:08
 */

let url = $request.url;
let body = $response.body;
let obj = JSON.parse(body);

try {
  startAction();
  console.log('广告数据处理完毕🧧🧧');
} catch (e) {
  console.log('脚本运行出现错误，部分广告未去除⚠️');
  console.log('错误信息：' + e.message);
}

$done({body: JSON.stringify(obj)});

function startAction() {
  // 微博热搜
  if (url.includes("/ajax/side/searchBand?")) {
    console.log("处理热搜多余条目💕");
    if (url.includes("type=mine") || url.includes("last_tab=mine")) { // "我的"tab页
      if (obj.data?.realtime) {
        console.log("删除'我的'多余热搜条目💕");
        obj.data.realtime = obj.data.realtime.filter(item => item.rank !== null);
      }
    }
    if (url.includes("type=hot")) { // "热搜"tab页
      if (obj.data?.hotgov) {
        console.log("删除'热搜'多余热搜条目1💕");
        delete obj.data.hotgov;
      }
      if (obj.data?.hotgovs) {
        console.log("删除'热搜'多余热搜条目2💕");
        delete obj.data.hotgovs;
      }
      if (obj.data?.realtime) {
        console.log("删除'热搜'多余热搜条目3💕");
        obj.data.realtime = obj.data.realtime.filter(item => item.is_ad !== 1);
      }
    }
  }
}

