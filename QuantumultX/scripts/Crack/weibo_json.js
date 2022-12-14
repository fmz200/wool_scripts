/***********************************

> 应用名称：墨鱼自用微博&微博国际版净化
> 脚本作者：@Zmqcherish, @Cuttlefish
> 微信账号：墨鱼手记
> 更新时间：2022-12-14
> 通知频道：https://t.me/ddgksf2021
> 贡献投稿：https://t.me/ddgksf2013_bot
> 原作者库：https://github.com/zmqcherish
> 问题反馈：ddgksf2013@163.com
> 特别提醒：如需转载请注明出处，谢谢合作！
> 脚本声明：特别感谢Zmqcherish的付出，本脚本只是在他原创脚本的基础上优化自用
> 特别说明：⚠️⚠️⚠️
          本脚本仅供学习交流使用，禁止转载售卖
          ⚠️⚠️⚠️
	  
***********************************/	  


const version = 'V2.0.18';

/*主要的选项配置*/
const mainConfig = {
	isDebug: false,							//开启调试，会打印运行中部分日志
	
	/*个人中心配置，其中多数是可以直接在更多功能里直接移除*/
	removeHomeVip: true,					//个人中心的vip栏
	removeHomeCreatorTask: true,		    //个人中心创作者中心下方的轮播图

	//微博详情页配置
	removeRelate: true,			            //相关推荐
	removeGood: true,			  			//微博主好物种草
	removeFollow: true,						//关注博主
	modifyMenus: true,						//编辑上下文菜单
	removeRelateItem: false,				//评论区相关内容
	removeRecommendItem: true,				//评论区推荐内容
	removeRewardItem: true,	            	//微博详情页打赏模块

	removeLiveMedia: true,		            //首页顶部直播
	removeNextVideo: false,					//关闭自动播放下一个视频

	removePinedTrending: true,		        //删除热搜列表置顶条目

	removeInterestFriendInTopic: false,		//超话：超话里的好友
	removeInterestTopic: false,				//超话：可能感兴趣的超话 + 好友关注
	removeInterestUser: false,				//用户页：可能感兴趣的人

	removeLvZhou: true,						//绿洲模块
	
	removeSearchWindow: true,               //搜索发现页下的轮播Ad图

	profileSkin1: null,						//用户页：自定义图标1
	profileSkin2: null,						//用户页：自定义图标2
	tabIconVersion: 0,						//配置大于100的数
	tabIconPath: ''							//配置图标路径
}


//菜单配置
const itemMenusConfig = {
	creator_task:false,					    //转发任务
	mblog_menus_custom:false,				//寄微博
	mblog_menus_video_later:true,			//可能是稍后再看？没出现过
	mblog_menus_comment_manager:true,		//评论管理
	mblog_menus_avatar_widget:false,		//头像挂件
	mblog_menus_card_bg: false,			    //卡片背景
	mblog_menus_long_picture:true,		    //生成长图
	mblog_menus_delete:true,				//删除
	mblog_menus_edit:true,				    //编辑
	mblog_menus_edit_history:true,		    //编辑记录
	mblog_menus_edit_video:true,			//编辑视频
	mblog_menus_sticking:true,			    //置顶
	mblog_menus_open_reward:true,			//赞赏
	mblog_menus_novelty:false,			    //新鲜事投稿
	mblog_menus_favorite:true,			    //收藏
	mblog_menus_promote:true,				//推广
	mblog_menus_modify_visible:true,		//设置分享范围
	mblog_menus_copy_url:true,			    //复制链接
	mblog_menus_follow:true,				//关注
	mblog_menus_video_feedback:true,		//播放反馈
	mblog_menus_shield:true,				//屏蔽
	mblog_menus_report:true,				//投诉
	mblog_menus_apeal:true,				    //申诉
	mblog_menus_home:true					//返回首页
}

const modifyCardsUrls    = ['/cardlist', 'video/community_tab', '/searchall'];
const modifyStatusesUrls = ['statuses/friends/timeline', 'statuses/unread_friends_timeline', 'statuses/unread_hot_timeline', 'groups/timeline', 'statuses/friends_timeline'];

const otherUrls = {
	'/profile/me': 'removeHome',								//个人页模块
	'/statuses/extend': 'itemExtendHandler',					//微博详情页
	'/video/remind_info': 'removeVideoRemind',					//tab2菜单上的假通知
	'/checkin/show': 'removeCheckin',							//签到任务
	'/live/media_homelist': 'removeMediaHomelist',				//首页直播
	'/comments/build_comments': 'removeComments',				//微博详情页评论区相关内容
	'/container/get_item': 'containerHandler',					//列表相关
	'/profile/container_timeline': 'userHandler',				//用户主页
	'/video/tiny_stream_video_list': 'nextVideoHandler',		//取消自动播放下一个视频
	'/2/statuses/video_mixtimeline': 'nextVideoHandler',	
	'/!/client/light_skin': 'tabSkinHandler',
	'/littleskin/preview': 'skinPreviewHandler',
	'/search/finder': 'removeSearchMain',
	'/search/container_timeline': 'removeSearch',            	//搜索发现页
	'/search/container_discover': 'removeSearch',
	'/2/messageflow': 'removeMsgAd',
	'/2/page?': 'removePage',									//超话签到的按钮 /2/page/button 加?区别
	'/statuses/unread_topic_timeline': 'topicHandler',			//超话tab
	'/statuses/container_timeline': 'removeMain',
	'wbapplua/wbpullad.lua': 'removeLuaScreenAds',   			//Lua开屏广告
	'interface/sdk/sdkad.php': 'removePhpScreenAds',  			//Php开屏广告
	'ct=feed&a=trends': 'removeTopics',                         /* 国际版屏蔽探索页面下的一些Topic */
	'user_center'     : 'modifiedUserCenter',                    /*国际版用户中心*/
	'a=get_coopen_ads': 'removeIntlOpenAds'
}


function getModifyMethod(url) {
	for (const s of modifyCardsUrls) {
		if(url.indexOf(s) > -1) {
			return 'removeCards';
		}
	}
	for (const s of modifyStatusesUrls) {
		if(url.indexOf(s) > -1) {
			return 'removeTimeLine';
		}
	}
	for(const [path, method] of Object.entries(otherUrls)) {
		if(url.indexOf(path) > -1) {
			return method;
		}
	}
	return null;
}
function removeIntlOpenAds(data) {
	if(!data.data||data.data.length===0) {
		return data;
	}
	data.data.ad_list=[];
	data.data.gdt_video_ad_ios=[];
	data.data.display_ad=0;
	data.data.ad_ios_id=null;
	data.data.app_ad_ios_id=null;
	data.data.reserve_ad_ios_id="";
	data.data.reserve_app_ad_ios_id="";
	data.data.ad_duration = 24*60*60*7;
	data.data.ad_cd_interval=24*60*60*7;
	data.data.pic_ad=[];
	return data;
}
/*国际版用户中心*/
function modifiedUserCenter(data) {
	if(!data.data||data.data.length===0) {
		return data;
	}
	if(data.data.cards){
		data.data.cards=Object.values(data.data.cards).filter((item) => !(item.items[0].type=='personal_vip'));
	}
	return data;
}
/* 国际版屏蔽探索页面下的一些Topic */
function removeTopics(data) {
	if(!data.data) {
		return data;
	}
	//if(data.data.search_topic) {delete data.data.search_topic;}
	if(data.data.topics) 	   {delete data.data.topics;}
	if(data.data.discover)     {delete data.data.discover;}
	
	return data;
}

function isAd(data) {
	if(!data) {
		return false;
	}
	if(data.mblogtypename == '广告' || data.mblogtypename == '热推') {return true};
	if(data.mblogtypename == '廣告' || data.mblogtypename == '熱推') {return true};
	if(data.promotion && data.promotion.type == 'ad') {return true};
	return false;
}


function removeMain(data) {
	if(!data.items) {
		return data;
	}
	let newItems = [];
	for (let item of data.items) {
		if(!isAd(item.data)) {
			newItems.push(item);
		}
	}
	data.items = newItems;
	log('removeMain success');
	return data;
}

function topicHandler(data) {
	const cards = data.cards;
	if (!cards) return data;
	if(!mainConfig.removeUnfollowTopic && !mainConfig.removeUnusedPart) return data;
	let newCards = [];
	for(let c of cards) {
		let addFlag = true;
		if(c.mblog) {
			let btns = c.mblog.buttons;
			if(mainConfig.removeUnfollowTopic && btns) {
				if(btns[0].type == 'follow') {
					addFlag = false;
				}
			}
		} else {
			if(!mainConfig.removeUnusedPart) {
				continue;
			}
			if(c.itemid == 'bottom_mix_activity') {
				addFlag = false;
			} else if(c?.top?.title == '正在活跃') {
				addFlag = false;
			} else if(c.card_type == 200 && c.group) {
				addFlag = false;
			} else {
				let cGroup = c.card_group;
				if(!cGroup) {continue;}
				let cGroup0 = cGroup[0];
				if(['guess_like_title', 'cats_top_title' ,'chaohua_home_readpost_samecity_title'].indexOf(cGroup0.itemid) > -1) {
					addFlag = false;
				} else if(cGroup.length > 1) {
					let newCardGroup = [];
					for(let cg of cGroup) {
						if(['chaohua_discovery_banner_1', 'bottom_mix_activity'].indexOf(cg.itemid) == -1) {
							newCardGroup.push(cg);
						}
					}
					c.card_group = newCardGroup;
				}
			}
		} 
		if(addFlag) {
			newCards.push(c);
		}
	}
	data.cards = newCards;
	log('topicHandler success');
	return data;
}


function removeSearchMain(data) {
	let channels = data.channelInfo.channels;
	if (!channels) {return data;}
	for(let channel of channels) {
		let payload = channel.payload;
		if (!payload) {continue;}
		removeSearch(payload)
	}
	log('remove_search main success');
	return data;
}


function checkSearchWindow(item) {
	if(!mainConfig.removeSearchWindow) return false;
	if(item.category != 'card') return false;
	return item.data?.itemid == 'finder_window' || item.data?.itemid == 'more_frame';
}


//发现页
function removeSearch(data) {
	if(!data.items) {
		return data;
	}
	let newItems = [];
	for (let item of data.items) {
		if(item.category == 'feed') {
			if(!isAd(item.data)) {
				newItems.push(item);
			}
		} else {
			if(!checkSearchWindow(item)) {
				newItems.push(item);
			}
		}
	}
	data.items = newItems;
	log('remove_search success');
	return data;
}


function removeMsgAd(data) {
	if(!data.messages) {
		return;
	}
	let newMsgs = [];
	for (let msg of data.messages) {
		if(msg.msg_card?.ad_tag) {
			continue;
		}
		newMsgs.push(msg)
	}
	data.messages = newMsgs;
	return data;
}

function removePage(data){
	removeCards(data);

	// 删除热搜列表置顶条目
	if (mainConfig.removePinedTrending && data.cards && data.cards.length > 0) {
		if (data.cards[0].card_group) {
			data.cards[0].card_group = data.cards[0].card_group.filter(c=>!c.itemid.includes("t:51"));
		}
	}

	return data;
}

function removeCards(data) {
	if(!data.cards) {
		return;
	}
	let newCards = [];
	for (const card of data.cards) {
		let cardGroup = card.card_group;
		if(cardGroup && cardGroup.length > 0) {
			let newGroup = [];
			for (const group of cardGroup) {
				let cardType = group.card_type;
				if(cardType != 118) {
					newGroup.push(group);
				}
			}
			card.card_group = newGroup;
			newCards.push(card);
		} else {
			let cardType = card.card_type;
			if([9,165].indexOf(cardType) > -1) {
				if(!isAd(card.mblog)) {
					newCards.push(card);
				}
			} else {
				newCards.push(card);
			}
		}
	}
	data.cards = newCards;
}


function lvZhouHandler(data) {
	if(!mainConfig.removeLvZhou) return;
	if(!data) return;
	let struct = data.common_struct;
	if(!struct) return;
	let newStruct = [];
	for (const s of struct) {
		if(s.name != '绿洲') {
			newStruct.push(s);
		}
	}
	data.common_struct = newStruct;
}


function isBlock(data) {
	let blockIds = mainConfig.blockIds || [];
	if(blockIds.length === 0) {
		return false;
	}
	let uid = data.user.id;
	for (const blockId of blockIds) {
		if(blockId == uid) {
			return true;
		}
	}
	return false;
}

function removeTimeLine(data) {
	for (const s of ["ad", "advertises", "trends"]) {
		if(data[s]) {
			delete data[s];
		}
	}
	if(!data.statuses) {
		return;
	}
	let newStatuses = [];
	for (const s of data.statuses) {
		if(!isAd(s)) {
			lvZhouHandler(s);
			if(!isBlock(s)) {
				newStatuses.push(s);
			}
		}
	}
	data.statuses = newStatuses;
}


function removeHomeVip(data) {
	if(!data.header) {
		return data;
	}
	// let vipCenter = data.header.vipCenter;
	// if(vipCenter) {
	// 	vipCenter.icon = '';
	// 	vipCenter.title.content = '会员中心';
	// }
	if(data.header.vipView) {
		data.header.vipView = null;
	}
	return data;
}

//移除tab2的假通知
function removeVideoRemind(data) {
	data.bubble_dismiss_time = 0;
	data.exist_remind = false;
	data.image_dismiss_time = 0;
	data.image = '';
	data.tag_image_english = '';
	data.tag_image_english_dark = '';
	data.tag_image_normal = '';
	data.tag_image_normal_dark = '';
}


//微博详情页
function itemExtendHandler(data) {
	if(mainConfig.removeRelate || mainConfig.removeGood) {
		if(data.trend && data.trend.titles) {
			let title = data.trend.titles.title;
			if(mainConfig.removeRelate && title === '相关推荐') {
				delete data.trend;
			} else if (mainConfig.removeGood && title === '博主好物种草') {
				delete data.trend;
			}
		}
	}
	if(mainConfig.removeFollow) {
		if(data.follow_data) {
			data.follow_data = null;
		}
	}

	if(mainConfig.removeRewardItem) {
		if(data.reward_info) {
			data.reward_info = null;
		}
	}

	//删除超话新帖和新用户通知
	if(data.page_alerts) {
		data.page_alerts = null;
	}

	//广告 暂时判断逻辑根据图片	https://h5.sinaimg.cn/upload/1007/25/2018/05/03/timeline_icon_ad_delete.png
	try {
		let picUrl = data.trend.extra_struct.extBtnInfo.btn_picurl;
		if(picUrl.indexOf('timeline_icon_ad_delete') > -1) {
			delete data.trend;
		}
	} catch (error) {
		
	}


	if(mainConfig.modifyMenus && data.custom_action_list) {
		let newActions = [];
		for (const item of data.custom_action_list) {
			let _t = item.type;
			let add = itemMenusConfig[_t]
			if(add === undefined) {
				newActions.push(item);
			} else if(_t === 'mblog_menus_copy_url') {
				newActions.unshift(item);
			} else if(add) {
				newActions.push(item);
			}
		}
		data.custom_action_list = newActions;
	}
}

function updateFollowOrder(item) {
	try {
		for (let d of item.items) {
			if(d.itemId === 'mainnums_friends') {
				let s = d.click.modules[0].scheme;
				d.click.modules[0].scheme = s.replace('231093_-_selfrecomm', '231093_-_selffollowed');
				log('updateFollowOrder success');
				return;
			}
		}
	} catch (error) {
		console.log('updateFollowOrder fail');
	}
}

function updateProfileSkin(item, k) {
	try {
		let profileSkin = mainConfig[k];
		if(!profileSkin) {return;}
		let i = 0;
		for (let d of item.items) {
			if(!d.image) {
				continue;
			}
			try {
				dm = d.image.style.darkMode
				if(dm != 'alpha') {
					d.image.style.darkMode = 'alpha'
				}
				d.image.iconUrl = profileSkin[i++];
				if(d.dot) {
					d.dot = [];
				}
			} catch (error) {
				
			}
		}
		log('updateProfileSkin success');
	} catch (error) {
		console.log('updateProfileSkin fail');
	}
}


function removeHome(data) {
	if(!data.items) {
		return data;
	}
	let newItems = [];
	for (let item of data.items) {
		let itemId = item.itemId;
		if(itemId == 'profileme_mine') {
			if(mainConfig.removeHomeVip) {
				item = removeHomeVip(item);
			}
			updateFollowOrder(item);
			newItems.push(item);
		} else if (itemId == '100505_-_top8') {
			updateProfileSkin(item, 'profileSkin1');
			newItems.push(item);
		} else if (itemId == '100505_-_newcreator') {
			if(item.type == 'grid') {
				updateProfileSkin(item, 'profileSkin2');
				newItems.push(item);
			} else {
				if(!mainConfig.removeHomeCreatorTask) {
					newItems.push(item);
				}
			}
		} else if(['mine_attent_title', '100505_-_meattent_pic', '100505_-_newusertask', '100505_-_vipkaitong', '100505_-_hongbao2022', '100505_-_adphoto'].indexOf(itemId) > -1) {
			continue;
		} else if (itemId.match(/100505_-_meattent_-_\d+/)) {
			continue;
		} else {
			newItems.push(item);
		}
	}
	data.items = newItems;
	return data;
}


//移除tab1签到
function removeCheckin(data) {
	log('remove tab1签到');
	data.show = 0;
}


//首页直播
function removeMediaHomelist(data) {
	if(mainConfig.removeLiveMedia) {
		log('remove 首页直播');
		data.data = {};
	}
}

//评论区相关和推荐内容
function removeComments(data) {
	let delType = ['广告'];
	if(mainConfig.removeRelateItem) delType.push('相关内容');
	if(mainConfig.removeRecommendItem) delType.push(...['推荐', '热推']);
	// if(delType.length === 0) return;
	let items = data.datas || [];
	if(items.length === 0) return;
	let newItems = [];
	for (const item of items) {
		let adType = item.adType || '';
		if(delType.indexOf(adType) == -1) {
			newItems.push(item);
		}
	}
	log('remove 评论区相关和推荐内容');
	data.datas = newItems;
}


//处理感兴趣的超话和超话里的好友
function containerHandler(data) {
	if(mainConfig.removeInterestFriendInTopic) {
		if(data.card_type_name === '超话里的好友') {
			log('remove 超话里的好友');
			data.card_group = [];
		}
	}
	if(mainConfig.removeInterestTopic && data.itemid) {
		if(data.itemid.indexOf('infeed_may_interest_in') > -1) {
			log('remove 感兴趣的超话');
			data.card_group = [];
		} else if(data.itemid.indexOf('infeed_friends_recommend') > -1) {
			log('remove 超话好友关注');
			data.card_group = [];
		}
	}
}

//可能感兴趣的人
function userHandler(data) {
	data = removeMain(data);
	if(!mainConfig.removeInterestUser) {
		return data;
	}

	if(!data.items) {
		return data;
	}
	let newItems = [];
	for (let item of data.items) {
		let isAdd = true;
		if(item.category == 'group') {
			try {
				if(item.items[0]['data']['desc'] == '可能感兴趣的人') {
					isAdd = false;
				}
			} catch (error) {
			}
		}
		if(isAdd) {
			newItems.push(item);
		}
	}
	data.items = newItems;
	log('removeMain sub success');
	return data;
}


function nextVideoHandler(data) {
	if(mainConfig.removeNextVideo) {
		data.statuses = [];
		data.tab_list = [];
		console.log('nextVideoHandler');
	}
}

function tabSkinHandler(data) {
	try {
		let iconVersion = mainConfig.tabIconVersion;
		data['data']['canUse'] = 1
		if(!iconVersion || !mainConfig.tabIconPath) return;
		if(iconVersion < 100) return;

		let skinList = data['data']['list']
		for (let skin of skinList) {
			// if(skin.usetime) {
			// 	skin['usetime'] = 330
			// }
			skin['version'] = iconVersion;
			skin['downloadlink'] = mainConfig.tabIconPath;
		}
		log('tabSkinHandler success')
	} catch (error) {
		log('tabSkinHandler fail')
	}
}


function skinPreviewHandler(data) {
	data['data']['skin_info']['status'] = 1
}

function removeLuaScreenAds(data){
	if(!data.cached_ad){
		return data;
	}
	for (let item of data["cached_ad"]["ads"]) {
        item["start_date"] = 1893254400; // 2029-12-30 00:00:00
        item["show_count"] = 0;
        item["duration"]   = 0; 
        item["end_date"]   = 1893340799; // 2029-12-30 23:59:59 
    }
	return data;
}
function removePhpScreenAds(data){
	if(!data.ads){
		return data;
	}
	data.show_push_splash_ad=false;
	data.background_delay_display_time = 24*60*60;
	data.lastAdShow_delay_display_time = 24*60*60*7;
	data.realtime_ad_video_stall_time  = 24*60*60;
	data.realtime_ad_timeout_duration  = 24*60*60*7;
	for (let item of data["ads"]) {
        item["displaytime"]            = 0; 
        item["displayintervel"]        = 24*60*60;;
        item["allowdaydisplaynum"]     = 0; 
		item["displaynum"]             = 0;
        item["begintime"]              = "2029-12-30 00:00:00";
		item["endtime"]                = "2029-12-30 23:59:59";
    }
	return data;
}
function log(data) {
	if(mainConfig.isDebug) {
		console.log(data);
	}
}
var body = $response.body;
var url = $request.url;
let method = getModifyMethod(url);
if(method) {
	log(method);
	var func = eval(method);
	let data = JSON.parse(body.match(/\{.*\}/)[0]);
	new func(data);
	body = JSON.stringify(data);
	if(method=='removePhpScreenAds'){
		body =JSON.stringify(data)+"OK";
	}
}

$done({ body });
