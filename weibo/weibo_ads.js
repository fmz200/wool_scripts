/**
 * author:fmz200
 * date:2023-09-09 13:13:13
 * 配置QX重写：在[rewrite_remote]下填写👇🏻配置
 * https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/rewrite/weibo.snippet, tag=微博移除发现页广告@fmz200, update-interval=172800, opt-parser=false, enabled=true
 */

const url1 = '/search/finder';
const url2 = '/search/container_timeline'; // 发现页面
const url3 = '/search/container_discover';
const url4 = '/api.weibo.cn/2/page'; // 微博热搜页面url
const url5 = '/statuses/container_timeline_topicpage'; // 微博超话页面
const url6 = '/statuses/extend'; // 微博详情页面广告

const weiboPic = [
  "https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/Weibo-01.png",
  "https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/Weibo-27.png",
  "https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/Weibo-30.png",
  "https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/Weibo-32.png"
]

let index = 1;
let url = $request.url;
let body = $response.body;
try {
  body = modifyMain(url, body);
} catch (e) {
  console.log('脚本运行出现错误，返回源数据⚠️');
  console.log('错误信息：' + e.message);
}
$done({body});

function modifyMain(url, data) {
  let resp_data = JSON.parse(data);
  // 1、首次点击发现按钮
  if (url.includes(url1)) {
    const payload = resp_data.channelInfo?.channels?.[0]?.payload;
    console.log('进入发现页...');
    if (payload.items[1].data.itemid === "hot_search_push") {
      index = 2;
    }

    // 1.1、下标是1的为热搜模块
    payload.items[index].data.group = removeHotSearchAds(payload.items[index].data.group);

    // 1.2、下标为2的是轮播图模块
    console.log('移除轮播模块💕💕');
    payload.items[index + 1] = {};

    // 1.3、下标为3的是热议模块
    console.log('移除finder_channel模块💕💕');
    if (payload.items[index + 2].data?.more_pic?.includes('ads')) {
      payload.items[index + 2].data.more_pic = getRandomWeiboPic();
    }
    payload.items[index + 2].data.group = removeFinderChannelAds(payload.items[index + 2].data.group);

    // 1.4、items[i].category = "feed" 是热门微博的部分
    payload.items = removeCategoryFeedAds(payload.items);

    // 1.5、背景图广告
    if (payload.loadedInfo?.headerBack?.channelStyleMap) {
      processChannelStyleMap(payload.loadedInfo.headerBack.channelStyleMap);
    }

    return JSON.stringify(resp_data);
  }

  // 2、发现页面刷新/再次点击发现按钮
  if (url.includes(url2) || url.includes(url3)) {
    console.log('刷新发现页...');
    if (resp_data.items[1].data.itemid === "hot_search_push") {
      index = 2;
    }

    // 2.1、下标是1的为热搜模块
    resp_data.items[index].data.group = removeHotSearchAds(resp_data.items[index].data.group);

    // 2.2、下标为2的是轮播图模块
    console.log('移除轮播图模块🤣🤣');
    resp_data.items[index + 1] = {};

    // 2.3、下标为3的是热议模块
    if (resp_data.items[index + 2].data.more_pic?.includes('ads')) {
      resp_data.items[index + 2].data.more_pic = getRandomWeiboPic();
    }
    resp_data.items[index + 2].data.group = removeFinderChannelAds(resp_data.items[index + 2].data.group);

    // 2.4、items[i].category = "feed" 是热门微博的部分
    resp_data.items = removeCategoryFeedAds(resp_data.items);

    // 2.5、背景图广告
    if (resp_data.loadedInfo?.headerBack?.channelStyleMap) {
      processChannelStyleMap(resp_data.loadedInfo.headerBack.channelStyleMap);
    }
    return JSON.stringify(resp_data);
  }

  // 3、微博热搜页面刷新
  if (url.includes(url4) && resp_data.cards && resp_data.cards[0].card_group) {
    console.log('微博热搜页面广告开始💕');
    resp_data.cards[0].card_group = resp_data.cards[0].card_group.filter(group => group.promotion == null);
    console.log('微博热搜页面广告结束💕💕');
    return JSON.stringify(resp_data);
  }

  // 4、微博超话页面
  if (url.includes(url5) && resp_data.items) {
    console.log('微博超话页面广告开始💕');
    resp_data.items = resp_data.items.filter(item => !item.data || item.data.mblogtypename !== "广告");
    console.log('微博超话页面广告结束💕💕');
    return JSON.stringify(resp_data);
  }

  // 5、微博超话页面
  if (url.includes(url6)) {
    console.log('微博详情页面广告开始💕');
    resp_data.head_cards = [];
    console.log('微博详情页面广告结束💕💕');
    return JSON.stringify(resp_data);
  }

  console.log('没有广告数据🧧🧧');
  return data;
}

// 移除“微博热搜”的广告
function removeHotSearchAds(groups) {
  if (!groups) return;
  console.log('移除发现页热搜广告开始💕');
  const newGroups = groups.filter(group => !(group.item_log && group.item_log.adid));
  console.log('移除发现页热搜广告结束💕💕');
  return newGroups;
}

// 移除“微博热搜”下面的“热聊，本地等”的广告
function removeFinderChannelAds(groups) {
  console.log('移除发现页finder_channel广告开始💕');
  const newGroups = [];
  for (const group of groups) {
    if (group.hasOwnProperty('pic') && typeof group.pic === 'string' && group.pic.includes('ads')) {
      group.pic = getRandomWeiboPic();
    }
    newGroups.push(group);
  }
  console.log('移除发现页finder_channel广告结束💕💕');
  return newGroups;
}

// 移除“热搜微博”信息流的广告
function removeCategoryFeedAds(items) {
  console.log('移除发现页热门微博广告开始💕');
  const newItems = items.filter(item => item.category !== "feed" || (item.data && item.data.mblogtypename !== "广告"));
  console.log('移除发现页热门微博广告结束💕💕');
  return newItems;
}

function processChannelStyleMap(channelStyleMap) {
  if (!channelStyleMap) return;
  console.log('移除发现页背景图广告开始💕');
  for (const propertyName in channelStyleMap) {
    if (channelStyleMap.hasOwnProperty(propertyName) && propertyName.includes('102803')) {
      const property = channelStyleMap[propertyName];
      if (property.hasOwnProperty('data')) {
        property.data.backgroundImage = 'https://simg.s.weibo.com/20220110_advance_bigday_mask.png';
        property.data.backgroundDarkImage = 'https://simg.s.weibo.com/20220110_advance_bigday_mask_dark.png';
      }
    }
  }
  console.log('移除发现页背景图广告结束💕💕');
}

function getRandomWeiboPic() {
  const randomIndex = Math.floor(Math.random() * weiboPic.length);
  return weiboPic[randomIndex];
}
