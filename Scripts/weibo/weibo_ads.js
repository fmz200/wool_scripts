/**
 * @author fmz200
 * @function 微博去广告
 * @since 2025-12-08 20:15:00
 * @date 2026-06-22 22:15:00
 */

let url = $request.url;
let body = $response.body;
let resp_data = JSON.parse(body);

try {
  // 1、首次点击发现按钮
  if (url.includes("/search/finder?")) {
    console.log('进入发现页...');
    console.log(body);
    resp_data.channelInfo.channels[0].titleInfo.style.selectTextColor = "#333333";
    processPayload(resp_data.channelInfo.channels[0].payload);
    removeChannelsTabs(resp_data.channelInfo.channels);
    if (resp_data.header?.data?.items) {
      removeHeaderAds(resp_data.header.data.items);
    }
    if (resp_data.header?.insert_data) {
      delete resp_data.header.insert_data;
    }
  }

  // 2、发现页面刷新/再次点击发现按钮
  if (url.includes("/search/container_timeline?") || url.includes("/search/container_discover?")) {
    console.log('刷新发现页...');
    processPayload(resp_data);
    if (resp_data.header?.data?.items) {
      removeHeaderAds(resp_data.header.data.items);
    }
  }

  // 3、微博热搜页面刷新
  if (url.includes("/2/page?") && resp_data.cards && resp_data.cards[0].card_group) {
    resp_data.cards[0].card_group = resp_data.cards[0].card_group.filter(group => group.promotion == null);
    console.log('处理微博热搜页面广告结束💕💕');
  }

  // 微博热搜页面 “热搜”tab页
  if (url.includes("/2/flowpage?")) {
    // 删掉Banner图
    resp_data.pageHeader = {};
    for (let subItem of resp_data.items) {
      if (subItem.itemId === "hotword") {
        subItem.items = subItem.items.filter(group => group.data.promotion == null && !group.data.itemid.includes("c_type:51"));
        break;
      } else if (subItem.items) {
        subItem.items = subItem.items.filter(group => group.data.promotion == null && !group.data.itemid.includes("c_type:51") && !group.data.itemid.includes("region_data"));
      }
    }
  }

  // 4、微博超话页面
  if (url.includes("/statuses/container_timeline_topicpage?") && resp_data.items) {
    resp_data.items = resp_data.items.filter(item => !item.data || item.data.mblogtypename !== "广告");
    console.log('处理微博超话页面广告结束💕💕');
  }

  // 5、微博详情页面
  if (url.includes("/statuses/extend?")) {
    delete resp_data.head_cards;
    delete resp_data.top_cards;
    delete resp_data.extend_info;
    delete resp_data.trend; // 博主好物种草
    delete resp_data.semantic_brand_params;
    delete resp_data.ad_tag_nature;
    delete resp_data.title_source;
    delete resp_data.reward_info;
    console.log('处理微博详情页面广告结束💕💕');
  }
  if (url.includes("/statuses/container_detail?")) {
    resp_data.pageHeader.data.items = resp_data.pageHeader.data.items.filter(item =>
      item?.category !== 'card' && item?.category !== "group" && item?.category !== "wboxcard" && item?.type !== 'share'
    );
    // 详情页面的关注悬浮横幅
    if (resp_data.detailInfo?.extend?.follow_data) {
      delete resp_data.detailInfo.extend.follow_data;
    }
  }

  // 6、移除微博首页的多余tab页 微博首页Tab标签页
  if (url.includes("/groups/allgroups/v2")) {
    removePageDataAds(resp_data.pageDatas);
    // 删除恶心人的“全部微博”
    if (resp_data.pageDatas[0].categories) {
      delete resp_data.pageDatas[0].categories[0].pageDatas[0];
    } else {
      delete resp_data.pageDatas[1].categories[0].pageDatas[0];
    }
  }

  // 7、话题页面 微博话题页面
  if (url.includes("/2/searchall?")) {
    for (let i = 0; i < resp_data.items.length; i++) {
      if (resp_data.items[i].data?.mblogtypename === "广告" || resp_data.items[i].data?.ad_state === 1) {
        console.log('处理话题页面广告');
        resp_data.items[i] = {};
        continue;
      } else {
        deleteCommonAndSemanticBrandParams(resp_data.items[i]);
      }

      if (resp_data.items[i].items) {
        for (let j = 0; j < resp_data.items[i].items.length; j++) {
          if (resp_data.items[i].items[j].data?.card_type === 22
            || resp_data.items[i].items[j].data?.ad_state === 1
            || resp_data.items[i].items[j].data?.content_auth_info?.content_auth_title === "广告") {
            resp_data.items[i].items[j] = {};
          } else {
            deleteCommonAndSemanticBrandParams(resp_data.items[i].items[j]);
          }
        }
      }
    }
    console.log('处理话题页面广告结束💕💕');
  }

  // 8、超话tab页 微博超话tab页
  if (url.includes("/statuses/container_timeline_topic?")) {
    let foundFeed = false;
    const cardTypes = [19, 179]; // 19：热帖/必刷/分类，31：热搜词，179：关注的超话
    for (let i = 0; i < resp_data.items.length; i++) {
      const item = resp_data.items[i];
      if (item.data?.is_ad === 1 || item.data?.mblogtypename === "广告") {
        resp_data.items[i] = {};
        continue;
      }

      const category = item.category; // feed/card/group
      const cardType = item.data?.card_type || "";
      if (cardTypes.includes(cardType)) {
        console.log(`保留的card_type = ${cardType}`);
        continue;
      }

      // 第一条微博往下的内容只要不是微博（分类、推广等），全部删除
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

  // 8、评论区广告
  if (url.includes("/comments/mix_comments?")) {
    resp_data.datas = resp_data.datas.filter(item => item.adType !== "广告");
    console.log('处理评论区广告结束💕💕');
  }
  if (url.includes("/statuses/container_detail_comment?") || url.includes("/statuses/container_detail_mix?")) {
    resp_data.items = resp_data.items.filter(item => item.type !== "trend" && !item.commentAdType);
    console.log('处理评论区广告结束💕💕');
  }
  
  // 9、转发区广告
  if (url.includes("/statuses/container_detail_forward?")) {
    resp_data.items = resp_data.items.filter(item => item.type === "forward");
    console.log('处理转发区广告结束💕💕');
  }

  console.log('广告数据处理完毕🧧🧧');
} catch (e) {
  console.log('脚本运行出现错误，部分广告未去除⚠️');
  console.log('错误信息：' + e.message);
}
$done({body:JSON.stringify(resp_data)});
/***************************方法主体end*********************************/

function processPayload(payload) {
  if (!payload) {
    return;
  }

  // 删除搜索栏的“大家正在搜”
  if (payload.loadedInfo?.searchBarContent) {
    delete payload.loadedInfo.searchBarContent;
  }

  if (payload.items[0].items) {
    removeCommonAds(payload.items[0].items);
  }

  removeCommonAds(payload.items);
  removeCategoryFeedAds(payload.items);

  if (payload.loadedInfo?.headerBack) {
    delete payload.loadedInfo.headerBack;
  }
}

function removeChannelsTabs(channels) {
  // 1001：发现，1015：趋势，1016：榜单，1040：热转，1041：热问，1043：智搜
  // 1053：星品，1030：V发布，1063：世界杯，1061：神评，1046：指数
  const channelIds = [1001, 1015, 1016, 1040, 1041, 1043, 1053, 1030, 1063, 1061, 1046];
  // 反向遍历数组
  for (let i = channels.length - 1; i >= 0; i--) {
    if (!channelIds.includes(channels[i].id)) {
      // 如果当前元素的id不在channelIds中，则从原数组中删除该元素
      channels.splice(i, 1);
      console.log('移除多余的channel💕💕');
    }
  }
}

function removeHeaderAds(headerItems) {
  removeCommonAds(headerItems);
  for (let i = 0; i < headerItems.length; i++) {
    if (headerItems[i].items) {
      removeCommonAds(headerItems[i].items);
    }
  }
}

function removeCommonAds(items) {
  // 模块类型，不在里面的都计划删除
  // 17：微博热搜，235：新版微博热搜，101：热门微博
  const cardTypes = [17, 235, 101];

  let firstVerticalFound = false;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type === "vertical") {
      if (!firstVerticalFound) {
        firstVerticalFound = true;
        continue;
      }
      console.log('移除内嵌的模块💕💕');
      items[i] = {};
      continue;
    }

    const card_type = items[i].data?.card_type;
    console.log(`card_type = ${card_type}`);
    // 白名单模式
    if (card_type && !cardTypes.includes(card_type)) {
      console.log(`移除多余的模块：${card_type}💕💕`);
      items[i] = {};
      continue;
    }
    // 1.1、"微博热搜"模块
    if (card_type === 17) {
      console.log('处理微博热搜模块17💕');
      removeHotSearchAds(items[i].data.group);
    } else if (card_type === 235) {
      console.log('处理微博热搜模块235💕');
      removeHotSearchAds(items[i].data.channel_list[0]?.group);
    }
    // 118横版广告图片 182热议话题 217错过了热词 247横版视频广告 236微博趋势
    // 删除信息流中的图片广告、推广
    deleteCommonAndSemanticBrandParams(items[i])
  }
}

// 移除“微博热搜”的广告
function removeHotSearchAds(groups) {
  if (!groups) return;
  console.log('移除发现页热搜广告开始💕');
  for (let i = groups.length - 1; i >= 0; i--) {
    const group = groups[i];
    if (group.itemid?.includes("is_ad_pos") || group.itemid?.includes("cate_type:tongcheng") || group.promotion) {
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

// 删除一条微博下面的图片广告
function deleteCommonAndSemanticBrandParams(item) {
  // 删除信息流中的图片广告、推广
  if (item.data?.extend_info?.shopwindow_cards) {
    delete item.data.extend_info.shopwindow_cards
  }
  if (item.data?.extend_info?.ad_semantic_brand) {
    delete item.data.extend_info.ad_semantic_brand
  }
  if (item.data?.common_struct) {
    delete item.data.common_struct;
  }
  if (item.data?.semantic_brand_params) {
    delete item.data.semantic_brand_params;
  }
}