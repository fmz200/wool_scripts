/*Http://t.me/ddgksf2021*/

var body = $response.body;
var url = $request.url;

if (url.indexOf('/ad/getAll') != -1) {
	var obj = JSON.parse(body);
	obj.data.adList = [];
	body = JSON.stringify(obj);
} else if (url.indexOf('/user/privilege/list') != -1) {
	var obj = JSON.parse(body);
	obj.data = [{"id":1,"effectObject":"video","action":"play","function":"originalPainting","func":"originalPainting","description":"解锁原画","icon":"jiesuoyuanhua","endTime":9999940148000},{"id":4,"effectObject":"video","action":"play","function":"noLimit","func":"noLimit","description":"看剧无限制","icon":"kanjuwuxianzhi","endTime":9999940148000},{"id":23,"effectObject":"video","action":"play","function":"noAd","func":"noAd","description":"看剧无广告","icon":"kanjuwuguanggao","endTime":9999940148000},{"id":43,"effectObject":"danmu","action":"send","function":"superBarrageBlue","func":"superBarrageBlue","description":"超级弹幕","icon":"chaojidanmu","endTime":9999940148000},{"id":46,"effectObject":"video","action":"play","function":"vipVideo","func":"vipVideo","description":"勋章专享剧集","icon":"zhuanxiangjuji","endTime":9999940148000},{"id":45,"effectObject":"mall","action":"sale","function":"mallDiscount","func":"mallDiscount","description":"龙醇商城九折","icon":"longchunshangcheng","endTime":9999940148000},{"id":37,"effectObject":"growth","action":"play","function":"0.4","func":"0.4","description":"看剧经验+40%","icon":"jingyanzhijiacheng","endTime":9999940148000},{"id":25,"effectObject":"nickName","action":"show","function":"nameHighLight","func":"nameHighLight","description":"高亮昵称","icon":"gaoliangnicheng","endTime":9999940148000},{"id":24,"effectObject":"comment","action":"write","function":"highLight","func":"highLight","description":"高亮评论回复","icon":"https://img.rr.tv/static/images/20170926/HighLigthComment@2x.png","endTime":9999940148000},{"id":20,"effectObject":"article","action":"write","function":"highLight","func":"highLight","description":"高亮发帖","icon":"gaoliangfatie","endTime":9999940148000}];
	body = JSON.stringify(obj);
}else if(url.indexOf('/rrtv-video/v4plus/season/detail') != -1){
	var obj = JSON.parse(body);
	obj.data['season']['feeMode'] = 'restriction';
	body = JSON.stringify(obj);
}else if(url.indexOf('/get_combined_drama_detail') != -1){
	body = $response.body.replace(/currentQuality":"\w+/g, 'currentQuality":"AI_OD');
}
$done({ body });
