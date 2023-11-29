/**
 * author:fmz200
 * @function 微博去广告
 * date:2023-11-29 10:13:00
 */

// 在请求到达服务器之前,调用此函数,您可以在此处修改请求数据
async function onRequest(context, request) {
    console.log("请求URL=" + request.url);
    //URL参数
    request.queries["reqParams"] = "value";
    //更新或添加新标头
    request.headers["X-New-Headers"] = "My-Value";
    delete request.headers["Key-Need-Delete"];

    //Update Body 使用fetch API请求接口，具体文档可网上搜索fetch API
    //request.body = await fetch('https://www.baidu.com/').then(response => response.text());

    //共享参数 后面onResponse时取出
    context["request_url"] = request.url;
    return request;
}

// 在将响应数据发送到客户端之前,调用此函数,您可以在此处修改响应数据
async function onResponse(context, request, response) {
    const url1 = '/search/finder';
    const url2 = '/search/container_timeline'; // 发现页面
    const url3 = '/search/container_discover';
    const url4 = '/api.weibo.cn/2/page'; // 微博热搜页面url
    const url5 = '/statuses/container_timeline_topicpage'; // 微博超话页面
    const url6 = '/statuses/extend'; // 微博详情页面广告
    const url7 = '/groups/allgroups/v2' // 微博首页Tab标签页

    let index = 1;

    // 更新或添加新标头
    // response.headers["Name"] = context["name"];

    // Update status Code
    // response.statusCode = 500;

    let url = context["request_url"];
    let body = response.body;
    console.log("响应URL=" + url);
    let resp_data = JSON.parse(body);
    try {
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
                delete payload.items[index + 2].data.more_pic;
            }
            payload.items[index + 2].data.group = removeFinderChannelAds(payload.items[index + 2].data.group);

            // 1.4、items[i].category = "feed" 是热门微博的部分
            payload.items = removeCategoryFeedAds(payload.items);

            // 1.5、背景图广告
            if (payload.loadedInfo?.headerBack) {
                delete payload.loadedInfo.headerBack;
            }
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
            console.log('移除finder_channel模块💕💕');
            if (resp_data.items[index + 2].data?.more_pic?.includes('ads')) {
                delete resp_data.items[index + 2].data.more_pic;
            }
            resp_data.items[index + 2].data.group = removeFinderChannelAds(resp_data.items[index + 2].data.group);

            // 2.4、items[i].category = "feed" 是热门微博的部分
            resp_data.items = removeCategoryFeedAds(resp_data.items);

            // 2.5、背景图广告
            if (resp_data.loadedInfo?.headerBack) {
                delete resp_data.loadedInfo.headerBack;
            }
        }

        // 3、微博热搜页面刷新
        if (url.includes(url4) && resp_data.cards && resp_data.cards[0].card_group) {
            console.log('微博热搜页面广告开始💕');
            resp_data.cards[0].card_group = resp_data.cards[0].card_group.filter(group => group.promotion == null);
            console.log('微博热搜页面广告结束💕💕');
        }

        // 4、微博超话页面
        if (url.includes(url5) && resp_data.items) {
            console.log('微博超话页面广告开始💕');
            resp_data.items = resp_data.items.filter(item => !item.data || item.data.mblogtypename !== "广告");
            console.log('微博超话页面广告结束💕💕');
        }

        // 5、微博超话页面
        if (url.includes(url6)) {
            console.log('微博详情页面广告开始💕');
            resp_data.head_cards = [];
            console.log('微博详情页面广告结束💕💕');
        }

        // 6、移除微博首页的多余tab页
        if (url.includes(url7)) {
            resp_data.pageDatas = removePageDataAds(resp_data.pageDatas);
            swapObjectsInArray(resp_data.pageDatas[0].categories[0].pageDatas, 0, 1);
        }
        console.log('没有广告数据🧧🧧');
    } catch (e) {
        console.log('脚本运行出现错误，部分广告未去除⚠️');
        console.log('错误信息：' + e.message);
    }

    response.body = JSON.stringify(resp_data);
    return response;
}

// 移除“微博热搜”的广告
function removeHotSearchAds(groups) {
    if (!groups) return;
    console.log('移除发现页热搜广告开始💕');
    const newGroups = groups.filter(group => !(group.itemid?.includes("is_ad_pos") || group.promotion));
    console.log('移除发现页热搜广告结束💕💕');
    return newGroups;
}

// 移除“微博热搜”下面的“热聊，本地等”的广告
function removeFinderChannelAds(groups) {
    if (!groups) return;

    const titleSubPicMap = {
        '电影': 'https://simg.s.weibo.com/imgtool/20221207_dianying.png',
        '热议': 'https://simg.s.weibo.com/20220402_hottopic-icon.png',
        '影像年': 'https://simg.s.weibo.com/ads/1%2Fads_1692185628.png',
        '本地': 'https://simg.s.weibo.com/20190123154142_tongcheng.png',
        '亚运电竞': 'https://simg.s.weibo.com/ads/1%2Fads_1694765662.png',
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
    console.log('移除发现页finder_channel广告开始💕');
    const newGroups = [];
    for (const group of groups) {
        if (group.pic?.includes('ads')) {
            group.pic = titleSubPicMap[group.title_sub] || "https://simg.s.weibo.com/20200915_huodong.png";
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

// 移除微博首页的多余tab页
function removePageDataAds(items) {
    console.log('移除微博首页的多余tab页开始💕');
    const newItems = items.filter(item => item.pageDataType !== "homeExtend");
    console.log('移除微博首页的多余tab页结束💕💕');
    return newItems;
}

// 交换集合中两个对象的位置
function swapObjectsInArray(array, index1, index2) {
    console.log('交换tab页顺序开始💕');
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;

    array[index2].type = array[index1].type;
    array[index2].apipath = "statuses/container_timeline_unread";
    delete array[index2].navigation_title;
    console.log('交换tab页顺序结束💕💕');
}
