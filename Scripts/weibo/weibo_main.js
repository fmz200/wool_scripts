/**
 * @auther @fmz200
 * @function 微博去广告
 * @date 2024-06-08 21:00:00
 * @quote zmqcherish
 */

const version = 'v20230411.1';

const $ = new Env("微博去广告");
let storeMainConfig = $.getdata('mainConfig');
let storeItemMenusConfig = $.getdata('itemMenusConfig');

//主要的选项配置
const mainConfig = storeMainConfig ? JSON.parse(storeMainConfig) : {
	isDebug: false,						//开启调试，会打印运行中部分日志
	//个人中心配置，其中多数是可以直接在更多功能里直接移除
	removeHomeVip: true,				//个人中心的vip栏
	removeHomeCreatorTask: true,		//个人中心创作者中心下方的轮播图

	//微博详情页配置
	removeRelate: true,			//相关推荐
	removeGood: true,			//微博主好物种草
	removeFollow: true,			//关注博主
	modifyMenus: true,			//编辑上下文菜单
	removeRelateItem: true,	//评论区相关内容
	removeRecommendItem: true,	//评论区推荐内容
	removeRewardItem: false,	//微博详情页打赏模块

	removeLiveMedia: true,		//首页顶部直播
	removeNextVideo: false,					//关闭自动播放下一个视频

	removePinedTrending: true,		//删除热搜列表置顶条目

	removeInterestFriendInTopic: false,		//超话：超话里的好友
	removeInterestTopic: false,				//超话：可能感兴趣的超话 + 好友关注
	removeInterestUser: false,				//用户页：可能感兴趣的人

	removeLvZhou: false,					//绿洲模块

	profileSkin1: null,						//用户页：自定义图标1
	profileSkin2: null,						//用户页：自定义图标2
	tabIconVersion: 0,						//配置大于100的数
	tabIconPath: ''							//配置图标路径
}


//菜单配置
const itemMenusConfig = storeItemMenusConfig ? JSON.parse(storeItemMenusConfig) : {
	creator_task: false,					//转发任务
	mblog_menus_custom: false,				//寄微博
	mblog_menus_video_later: true,			//可能是稍后再看？没出现过
	mblog_menus_comment_manager: true,		//评论管理
	mblog_menus_avatar_widget: false,		//头像挂件
	mblog_menus_card_bg: false,			//卡片背景
	mblog_menus_long_picture: true,		//生成长图
	mblog_menus_delete: true,				//删除
	mblog_menus_edit: true,				//编辑
	mblog_menus_edit_history: true,		//编辑记录
	mblog_menus_edit_video: true,			//编辑视频
	mblog_menus_sticking: true,			//置顶
	mblog_menus_open_reward: true,			//赞赏
	mblog_menus_novelty: false,			//新鲜事投稿
	mblog_menus_favorite: true,			//收藏
	mblog_menus_promote: true,				//推广
	mblog_menus_modify_visible: true,		//设置分享范围
	mblog_menus_copy_url: true,			//复制链接
	mblog_menus_follow: true,				//关注
	mblog_menus_video_feedback: true,		//播放反馈
	mblog_menus_shield: true,				//屏蔽
	mblog_menus_report: true,				//投诉
	mblog_menus_apeal: true,				//申诉
	mblog_menus_home: true					//返回首页
}

const modifyCardsUrls = ['/cardlist', 'video/community_tab', '/searchall'];
const modifyStatusesUrls = ['statuses/friends/timeline', 'statuses/unread_friends_timeline', 'statuses/unread_hot_timeline', 'groups/timeline'];

const otherUrls = {
	'/profile/me': 'removeHome',						//个人页模块
	'/statuses/extend': 'itemExtendHandler',					//微博详情页
	'/video/remind_info': 'removeVideoRemind',			//tab2菜单上的假通知
	'/checkin/show': 'removeCheckin',					//签到任务
	'/live/media_homelist': 'removeMediaHomelist',		//首页直播
	'/comments/build_comments': 'removeComments',		//微博详情页评论区相关内容
	'/container/get_item': 'containerHandler',			//列表相关
	'/profile/container_timeline': 'userHandler',					//用户主页
	'/video/tiny_stream_video_list': 'nextVideoHandler',	//取消自动播放下一个视频
	'/2/statuses/video_mixtimeline': 'nextVideoHandler',
	'/!/client/light_skin': 'tabSkinHandler',
	'/littleskin/preview': 'skinPreviewHandler',
	'/search/finder': 'removeSearchMain',
	'/search/container_timeline': 'removeSearch',
	'/search/container_discover': 'removeSearch',
	'/2/messageflow': 'removeMsgAd',
	'/2/page?': 'removePage',	//超话签到的按钮 /2/page/button 加?区别
	'/statuses/container_timeline_topic': 'topicHandler',	//超话tab
	'/statuses/container_timeline?': 'removeMain',	//首页
	'/statuses/container_timeline_unread': 'removeMain',	//首页
	'/statuses/container_timeline_hot': 'removeMain',	//推荐页，fmz200
}

let url = $request.url;
let body = $response.body;
let method = getModifyMethod(url);
log("匹配方法：" + method);
if (method) {
	let data = JSON.parse(body);
	let func = eval(method);
	new func(data);
	body = JSON.stringify(data);
}

$.done({body});


function getModifyMethod(url) {
	for (const s of modifyCardsUrls) {
		if (url.indexOf(s) > -1) {
			return 'removeCards';
		}
	}
	for (const s of modifyStatusesUrls) {
		if (url.indexOf(s) > -1) {
			return 'removeTimeLine';
		}
	}
	for (const [path, method] of Object.entries(otherUrls)) {
		if (url.indexOf(path) > -1) {
			return method;
		}
	}
	return null;
}

function isAd(data) {
	if (!data) {
		return false;
	}
	if (data.mblogtypename?.includes('广告') || data.mblogtypename?.includes('热推')) {
		return true;
	}
	if (data.promotion?.type === 'ad') {
		return true;
	}
	if (data.content_auth_info?.content_auth_title?.includes("广告")) {
		return true;
	}
	if (data.ads_material_info?.is_ads) {
		return true;
	}
	return false;
}

// 判断首页流 感兴趣的超话
function checkJunkTopic(item) {
	if (item.category !== 'group') {
		return false;
	}
	try {
		if (item.items[0]['data']['title'] === '关注你感兴趣的超话') {
			return true;
		}
	} catch (error) {
	}
	return false;
}

function removeMain(data) {
	if (!data.items) {
		return data;
	}
	let newItems = [];
	for (let item of data.items) {
		if (checkJunkTopic(item)) {
			continue;
		}
		if (!isAd(item.data)) {
			// 无水印图片，但画质较低
			if (item.data?.pic_infos) {
				for (let key in item.data.pic_infos) {
					let picture = item.data.pic_infos[key];
					let high_url = picture.original.url.replace("orh1080", "oslarge");
					// console.log('set high_url ' + high_url);
					picture.largest.url = high_url;
					picture.thumbnail.url = high_url;
					picture.large.url = high_url;
					picture.middleplus.url = high_url;
					picture.mw2000.url = high_url;
					picture.bmiddle.url = high_url;
					// console.log('set high_url success');
				}
			}
			newItems.push(item);
		}
	}
	data.items = newItems;
	log('removeMain success');
	return data;
}

function topicHandler(data) {
	log('topicHandler start');
	const items = data.items;
	if (!items) return data;
	if (!mainConfig.removeUnfollowTopic && !mainConfig.removeUnusedPart) return data;
	let newItems = [];
	for (let c of items) {
		let addFlag = true;
		let category = c.category;
		if (category === 'feed') {
			if (!mainConfig.removeUnfollowTopic) {
				continue;
			}
			let btns = c?.data?.buttons;
			if (btns && btns.length > 0 && btns[0].type === 'follow') {
				addFlag = false;
			}
		} else {
			if (!mainConfig.removeUnusedPart) {
				continue;
			}

			if (category === 'group') {
				const cc = c.header?.title?.content;
				if (cc && cc.indexOf('空降发帖') > -1) {
					addFlag = false;
					continue;
				}
				let subItems = c.items;
				if (!subItems) {
					continue;
				}
				let newSubItems = [];
				for (let sub of subItems) {
					let anchorId = sub?.itemExt?.anchorId;
					if (!anchorId || ['sg_bottom_tab_search_input', 'multi_feed_entrance', 'bottom_mix_activity', 'cats_top_content', 'chaohua_home_readpost_samecity_title', 'chaohua_discovery_banner_1', 'chaohua_home_readpost_samecity_content'].indexOf(anchorId) == -1) {
						newSubItems.push(sub);
					}
				}
				c.items = newSubItems;
			} else if (category === 'card') {
				let cData = c.data
				if (cData?.top?.title === '正在活跃') {
					addFlag = false;
				} else if (cData.card_type === 200 && cData.group) {
					addFlag = false;
				}
			}
		}
		if (addFlag) {
			newItems.push(c);
		}
	}
	data.items = newItems;
	log('topicHandler success');
	return data;
}


function removeSearchMain(data) {
	let channels = data.channelInfo.channels;
	if (!channels) {
		return data;
	}
	for (let channel of channels) {
		let payload = channel.payload;
		if (!payload) {
			continue;
		}
		removeSearch(payload)
	}
	log('remove_search main success');
	return data;
}


function checkSearchWindow(item) {
	if (!mainConfig.removeSearchWindow) return false;
	if (item.category !== 'card') return false;
	return item.data?.itemid === 'finder_window' || item.data?.itemid === 'more_frame';
}


//发现页
function removeSearch(data) {
	if (!data.items) {
		return data;
	}
	let newItems = [];
	for (let item of data.items) {
		if (item.category === 'feed') {
			if (!isAd(item.data)) {
				newItems.push(item);
			}
		} else {
			if (!checkSearchWindow(item)) {
				newItems.push(item);
			}
		}
	}
	data.items = newItems;
	log('remove_search success');
	return data;
}


function removeMsgAd(data) {
	if (!data.messages) {
		return;
	}
	let newMsgs = [];
	for (let msg of data.messages) {
		if (msg.msg_card?.ad_tag) {
			continue;
		}
		newMsgs.push(msg)
	}
	data.messages = newMsgs;
	return data;
}

function removePage(data) {
	removeCards(data);

	// 删除热搜列表置顶条目
	if (mainConfig.removePinedTrending && data.cards && data.cards.length > 0) {
		if (data.cards[0].card_group) {
			data.cards[0].card_group = data.cards[0].card_group.filter(c => !c.itemid.includes("t:51"));
		}
	}

	return data;
}

function removeCards(data) {
	if (!data.cards) {
		return;
	}
	let newCards = [];
	for (const card of data.cards) {
		let cardGroup = card.card_group;
		if (cardGroup && cardGroup.length > 0) {
			let newGroup = [];
			for (const group of cardGroup) {
				let cardType = group.card_type;
				if (cardType !== 118) {
					newGroup.push(group);
				}
			}
			card.card_group = newGroup;
			newCards.push(card);
		} else {
			let cardType = card.card_type;
			if ([9, 165].indexOf(cardType) > -1) {
				if (!isAd(card.mblog)) {
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
	if (!mainConfig.removeLvZhou) return;
	if (!data) return;
	let struct = data.common_struct;
	if (!struct) return;
	let newStruct = [];
	for (const s of struct) {
		if (s.name !== '绿洲') {
			newStruct.push(s);
		}
	}
	data.common_struct = newStruct;
}


function isBlock(data) {
	let blockIds = mainConfig.blockIds || [];
	if (blockIds.length === 0) {
		return false;
	}
	let uid = data.user.id;
	for (const blockId of blockIds) {
		if (blockId === uid) {
			return true;
		}
	}
	return false;
}

function removeTimeLine(data) {
	for (const s of ["ad", "advertises", "trends"]) {
		if (data[s]) {
			delete data[s];
		}
	}
	if (!data.statuses) {
		return;
	}
	let newStatuses = [];
	for (const s of data.statuses) {
		if (!isAd(s)) {
			lvZhouHandler(s);
			if (!isBlock(s)) {
				newStatuses.push(s);
			}
		}
	}
	data.statuses = newStatuses;
}


function removeHomeVip(data) {
	if (!data.header) {
		return data;
	}
	// let vipCenter = data.header.vipCenter;
	// if(vipCenter) {
	// 	vipCenter.icon = '';
	// 	vipCenter.title.content = '会员中心';
	// }
	if (data.header.vipView) {
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
	if (mainConfig.removeRelate || mainConfig.removeGood) {
		if (data.trend?.titles) {
			let title = data.trend.titles.title;
			if (mainConfig.removeRelate && title === '相关推荐') {
				delete data.trend;
			} else if (mainConfig.removeGood && title === '博主好物种草') {
				delete data.trend;
			}
		}
	}
	if (mainConfig.removeFollow) {
		if (data.follow_data) {
			data.follow_data = null;
		}
	}

	if (mainConfig.removeRewardItem) {
		if (data.reward_info) {
			data.reward_info = null;
		}
	}

	//删除超话新帖和新用户通知
	if (data.page_alerts) {
		data.page_alerts = null;
	}

	//广告 暂时判断逻辑根据图片	https://h5.sinaimg.cn/upload/1007/25/2018/05/03/timeline_icon_ad_delete.png
	try {
		let picUrl = data.trend.extra_struct.extBtnInfo.btn_picurl;
		if (picUrl.indexOf('timeline_icon_ad_delete') > -1) {
			delete data.trend;
		}
	} catch (error) {

	}


	if (mainConfig.modifyMenus && data.custom_action_list) {
		let newActions = [];
		for (const item of data.custom_action_list) {
			let _t = item.type;
			let add = itemMenusConfig[_t]
			if (add === undefined) {
				newActions.push(item);
			} else if (_t === 'mblog_menus_copy_url') {
				newActions.unshift(item);
			} else if (add) {
				newActions.push(item);
			}
		}
		data.custom_action_list = newActions;
	}
}

function updateFollowOrder(item) {
	try {
		for (let d of item.items) {
			if (d.itemId === 'mainnums_friends') {
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
		if (!profileSkin) {
			return;
		}
		let i = 0;
		for (let d of item.items) {
			if (!d.image) {
				continue;
			}
			try {
				dm = d.image.style.darkMode
				if (dm !== 'alpha') {
					d.image.style.darkMode = 'alpha'
				}
				d.image.iconUrl = profileSkin[i++];
				if (d.dot) {
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
	if (!data.items) {
		return data;
	}
	let newItems = [];
	for (let item of data.items) {
		let itemId = item.itemId;
		if (itemId === 'profileme_mine') {
			if (mainConfig.removeHomeVip) {
				item = removeHomeVip(item);
			}
			updateFollowOrder(item);
			newItems.push(item);
		} else if (itemId === '100505_-_top8') {
			updateProfileSkin(item, 'profileSkin1');
			newItems.push(item);
		} else if (itemId === '100505_-_newcreator') {
			if (item.type === 'grid') {
				updateProfileSkin(item, 'profileSkin2');
				newItems.push(item);
			} else {
				if (!mainConfig.removeHomeCreatorTask) {
					newItems.push(item);
				}
			}
		} else if (['mine_attent_title', '100505_-_meattent_pic', '100505_-_newusertask', '100505_-_vipkaitong', '100505_-_hongbao2022', '100505_-_adphoto', '100505_-_hongrenjie2022', '100505_-_weibonight2023'].indexOf(itemId) > -1) {
			continue;
		} else if (itemId === '100505_-_advideo') {
			if (item?.header?.title?.content === '微博之夜') {
				continue;
			}
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
	if (mainConfig.removeLiveMedia) {
		log('remove 首页直播');
		data.data = {};
	}
}

//评论区相关和推荐内容
function removeComments(data) {
	let delType = ['广告'];
	if (mainConfig.removeRelateItem) delType.push('相关内容', '相关评论');
	if (mainConfig.removeRecommendItem) delType.push(...['推荐', '热推']);
	// if(delType.length === 0) return;
	let items = data.datas || [];
	if (items.length === 0) return;
	let newItems = [];
	for (const item of items) {
		if (isAd(item.data)) {
			continue;
		}
		if (item.data?.user) {
			if (["超话社区", "微博开新年", "微博热搜", "微博视频"].includes(item.data.user.name)) {
				continue;
			}
		}
		// 6为你推荐更多精彩内容 15过滤提示
		if (item.type === 6 || item.type === 15) {
			continue;
		}
		let adType = item.adType || '';
		if (delType.indexOf(adType) === -1) {
			newItems.push(item);
		}
	}
	log('remove 评论区相关和推荐内容');
	data.datas = newItems;
}


//处理感兴趣的超话和超话里的好友
function containerHandler(data) {
	if (mainConfig.removeInterestFriendInTopic) {
		if (data.card_type_name === '超话里的好友') {
			log('remove 超话里的好友');
			data.card_group = [];
		}
	}
	if (mainConfig.removeInterestTopic && data.itemid) {
		if (data.itemid.indexOf('infeed_may_interest_in') > -1) {
			log('remove 感兴趣的超话');
			data.card_group = [];
		} else if (data.itemid.indexOf('infeed_friends_recommend') > -1) {
			log('remove 超话好友关注');
			data.card_group = [];
		}
	}
}

//可能感兴趣的人
function userHandler(data) {
	data = removeMain(data);
	if (!mainConfig.removeInterestUser) {
		return data;
	}

	if (!data.items) {
		return data;
	}
	let newItems = [];
	for (let item of data.items) {
		let isAdd = true;
		if (item.category === 'group') {
			try {
				if (item.items[0]['data']['desc'] === '可能感兴趣的人') {
					isAdd = false;
				}
			} catch (error) {
			}
		}
		if (isAdd) {
			newItems.push(item);
		}
	}
	data.items = newItems;
	log('removeMain sub success');
	return data;
}


function nextVideoHandler(data) {
	if (mainConfig.removeNextVideo) {
		data.statuses = [];
		data.tab_list = [];
		console.log('nextVideoHandler');
	}
}

function tabSkinHandler(data) {
	try {
		let iconVersion = mainConfig.tabIconVersion;
		data['data']['canUse'] = 1
		if (!iconVersion || !mainConfig.tabIconPath) return;
		if (iconVersion < 100) return;

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


// function unreadCountHandler(data) {
// 	let ext = data.ext_new;
// 	if(!ext) return;
// 	if(!ext.creator_task) return;
// 	ext.creator_task.text = '';
// }

function log(data) {
	if (mainConfig.isDebug) {
		console.log(data);
	}
}

/*********************************** API *************************************/
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;"POST"===e&&(s=this.post);const i=new Promise(((e,i)=>{s.call(this,t,((t,s,o)=>{t?i(t):e(s)}))}));return t.timeout?((t,e=1e3)=>Promise.race([t,new Promise(((t,s)=>{setTimeout((()=>{s(new Error("请求超时"))}),e)}))]))(i,t.timeout):i}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.logLevels={debug:0,info:1,warn:2,error:3},this.logLevelPrefixs={debug:"[DEBUG] ",info:"[INFO] ",warn:"[WARN] ",error:"[ERROR] "},this.logLevel="info",this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null,...s){try{return JSON.stringify(t,...s)}catch{return e}}getjson(t,e){let s=e;if(this.getdata(t))try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise((e=>{this.get({url:t},((t,s,i)=>e(i)))}))}runScript(t,e){return new Promise((s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,a]=i.split("@"),n={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"},policy:"DIRECT",timeout:o};this.post(n,((t,e,i)=>s(i)))})).catch((t=>this.logErr(t)))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t||(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce(((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{}),t)[e[e.length-1]]=s),t}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),a=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(a);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.cookie&&void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar)))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",((t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}})).then((t=>{const{statusCode:i,statusCode:o,headers:r,rawBody:a}=t,n=s.decode(a,this.encoding);e(null,{status:i,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:i,response:o}=t;e(i,o,o&&s.decode(o.rawBody,this.encoding))}));break}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let i=require("iconv-lite");this.initGotEnv(t);const{url:o,...r}=t;this.got[s](o,r).then((t=>{const{statusCode:s,statusCode:o,headers:r,rawBody:a}=t,n=i.decode(a,this.encoding);e(null,{status:s,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:s,response:o}=t;e(s,o,o&&i.decode(o.rawBody,this.encoding))}));break}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}queryStr(t){let e="";for(const s in t){let i=t[s];null!=i&&""!==i&&("object"==typeof i&&(i=JSON.stringify(i)),e+=`${s}=${i}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",i="",o={}){const r=t=>{const{$open:e,$copy:s,$media:i,$mediaMime:o}=t;switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{const r={};let a=t.openUrl||t.url||t["open-url"]||e;a&&Object.assign(r,{action:"open-url",url:a});let n=t["update-pasteboard"]||t.updatePasteboard||s;if(n&&Object.assign(r,{action:"clipboard",text:n}),i){let t,e,s;if(i.startsWith("http"))t=i;else if(i.startsWith("data:")){const[t]=i.split(";"),[,o]=i.split(",");e=o,s=t.replace("data:","")}else{e=i,s=(t=>{const e={JVBERi0:"application/pdf",R0lGODdh:"image/gif",R0lGODlh:"image/gif",iVBORw0KGgo:"image/png","/9j/":"image/jpg"};for(var s in e)if(0===t.indexOf(s))return e[s];return null})(i)}Object.assign(r,{"media-url":t,"media-base64":e,"media-base64-mime":o??s})}return Object.assign(r,{"auto-dismiss":t["auto-dismiss"],sound:t.sound}),r}case"Loon":{const s={};let o=t.openUrl||t.url||t["open-url"]||e;o&&Object.assign(s,{openUrl:o});let r=t.mediaUrl||t["media-url"];return i?.startsWith("http")&&(r=i),r&&Object.assign(s,{mediaUrl:r}),console.log(JSON.stringify(s)),s}case"Quantumult X":{const o={};let r=t["open-url"]||t.url||t.openUrl||e;r&&Object.assign(o,{"open-url":r});let a=t["media-url"]||t.mediaUrl;i?.startsWith("http")&&(a=i),a&&Object.assign(o,{"media-url":a});let n=t["update-pasteboard"]||t.updatePasteboard||s;return n&&Object.assign(o,{"update-pasteboard":n}),console.log(JSON.stringify(o)),o}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,i,r(o));break;case"Quantumult X":$notify(e,s,i,r(o));break;case"Node.js":break}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}debug(...t){this.logLevels[this.logLevel]<=this.logLevels.debug&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.debug}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}info(...t){this.logLevels[this.logLevel]<=this.logLevels.info&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.info}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}warn(...t){this.logLevels[this.logLevel]<=this.logLevels.warn&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.warn}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}error(...t){this.logLevels[this.logLevel]<=this.logLevels.error&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.error}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.map((t=>t??String(t))).join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,e,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,e,void 0!==t.message?t.message:t,t.stack);break}}wait(t){return new Promise((e=>setTimeout(e,t)))}done(t={}){const e=((new Date).getTime()-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${e} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
/*****************************************************************************/
