/**
 * author@fmz200
 * 参考@zmqcherish 的脚本
 * 1、删除发现页顶部热搜模块的广告条目
 * 2、删除发现页的轮播广告图(对比了广告和正常的数据，没有区别，所以直接删掉轮播图模块)
 * 抓包url：https://api.weibo.cn/2/search/(finder|container_timeline|container_discover)
 *
 * 配置QX重写：在[rewrite_remote]下填写👇🏻配置
 * https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/rewrite/weibo.snippet, tag=微博移除发现页广告@fmz200, update-interval=172800, opt-parser=false, enabled=true
 */

const url1 = '/search/finder';
const url2 = '/search/container_timeline';
const url3 = '/search/container_discover';

var body = $response.body;
var url = $request.url;
body = modifyMain(url, body);
$done({body});

function modifyMain(url, data) {
  let dataModify = JSON.parse(data);
  // 1、首次点击发现按钮
  if (url.indexOf(url1) > -1) {
    if (dataModify.channelInfo && dataModify.channelInfo.channels && dataModify.channelInfo.channels[0].payload
      && dataModify.channelInfo.channels[0].payload.items && dataModify.channelInfo.channels[0].payload.items[1].data) {
      // 1.1、下标是1的为热搜模块
      console.log('进入发现页，移除热搜广告💕💕');
      dataModify.channelInfo.channels[0].payload.items[1].data.group
        = removeHotSearchAds(dataModify.channelInfo.channels[0].payload.items[1].data.group);

      // 1.2、下标为2的是轮播图模块
      dataModify.channelInfo.channels[0].payload.items[2] = {};
      console.log('进入发现页，移除轮播模块💕💕');
      return JSON.stringify(dataModify);
    }
  }

  // 2、发现页面刷新/再次点击发现按钮
  if (url.indexOf(url2) > -1 || url.indexOf(url3) > -1) {
    // 2.1、下标是1的为热搜模块
    console.log('刷新发现页，移除微博热搜广告🤣🤣');
    dataModify.items[1].data.group = removeHotSearchAds(dataModify.items[1].data.group);

    // 2.2、下标为2的是轮播图模块
    console.log('刷新发现页，移除轮播图模块🤣🤣');
    dataModify.items[2] = {};

    // 2.3、items[i].category = "feed" 是热门微博的部分
    console.log('刷新发现页，移除热门微博广告🤣🤣');
    dataModify.items = removeCategoryFeedAds(dataModify.items);

    return JSON.stringify(dataModify);
  }

  console.log('没有广告数据🧧🧧');
  return data;
}

function removeHotSearchAds(groups) {
  console.log('移除发现页热搜广告开始💕');
  let newGroups = [];
  for (let group of groups) {
    // group.item_log.search_flag || group.item_log.nav
    if (group && group.item_log && group.item_log.adid) { // 广告没有search_flag字段，只有group.item_log.adid
      continue;
    }
    newGroups.push(group);
  }
  console.log('移除发现页热搜广告结束💕💕');
  return newGroups;
}

// 移除“热搜微博”信息流的广告
function removeCategoryFeedAds(items) {
  console.log('移除发现页热门微博广告开始💕');
  let newItems = [];
  for (let item of items) {
    if (item.category == "feed" && item.data && item.data.mblogtypename == "广告") {
      continue;
    }
    newItems.push(item);
  }
  console.log('移除发现页热门微博广告结束💕💕');
  return newItems;
}
