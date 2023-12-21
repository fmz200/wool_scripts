/**
 * @author fmz200
 * @function 微博去广告
 * @date 2023-12-21 09:23:00
 */

const url1 = '/search/finder';
const url2 = '/search/container_timeline'; // 发现页面
const url3 = '/search/container_discover';
const url4 = '/api.weibo.cn/2/page'; // 微博热搜页面url
const url5 = '/statuses/container_timeline_topicpage'; // 微博超话页面
const url6 = '/statuses/extend'; // 微博详情页面广告
const url7 = '/groups/allgroups/v2' // 微博首页Tab标签页 https://api.weibo.cn/2/groups/allgroups/v2

const titleSubPicMap = {
  '电影': 'https://simg.s.weibo.com/imgtool/20221207_dianying.png',
  '热议': 'https://simg.s.weibo.com/20220402_hottopic-icon.png',
  '影像年': 'https://simg.s.weibo.com/ads/1%2Fads_1692185628.png',
  '本地': 'https://simg.s.weibo.com/20190123154142_tongcheng.png',
  '直播': 'https://simg.s.weibo.com/20210705_live0705.png',
  '财经': 'https://simg.s.weibo.com/20190124150415_caijing.png',
  '找人': 'https://simg.s.weibo.com/20190125144608_zhaoren.png',
  '时尚': 'https://simg.s.weibo.com/imgtool/20220928_fashion.png',
  '长文': 'https://simg.s.weibo.com/20220621_%E9%95%BF%E6%96%87%E5%8F%91%E7%8E%B0%E9%A1%B5icon%403x.png',
  '赛事': 'https://simg.s.weibo.com/20201030_%E8%B5%9B%E4%BA%8B.png',
  '教育': 'https://simg.s.weibo.com/20200303_edu0303.png',
  '音乐': 'https://simg.s.weibo.com/imgtool/20221207_yinyue.png',
  '房产': 'https://simg.s.weibo.com/20190129182003_house.png',
  '小游戏': 'https://simg.s.weibo.com/20190118185226_youxi.png',
  '美食': 'https://simg.s.weibo.com/imgtool/20221207_food.png',
  '热聊': 'https://simg.s.weibo.com/20220402_reliao.png',
  '新知': 'https://simg.s.weibo.com/20211105_xinzhi.png',
  '微公益': 'https://simg.s.weibo.com/ads/1%2Fads_1689323535.png',
  '大健康': 'https://simg.s.weibo.com/imgtool/20221116_health.png',
  '活动': 'https://simg.s.weibo.com/20200915_huodong.png',
  '母婴': 'https://simg.s.weibo.com/20210222_mombaby.png',
  '珠宝玉石': 'https://simg.s.weibo.com/20210317_yushi.png',
  '游戏中心': 'https://simg.s.weibo.com/ads/1%2Fads_1687759038.png'
};

let url = $request.url;
let body = $response.body;
try {
  body = process();
} catch (e) {
  console.log('脚本运行出现错误，部分广告未去除⚠️');
  console.log('错误信息：' + e.message);
}
$done({body});

function process() {
  let resp_data = JSON.parse(body);
  // 1、首次点击发现按钮
  if (url.includes(url1)) {
    console.log('进入发现页...');
    processPayload(resp_data.channelInfo.channels[0].payload);
  }

  // 2、发现页面刷新/再次点击发现按钮
  if (url.includes(url2) || url.includes(url3)) {
    console.log('刷新发现页...');
    processPayload(resp_data);
  }

  // 3、微博热搜页面刷新
  if (url.includes(url4) && resp_data.cards && resp_data.cards[0].card_group) {
    resp_data.cards[0].card_group = resp_data.cards[0].card_group.filter(group => group.promotion == null);
    console.log('处理微博热搜页面广告结束💕💕');
  }

  // 4、微博超话页面
  if (url.includes(url5) && resp_data.items) {
    resp_data.items = resp_data.items.filter(item => !item.data || item.data.mblogtypename !== "广告");
    console.log('处理微博超话页面广告结束💕💕');
  }

  // 5、微博超话页面
  if (url.includes(url6)) {
    resp_data.head_cards = [];
    console.log('处理微博详情页面广告结束💕💕');
  }

  // 6、移除微博首页的多余tab页
  if (url.includes(url7)) {
    removePageDataAds(resp_data.pageDatas);
    // 删除恶心人的“全部微博”
    delete resp_data.pageDatas[0].categories[0].pageDatas[0];
    // swapObjectsInArray(resp_data.pageDatas[0].categories[0].pageDatas, 0, 1);
  }

  console.log('广告数据处理完毕🧧🧧');
  return JSON.stringify(resp_data);
}

function processPayload(payload) {
  if (payload.items[0].items) {
    removeCommonAds(payload.items[0].items);
  }

  removeCommonAds(payload.items);
  removeCategoryFeedAds(payload.items);

  if (payload.loadedInfo?.headerBack) {
    delete payload.loadedInfo.headerBack;
  }
}

function removeCommonAds(items) {
  for (let i = 0; i < items.length; i++) {
    // 1.1、"微博热搜"模块
    if (items[i].data?.card_type === 17) {
      console.log('处理微博热搜模块💕💕');
      removeHotSearchAds(items[i].data.group);
    }
    // 1.2、轮播图模块
    if (items[i].data?.card_type === 118 || items[i].data?.card_type === 247) {
      console.log('移除轮播图模块💕💕');
      items[i] = {};
    }
    // 1.3、”热聊、本地、找人“模块
    if (items[i].data?.card_type === 19) {
      console.log('处理热聊、本地、找人模块💕💕');
      delete items[i].data.more_pic;
      removeFinderChannelAds(items[i].data.group);
    }
  }
}

// 移除“微博热搜”的广告
function removeHotSearchAds(groups) {
  if (!groups) return;
  console.log('移除发现页热搜广告开始💕');
  for (let i = groups.length - 1; i >= 0; i--) {
    const group = groups[i];
    if (group.itemid?.includes("is_ad_pos") || group.promotion) {
      groups.splice(i, 1);
    }
  }
  console.log('移除发现页热搜广告结束💕💕');
}

// 移除“微博热搜”下面的“热聊，本地等”的广告
function removeFinderChannelAds(groups) {
  if (!groups) return;
  console.log('移除发现页热聊，本地广告💕');
  for (const group of groups) {
    if (group.pic?.includes('ads')) {
      group.pic = titleSubPicMap[group.title_sub] || "https://simg.s.weibo.com/20200915_huodong.png";
    }
  }
}

// 移除“热搜微博”信息流的广告
function removeCategoryFeedAds(items) {
  console.log('移除发现页热门微博广告💕');
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    if (item.category === "feed" && item.data && item.data.mblogtypename === "广告") {
      items.splice(i, 1);
    }
  }
}

// 移除微博首页的多余tab页
function removePageDataAds(items) {
  console.log('移除微博首页的多余tab页💕');
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    if (item.pageDataType === "homeExtend") {
      items.splice(i, 1);
    }
  }
}

// 交换集合中两个对象的位置
function swapObjectsInArray(array, index0, index1) {
  // array[index0] = {...array[index1]};
  // array[index0].title = "全部微博";
  // array[index0].apipath = "statuses/container_timeline_unread";
  // array[index0].gid = "10001" + array[index0].uid; // 这个属性用来判断是否全部微博，修改后报错

  const temp = array[index0];
  array[index0] = array[index1];
  array[index1] = temp;
  console.log('交换tab页顺序结束💕💕');
}
