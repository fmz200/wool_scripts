let url = $request.url
let regex = /mid=(\d*)/
let mid= regex.exec(url)
let api = `https://api.bilibili.com/x/space/arc/search?${mid[0]}&ps=10&tid=0&pn=1&keyword=&order=click&jsonp=jsonp`
var Url = {
    url: api,
    method: "GET"
};

$task.fetch(Url).then(response => {
  body=JSON.parse(response.body)
  let info=""
  body['data']['list']['vlist'].forEach((element, index)=> {
      index++
      let scheme=`bilibili://av/${element['aid']}`
      let play=element['play']
      info+=index+": "+element['title']+"\n"+scheme+"\n"
  })
  $notify('播放排行前10','长按进入', info);
  $done({});
}, reason => {
  $notify("播放排行获取失败", "", reason.error);
  $done({});
});