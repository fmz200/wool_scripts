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
const url4 = '/api.weibo.cn/2/page'; // 微博热搜页面url
const url5 = '/statuses/container_timeline_topicpage'; // 微博超话页面 https://api.weibo.cn/2/statuses/container_timeline_topicpage

let index = 1;
let url = $request.url;
let body = $response.body;
body = modifyMain(url, body);
$done({body});

function modifyMain(url, data) {
  let data_ = JSON.parse(data);
  // 1、首次点击发现按钮
  if (url.includes(url1)) {
    const channel = data_.channelInfo?.channels?.[0]?.payload;
    if (channel && channel.items && channel.items[1]?.data) {
      console.log('进入发现页...');
      if (channel.items[1].data.itemid === "hot_search_push") {
        index = 2;
      }

      // 1.1、下标是1的为热搜模块
      channel.items[index].data.group = removeHotSearchAds(channel.items[index].data.group);

      // 1.2、下标为2的是轮播图模块
      console.log('移除轮播模块💕💕');
      channel.items[index + 1] = {};

      // 1.3、items[i].category = "feed" 是热门微博的部分
      channel.items = removeCategoryFeedAds(channel.items);

      return JSON.stringify(data_);
    }
  }

  // 2、发现页面刷新/再次点击发现按钮
  if (url.includes(url2) || url.includes(url3)) {
    console.log('刷新发现页...');
    if (data_.items[1].data.itemid == "hot_search_push") {
      index = 2;
    }

    // 2.1、下标是1的为热搜模块
    data_.items[index].data.group = removeHotSearchAds(data_.items[index].data.group);

    // 2.2、下标为2的是轮播图模块
    console.log('移除轮播图模块🤣🤣');
    data_.items[index + 1] = {};

    // 2.3、items[i].category = "feed" 是热门微博的部分
    data_.items = removeCategoryFeedAds(data_.items);

    return JSON.stringify(data_);
  }

  // 3、微博热搜页面刷新
  if (url.includes(url4) && data_.cards && data_.cards[0].card_group) {
    console.log('微博热搜页面广告开始💕');
    data_.cards[0].card_group = data_.cards[0].card_group.filter(group => group.promotion == null);
    console.log('微博热搜页面广告结束💕💕');
    return JSON.stringify(data_);
  }

  // 4、微博超话页面
  if (url.includes(url5) && data_.items) {
    console.log('微博超话页面广告开始💕');
    data_.items = data_.items.filter(item => !item.data || item.data.mblogtypename !== "广告");
    console.log('微博超话页面广告结束💕💕');
    return JSON.stringify(data_);
  }

  console.log('没有广告数据🧧🧧');
  return data;
}

// 移除“微博热搜”的广告
function removeHotSearchAds(groups) {
  console.log('移除发现页热搜广告开始💕');
  const newGroups = groups.filter(group => !(group && group.item_log && group.item_log.adid));
  console.log('移除发现页热搜广告结束💕💕');
  return newGroups;
}

// 移除“热搜微博”信息流的广告
function removeCategoryFeedAds(items) {
  console.log('移除发现页热门微博广告开始💕');
  const newItems = items.filter(item => item.category !== "feed" || (item.data && item.data.mblogtypename !== "广告"));
  console.log('移除发现页热门微博广告结束💕💕');
  return newItems;
}
