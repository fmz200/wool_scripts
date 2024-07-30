/**
 * @author fmz200
 * @function 微博去广告
 * @date 2024-07-28 21:18:00
 */

let url = $request.url;
let body = $response.body;
let resp_data = JSON.parse(body);

// 模块类型，不在里面的都计划删除
const cardTypes = ["217", "17", ""];

try {
    // 1、首次点击发现按钮
    if (url.includes("/search/finder")) {
      console.log('进入发现页...');
      processPayload(resp_data.channelInfo.channels[0].payload);
    }

    // 2、发现页面刷新/再次点击发现按钮
    if (url.includes("/search/container_timeline") || url.includes("/search/container_discover")) {
      console.log('刷新发现页...');
      processPayload(resp_data);
    }

    // 3、微博热搜页面刷新
    if (url.includes("/2/page") && resp_data.cards && resp_data.cards[0].card_group) {
      resp_data.cards[0].card_group = resp_data.cards[0].card_group.filter(group => group.promotion == null);
      console.log('处理微博热搜页面广告结束💕💕');
    }

    // 微博热搜页面 “热搜”tab页 https://api.weibo.cn/2/flowpage
    if (url.includes("/2/flowpage")) {
      // 删掉Banner图
      resp_data.pageHeader = {};
      for (let subItem of resp_data.items) {
        if (subItem.itemId === "hotword") {
          subItem.items = subItem.items.filter(group => group.data.promotion == null);
          break;
        } else if (subItem.items) {
          subItem.items = subItem.items.filter(group => group.data.promotion == null);
        }
      }
    }

    // 4、微博超话页面 https://api.weibo.cn/2/statuses/container_timeline_topicpage
    if (url.includes("/statuses/container_timeline_topicpage") && resp_data.items) {
      resp_data.items = resp_data.items.filter(item => !item.data || item.data.mblogtypename !== "广告");
      console.log('处理微博超话页面广告结束💕💕');
    }

    // 5、微博详情页面
    if (url.includes("/statuses/extend")) {
      resp_data.head_cards = [];
      console.log('处理微博详情页面广告结束💕💕');
    }

    // 6、移除微博首页的多余tab页 微博首页Tab标签页 https://api.weibo.cn/2/groups/allgroups/v2
    if (url.includes("/groups/allgroups/v2")) {
      removePageDataAds(resp_data.pageDatas);
      // 删除恶心人的“全部微博”
      delete resp_data.pageDatas[0].categories[0].pageDatas[0];
    }

    // 7、话题页面 微博话题页面 https://api.weibo.cn/2/searchall
    if (url.includes("/2/searchall")) {
      for (let i = 0; i < resp_data.items.length; i++) {
        if (resp_data.items[i].data?.mblogtypename === "广告" || resp_data.items[i].data?.ad_state === 1) {
          console.log('处理话题页面广告');
          resp_data.items[i] = {};
        }
      }
      console.log('处理话题页面广告结束💕💕');
    }

    // 8、超话tab页 微博超话tab页 https://api.weibo.cn/2/statuses/container_timeline_topic
    if (url.includes("/statuses/container_timeline_topic?flowId")) {
      let foundFeed = false;
      for (let i = 0; i < resp_data.items.length; i++) {
        const item = resp_data.items[i];
        const category = item.category;
        if (foundFeed && category !== "feed") {
          resp_data.items[i] = {};
        }
        if (category === "feed" || category === "card") {
          foundFeed = true;
          if (category === "card") {
            resp_data.items[i] = {};
          }
        }
        if (item.items) {
          for (let j = 0; j < item.items.length; j++) {
            const subItem = item.items[j];
            if (subItem.data?.card_type === 215) {
              item.items[j] = {};
            }
          }
        }
      }
      console.log('处理超话tab页广告结束💕💕');
    }

    console.log('广告数据处理完毕🧧🧧');
} catch (e) {
  console.log('脚本运行出现错误，部分广告未去除⚠️');
  console.log('错误信息：' + e.message);
}
$done({body:JSON.stringify(resp_data)});
/***************************方法主体end*********************************/

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
    const card_type = items[i].data?.card_type;
    console.log(`card_type = ${card_type}`);
    // 白名单模式
    if (!cardTypes.includes(card_type)) {
      console.log('移除多余的模块💕💕');
      // items[i] = {};
      // continue;
    }
    // 1.1、"微博热搜"模块
    if (card_type === 17) {
      console.log('处理微博热搜模块💕💕');
      removeHotSearchAds(items[i].data.group);
    }
    // 1.2、轮播图模块 // 118横版广告图片 182热议话题 217错过了热词 247横版视频广告
    if ([118, 182, 217, 247].includes(card_type)) {
      console.log('移除轮播图，实况热聊等模块💕💕');
      items[i] = {};
    }
    // 1.3、”热聊、本地、找人“模块，236微博趋势
    if ([19, 118, 206, 208, 217, 236, 249].includes(card_type)) {
      console.log('处理热聊、本地、找人模块💕💕');
      items[i] = {};
      // delete items[i].data.more_pic;
      // removeFinderChannelAds(items[i].data.group);
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
