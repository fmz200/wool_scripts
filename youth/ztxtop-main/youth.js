/*
更新时间: 2021-02-17 22:50
赞赏:中青邀请码`46308484`,农妇山泉 -> 有点咸，万分感谢
本脚本仅适用于中青看点极速版领取青豆
食用说明请查看本仓库目录Taskconf/youth/README.md，其中打卡挑战赛可通过Boxjs开关，报名时间为23点，早起打卡时间为早5点，报名需1000青豆押金，打卡成功可返1000+青豆，打卡失败则押金不予返还，请注意时间运行，
转发文章获得青豆不实，请无视

*/

const $ = new Env("中青看点")
$.date = new Date();
$.utc8 = $.date.getTime() + ($.date.getTimezoneOffset() * 60 * 1000) + 8 * 60 * 60 * 1000;
let notifyInterval = $.getdata("notifytimes")||50 //通知间隔，默认抽奖每50次通知一次，如需关闭全部通知请设为0
let s = $.getdata('delay_rotary_zq')||"10" //转盘延迟时间
const notify = $.isNode() ? require('./sendNotify') : '';
const ONCard = $.getdata('zqcard')||"false" //早起打卡开关
const withdrawcash = $.getdata('zqcash')||30 //提现金额
let withdrawUrl = $.getdata('cashurl_zq');
let withdrawBody = $.getdata('cashbody_zq');
let cookieYouth = $.getdata('youthheader_zq');
let ARTBODYs = $.getdata('read_zq');
let READTIME = $.getdata('readtime_zq');
let cardTime = $.getdata('zqtime')||"05";//打卡时间
let rotaryscore=0,doublerotary=0; 

let cookieArr = [], cookie = '',
    readArr = [], articlebodyVal ='',
    timeArr = [], timebodyVal = '',
    detail = ``, subTitle = ``;
if(!$.isNode()&&cookieYouth.indexOf("#") ==-1){
  let zqAc = $.getval('zqExecAc') || '';
  if (/^(,?\d+)+$/.test(zqAc)) {
    zqAc = zqAc.split(',').sort();
  } else {
    zqAc = [];
      // 兼容旧配置
      $.zqCount = ($.zqCount = ($.getval('zqCount') || '1') - 1) > 0 ? $.zqCount + 1 : 1; // 执行任务的账号个数
      for (let index = 1; index <= $.zqCount; index++) {
        zqAc.push(index + '');
      }
  }
  for (let acIdx of zqAc) {
    let idx = acIdx - 0 > 1 ? acIdx + '' : '';
    cookieArr.push($.getdata(`youthheader_zq${idx}`));
    readArr.push($.getdata(`read_zq${idx}`));
    timeArr.push($.getdata(`readtime_zq${idx}`));
  }
} else {
    if($.isNode()){
    if (process.env.YOUTH_HEADER && process.env.YOUTH_HEADER.indexOf('#') > -1) {
        cookieYouth = process.env.YOUTH_HEADER.split('#');
    } else if (process.env.YOUTH_HEADER && process.env.YOUTH_HEADER.indexOf('\n') > -1) {
        cookieYouth = process.env.YOUTH_HEADER.split('\n');
    } else {
        cookieYouth = [process.env.YOUTH_HEADER]
    };
    if (process.env.YOUTH_ARTBODY && process.env.YOUTH_ARTBODY.indexOf('&') > -1) {
        ARTBODYs = process.env.YOUTH_ARTBODY.split('&');
    } else if (process.env.YOUTH_ARTBODY && process.env.YOUTH_ARTBODY.indexOf('\n') > -1) {
        ARTBODYs = process.env.YOUTH_ARTBODY.split('\n');
    } else {
        ARTBODYs = [process.env.YOUTH_ARTBODY]
    };
    if (process.env.YOUTH_TIME && process.env.YOUTH_TIME.indexOf('&') > -1) {
        READTIME = process.env.YOUTH_TIME.split('&');
    } else if (process.env.YOUTH_TIME && process.env.YOUTH_TIME.indexOf('\n') > -1) {
        READTIME = process.env.YOUTH_TIME.split('\n');
    } else {
        READTIME = [process.env.YOUTH_TIME]
    }
    console.log(` ============脚本执行 - 北京时间 (UTC + 8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()} =============\n`);
 } else if(!$.isNode()&&cookieYouth.indexOf("#")>-1){
   cookieYouth = cookieYouth.split("#")
   ARTBODYs = ARTBODYs.split("&")
   READTIME = READTIME.split("&")
};
    Object.keys(cookieYouth).forEach((item) =>{
        if (cookieYouth[item]) {
        cookieArr.push(cookieYouth[item])
        }
    });
    Object.keys(ARTBODYs).forEach((item) =>{
        if (ARTBODYs[item]) {
            readArr.push(ARTBODYs[item])
        }
    });
    Object.keys(READTIME).forEach((item) =>{
        if (READTIME[item]) {
            timeArr.push(READTIME[item])
        }
    });
    timeZone =  new Date().getTimezoneOffset() / 60;
    timestamp = Date.now()+ (8+timeZone) * 60 * 60 * 1000;
    bjTime = new Date(timestamp).toLocaleString('zh',{hour12:false,timeZoneName: 'long'});
    console.log(`\n === 脚本执行 ${bjTime} ===\n`);
    console.log(` =========== 您共提供${cookieArr.length}个中青账号 ==========`);
}

if (isGetCookie = typeof $request !== 'undefined') {
   GetCookie();
   $.done()
};
!(async () => {
  if (!cookieArr[0]) {
    $.msg($.name, '【提示】请先获取中青看点一cookie',"",{'open-url': "https://kandian.youth.cn/u/mhkjN"})
    return;
  }
  for (let i = 0; i < cookieArr.length; i++) {
    cookie = cookieArr[i];
    if (cookie) {
      if (/^\{.+\}$/.test(cookie)) {
        // 旧ck数据，转换后再使用
        let RefererVal = JSON.parse(cookie).Referer;
        cookie = RefererVal.match(/&uid=\d+/) + RefererVal.match(/&cookie=[_a-zA-Z0-9-]+/) + RefererVal.match(/&cookie_id=[a-zA-Z0-9]+/);
      }
      articlebodyVal = readArr[i];
      timebodyVal = timeArr[i];
      $.index = i + 1;
    } else {
      continue;
    }
    myuid = cookie.match(/uid=\d+/);
    await userInfo();
    $.log(`\n********** ${nick} 现金收益: ${cash}元 ********\n`);
    await friendsign();
    await ExtraList();
    await TaskCenter() 
    await openbox();
    await getAdVideo();
    await gameVideo();
    await readArticle();
  $.log("开始转盘抽奖任务")
for (k=0;k<5;k++){
  await $.wait(s*1000);
  await rotary();

if (rotaryres.status == 0) {
      rotarynum = ` 转盘${rotaryres.msg}🎉`;
      break
   } else if(rotaryres.status == 1){
     console.log("等待"+s+"秒进行开始转盘任务")
     rotaryscore += rotaryres.data.score
     rotarytimes = rotaryres.data.remainTurn
  }
}

if (rotaryres.status == 1) {
  detail += `【转盘抽奖】+${rotaryscore}个青豆 剩余${rotaryres.data.remainTurn}次\n`;
  $.log(`转盘抽奖: 共计+${rotaryscore}个青豆 剩余${rotaryres.data.remainTurn}次`)
}
if (rotaryres.status !== 0&&rotaryres.data.doubleNum !== 0){
  detail += `【转盘双倍】+${doublerotary}青豆 剩余${rotaryres.data.doubleNum}次\n`
$.log(`转盘双倍: +${doublerotary}青豆 剩余${rotaryres.data.doubleNum}次`)
}
  await earningsInfo();
  await showmsg();
  if ($.isNode()&&rotaryres.status !== 0)
    if( rotarytimes && (100-rotarytimes)%95 == 0 && cash >= 10){
       await notify.sendNotify($.name + " " + nick, "您的余额约为"+cash+"元，已可以提现"+'\n'+`【收益总计】${signinfo.data.user.score}青豆  现金约${cash}元\n${detail}`)
    }
 }
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
 
function kdHost(api,body) {
  return {
    url: 'https://kd.youth.cn/'+api+`&${myuid}`,
    headers:{
     'Accept': '*/*',
     'Accept-Encoding': 'gzip, deflate, br',
     'Referer': 'https://kd.youth.cn/h5/20190301taskcenter/ios/index.html?'+cookie,
     'Host': 'kd.youth.cn',
     'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
     'X-Requested-With': 'XMLHttpRequest'
    },
    body: body,
    //timeout: 1000,
  }
}
function TaskCenter() {
  return new Promise((resolve, reject) =>{
    $.post(kdHost('WebApi/NewTaskIos/getTaskList?'), async(error, resp, data) =>{
      try {
        taskres = JSON.parse(data);
        //$.log(JSON.stringify(taskres,null,2))
        //return
        if (taskres.status == 1) {
          for (dailys of taskres.list.daily) {
            await $.wait(500);
            if (dailys.status == "1" && dailys.action != "") {
              $.log(dailys.title + "已完成 ，去领取奖励青豆");
              await $.wait(600);
              await getAction(dailys.reward_action)
            } else if (dailys.status == "2" && dailys.action != "") {
              $.log(dailys.title + "，" + dailys.but + "，已领取青豆" + dailys.score)
              detail += `【${dailys.title}】✅  ${dailys.score}青豆\n`
            }
            else if (dailys.title=="打卡赚钱"&&dailys.status == "0"&&ONCard == "true") {
             await CardStatus()
            }
            else if (dailys.id == "7" && dailys.status == "0") {
              await readTime();
             }
            else if (dailys.id == "4" && dailys.status == "0") {
              await getArt();
             }
            else if (dailys.id == "10" && dailys.status == "0") {
              $.log(dailys.title + "未完成，去做任务");
              for (x = 0; x < 5; x++) {
                $.log("等待5s执行第" + (x + 1) + "次");
                await $.wait(5000);
                await recordAdVideo(dailys.reward_action)
              }
              if (record.status == 0) {
                await getAction(dailys.reward_action);
              }
            }
          }
        }
      } catch(e) {
        $.log("获取任务失败，" + e)
      } finally {
        resolve()
      }
    })
  })
}

function getAction(acttype) {
   return new Promise((resolve, reject) =>{
        $.get(kdHost(`WebApi/NewTaskIos/sendTwentyScore?action=${acttype}`), (error, resp, data) =>{
            let actres = JSON.parse(data);
            if (actres.status == 1) {
                $.log("获得青豆" + actres.score)
            } else if (actres.status == 0) {
                $.log(actres.msg)
            }
            resolve()
        })
    })
}

function getsign() {
    return new Promise((resolve, reject) =>{
        $.post(kdHost('WebApi/NewTaskIos/sign'), async(error, resp, data) =>{
            signres = JSON.parse(data);
            if (signres.status == 2) {
                sub = `签到失败，Cookie已失效‼️`;
                $.msg($.name, sub, "");
                return;
            } else if (signres.status == 1) {
                detail = `【签到结果】成功 🎉 青豆: +${signres.score}，明日青豆: +${signres.nextScore}\n`;
                await comApp();
            } 
            resolve()
        })
    })
}
      
function getArt() {
  return new Promise((resolve, reject) =>{
    $.post(kdHost('WebApi/ArticleTop/listsNewTag'), async(error, resp, data) =>{
      artres = JSON.parse(data);
      if (artres.status == 1) {
        for (arts of artres.data.items) {
          titlename = arts.title;
          account = arts.account_id;
          if (arts.status == "1") {
            $.log("去转发文章");
            $.log(titlename + " ----- " + arts.account_name);
            await artshare(arts.id);
            break;
            //await $.wait(500)
          }
        }
      }
      resolve()
    })
  })
}

function artshare(artsid) {
  return new Promise((resolve, reject) =>{
    $.post(kdHost('WebApi/ShareNew/getShareArticleReward', cookie + "&" + "article_id=" + artsid), async(error, resp, data) =>{
      shareres = JSON.parse(data);
      if (shareres.status == 1) {
        $.log("转发成功，共计转发" + shareres.data.items.share_num + "篇文章，获得青豆" + shareres.data.score)
      }
      resolve()
    })
  })
}

function userInfo() {
    return new Promise((resolve, reject) => {
        $.post(kdHost('WebApi/NewTaskIos/getSign'), async(error, resp, data) => {
            signinfo = JSON.parse(data);
            if (signinfo.status == 1) {
                cash = signinfo.data.user.money;
                signday = signinfo.data.sign_day;
                totalscore = signinfo.data.user.score
                subTitle = `【收益总计】${totalscore}青豆  现金约${cash}元`;
                nick = `账号: ${signinfo.data.user.nickname}`;
               if(cookieArr.length ==1){
                $.setdata(nick,"zq_nick")
               } else {
                $.setdata("账号"+cookieArr.length+"合一","zq_nick")
               }
                if(parseInt(cash) >= withdrawcash && !withdrawBody == false){
                await withDraw()
               };
                if(signinfo.data.is_sign == false){
                await getsign();
              } else if(signinfo.data.is_sign == true){
                detail = `【签到结果】🔁 (今天+${signinfo.data.sign_score}青豆) 已连签${signday}天\n <本次收益>：\n`
              }; 
            if(signday==7){
              await SevCont();
             }
            } else {
                subTitle = `${signinfo.msg}`;
                detail = ``;
            }
            resolve()
        })
    })
}

function withDraw() {
    return new Promise((resolve, reject) => {
        const url = {
            url: withdrawUrl,
            headers: {
            'User-Agent': 'KDApp/2.0.0 (iPhone; iOS 14.5; Scale/3.00)'
            },
            body: withdrawBody,
        }
        $.post(url, (error, resp, data) => {
            withDrawres = JSON.parse(data)
            if (withDrawres.error_code == 0) {
              detail += `【自动提现】提现${withdrawcash}元成功\n`
            }else if(withDrawres.error_code == "10002"){
              $.log( `自动提现失败，${withDrawres.homeTime.text}`)
            } else {
              $.log( `自动提现失败，${withDrawres.message}`)
            }
            resolve()
        })
    })
}

function CardStatus() {
  return new Promise((resolve, reject) =>{
    $.get(kdHost('WebApi/PunchCard/getMainData?&' + cookie), async(error, resp, data) =>{
      punchcard = JSON.parse(data);
      if (punchcard.code == 1) {
        if (punchcard.data.user.status == 0 && $.time("HH") > "22") {
          await punchCard()
        } else if (punchcard.data.user.status == 1) {
           $.log("每日打卡已报名，请每天早晨"+cardTime+"点运行打卡");
          detail += `【打卡报名】🔔 待明早${cardTime}点打卡\n`
        } else if (punchcard.data.user.status == 3&&$.time("HH")==cardTime) {
          $.log("打卡时间已到，去打卡");
          await endCard()
        } else if (punchcard.data.user.status == 0) {
          $.log("今日您未报名早起打卡");
        }
      } else if (punchcard.code == 0) {
        $.log("打卡申请失败" + data)
      }
      resolve();
    })
  })
}

function punchCard() {
  return new Promise((resolve, reject) =>{
    $.post(kdHost('WebApi/PunchCard/signUp'), (error, response, data) =>{
      punchcardstart = JSON.parse(data);
      if (punchcardstart.code == 1) {
        detail += `【打卡报名】打卡报名${punchcardstart.msg}✅\n`;
        $.log("每日报名打卡成功，报名时间:" + `${$.time('MM-dd HH:mm')}`)
      } else {
        detail += `【打卡报名】🔔${punchcardstart.msg}\n`
        // $.log(punchcardstart.msg)
      }
      resolve();
    })
  })
}

//结束打卡
function endCard() {
  return new Promise((resolve, reject) =>{
      $.post(kdHost('WebApi/PunchCard/doCard?'), async(error, resp, data) =>{
        punchcardend = JSON.parse(data);
        if (punchcardend.code == 1) {
          detail += `【早起打卡】${punchcardend.data.card_time}${punchcardend.msg}✅\n`;
          $.log("早起打卡成功，打卡时间:" + `${punchcardend.data.card_time}`);
          await $.wait(1000);
          await Cardshare();
        } else if (punchcardend.code == 0) {
          // TODO .不在打卡时间范围内
          detail += `【早起打卡】${punchcardend.msg}\n`;
          // $.log("不在打卡时间范围内")
        }
        resolve()
      })
  })
}
//打卡分享
function Cardshare() {
  return new Promise((resolve, reject) =>{
    $.post(kdHost('WebApi/PunchCard/shareStart?'), async(error, resp, data) =>{
      sharestart = JSON.parse(data);
      //detail += `【打卡分享】${sharestart.msg}\n`
      if (sharestart.code == 1) {
        $.log("等待2s，去打卡分享")
        await $.wait(2000);
        $.post(kdHost('WebApi/PunchCard/shareEnd?'), (error, response, data) =>{
          shareres = JSON.parse(data);
          if (shareres.code == 1) {
            detail += ` +${shareres.data.score}青豆\n`
          } else {
            //detail += `【打卡分享】${shareres.msg}\n`
            //$.log(`${shareres.msg}`)
          }
          resolve()
        })
      }
    })
  })
}


function SevCont() {
    return new Promise((resolve, reject) =>{
        $.post(kdHost('WebApi/PunchCard/luckdraw?'), async(error, resp, data) =>{
            let sevres = JSON.parse(data); 
            if (sevres.code == 1) {
                detail += `【七日签到】 + ${sevres.data.score}青豆\n`
            } else if (sevres.code == 0) {
                //detail += `【七日签到】${sevres.msg}\n`;
                $.log(`七日签到:${sevres.msg}`)
            }
            resolve()
        })
    })
}


//开启时段宝箱
function openbox() {
  return new Promise((resolve, reject) =>{
    $.post(kdHost('WebApi/invite/openHourRed'), async(error, resp, data) =>{
      let boxres = JSON.parse(data);
      if (boxres.code == 1) {
        boxretime = boxres.data.time;
        detail += `【时段宝箱】 +${boxres.data.score}青豆，${boxres.data.time / 60}分钟后再次奖励\n`;
        await boxshare();
      } else {
        //detail += `【时段宝箱】${boxres.msg}\n`;
        $.log(`时段宝箱: ${boxres.msg}`)
      }
      resolve()
    })
  })
}

//宝箱分享
function boxshare() {
    return new Promise((resolve, reject) => {
       $.post(kdHost('WebApi/invite/shareEnd'), (error, resp, data) => {
           let shareres = JSON.parse(data);
           if (shareres.code == 1) {
                    detail += `【宝箱分享】+${shareres.data.score}青豆\n`
           } else {
                    //detail += `【宝箱分享】${shareres.msg}\n`;
                  //$.log(`${shareres.msg}`)
                }
                resolve()
          })
    })
}

function friendsign() {
  return new Promise((resolve, reject) =>{
    $.get(kdHost('WebApi/ShareSignNew/getFriendActiveList'), async(error, resp, data) =>{
      let addsign = JSON.parse(data);
      if (addsign.error_code == "0" && addsign.data.active_list.length > 0) {
        friendsitem = addsign.data.active_list;
        for (friends of friendsitem) {
          if (friends.button == 1) {
            await friendSign(friends.uid)
          }
        }
      }
      resolve()
    })
  })
}
function friendSign(uid) {
    return new Promise((resolve, reject) => {
        $.get(kdHost(`WebApi/ShareSignNew/sendScoreV2?friend_uid=${uid}`), (error, response, data) => {
            let friendres = JSON.parse(data);
            if (friendres.error_code == "0") {
                detail += `【好友红包】+${friendres.data[0].score}个青豆\n`;
               console.log(`好友签到，我得红包 +${friendres.data[0].score}个青豆`)
            }
            resolve()
        })
    })
}

//看视频奖励
function getAdVideo() {
  return new Promise((resolve, reject) =>{
    $.post(kdHost('taskCenter/getAdVideoReward','type=taskCenter'), (error, resp, data) =>{
      let adVideores = JSON.parse(data);
      if (adVideores.status == 1) {
        detail += `【观看视频】 +${adVideores.score}个青豆\n`;
        $.log("观看视频广告" + adVideores.num + "次 +" + adVideores.score + "青豆")
      }
      resolve()
    })
  })
}
function recordAdVideo(acttype) {
    return new Promise((resolve, reject) =>{
        $.get(kdHost(`WebApi/NewTaskIos/recordNum?action=${acttype}`), async(error, resp, data) =>{
            try {
                 record = JSON.parse(data);
            } catch(e) {
                $.log("获取任务失败，" + e)
            } finally {
                resolve()
            }
        })
    })
}

function batHost(api, body) {
    return {
        url: 'https://ios.baertt.com/v5/'+api,
        headers: {
            'User-Agent': 'KDApp/2.0.0 (iPhone; iOS 14.5; Scale/3.00)',
            'Host': 'ios.baertt.com',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    }
}

// 激励视频奖励
function gameVideo() {
    return new Promise((resolve, reject) => {
        $.post(batHost('Game/GameVideoReward.json', articlebodyVal), (error, resp, data) => {
            gameres = JSON.parse(data)
            if (gameres.success == true) {
                detail += `【激励视频】${gameres.items.score}\n`
                $.log("激励视频 "+gameres.items.score)
            }else{
                if(gameres.error_code == "10003"){
                    //detail += `【激励视频】${gameres.message}\n`
                  //$.log("激励视频 "+gameres.message)
                }
            }
            resolve()
        })
    })
}

function comApp() {
    return new Promise((resolve, reject) => {
        $.post(batHost('mission/msgRed.json',articlebodyVal), (error, response, data) => {
            redres = JSON.parse(data)
            if (redres.success == true) {
                detail += `【回访奖励】+${redres.items.score}个青豆\n`
            }else{
                if(redres.error_code == "100009"){
                   $.log( `回访奖励: ${redres.message}`)
                }
            }
            resolve()
        })
    })
}

//阅读奖励
function readArticle() {
    return new Promise((resolve, reject) => {
        $.post(batHost('article/complete.json',articlebodyVal), (error, response, data) => {
        try{
           readres = JSON.parse(data);
     if (data.indexOf('read_score')>-1&&readres.items.read_score!=0)  {
              detail += `【阅读奖励】+${readres.items.read_score}个青豆\n`;
              $.log(`阅读奖励 +${readres.items.read_score}个青豆`)
            } 
    else if (readres.items.max_notice == '看太久了，换1篇试试') {
              //detail += `【阅读奖励】看太久了，换1篇试试\n`;
              //$.log(readres.items.max_notice)
           }
         } catch(e) {
          $.logErr(e+resp);
        } finally {
          resolve()
        }
      })
    })
}

function readTime() {
    return new Promise((resolve, reject) => {
        $.post(batHost('user/stay.json',timebodyVal), (error, resp, data) => {
            let timeres = JSON.parse(data)
            if (timeres.error_code == 0) {
                readtimes = timeres.time / 60
                detail += `【阅读时长】共计` + Math.floor(readtimes) + `分钟\n`
              $.log(`阅读时长共计` + Math.floor(readtimes) + `分钟`)
            } else {
                if (timeres.error_code == 200001) {
                    detail += `【阅读时长】❎ 未获取阅读时长请求\n`
                }else{
                    detail += `【阅读时长】❎ ${timeres.msg}\n`
                $.log(`阅读时长统计失败，原因:${timeres.msg}`)
                }
            }
            resolve()
        })
    })
}

function ExtraList() {
  return new Promise( async (resolve, reject) =>{
    $.post(kdHost('WebApi/ShareNew/bereadExtraList'), async(error, resp, data) =>{
      extrares = JSON.parse(data);
      if (extrares.status == 2) {
        $.log("参数错误" + JSON.stringify(extrares));
      } else if (extrares.status == 1) {
        let hour = $.time('HH', $.utc8) - 0;
        for (let task of extrares.data.taskList) {
          if (task.action == 'time_packet_reward' && task.status == 1) {
            // 领取计时红包
            $.log(task.name + "可领取，去领青豆");
            await TimePacket(task.name);
          } else if ((hour >= 5 && hour <= 8 && task.action == 'beread_extra_reward_one') ||
            (hour >= 11 && hour <= 13 && task.action == 'beread_extra_reward_two') ||
            (hour >= 17 && hour <= 20 && task.action == 'beread_extra_reward_three')
          ) {
            if (task.status == 0) {
              $.log(task.name + "任务待分享, " + task.status_msg);
              await getArt();
            } else if (task.status == 1) {
              $.log(task.name + "任务待领取, " + task.status_msg);
              await execExtractTask(task.name, task.action);
            }
          }
        }
      }
      resolve()
    })
  })
}

function TimePacket(timetitle) {
  return new Promise((resolve, reject) =>{
    $.post(kdHost('WebApi/TimePacket/getReward', cookie), (error, resp, data) =>{
      let timeres = JSON.parse(data);
      if (timeres.code == 1) {
        $.log("获得" + timeres.data.score + "青豆");
        detail += "【" + timetitle + "】获得" + timeres.data.score + "青豆\n"
      } else if (timeres.code == 0) {
        $.log(timeres.msg)
      }
      resolve()
    })
  })
}

function execExtractTask(timetitle, actionKey) {
  return new Promise((resolve, reject) => {
    $.post(kdHost('WebApi/ShareNew/execExtractTask', cookie + '&action=' + actionKey), (error, resp, data) => {
      let timeres = JSON.parse(data);
      if (timeres.code == 1) {
        $.log("获得" + timeres.data.score + "青豆");
        detail += "【" + timetitle + "】获得" + timeres.data.score + "青豆\n"
      } else if (timeres.code == 0) {
        $.log(timeres.msg)
      }
      resolve()
    })
  })
}

//转盘任务
function rotary() {
  return new Promise((resolve, reject) =>{
      $.post(kdHost(`WebApi/RotaryTable/turnRotary?_=${Date.now()}&`,cookie), async(error, resp, data) =>{
        try {
          rotaryres = JSON.parse(data);      
        if (rotaryres.status==1){
           $.log("进行"+Number(100-rotaryres.data.remainTurn)+"次转盘，获得"+rotaryres.data.score+"青豆")
         if(rotaryres.data.score != 0&&rotaryres.data.doubleNum!=0){
          $.log("等待10s，获得双倍青豆")
           await $.wait(10000);
           await TurnDouble();
          }
          await rotaryCheck();
         }
        } catch(e) {
          $.logErr(e+resp);
        } finally {
          resolve()
        }
      })
  })
}

//转盘宝箱判断
function rotaryCheck() {
    return new Promise(async(resolve) => {
        let i = 0;
        while (i <= 3) {
            if (100 - rotaryres.data.remainTurn >= rotaryres.data.chestOpen[i].times&&rotaryres.data.chestOpen[i].received==0) {
                await runRotary(i + 1)
            }
            i++;
        }
      resolve();
    })
}

//开启宝箱
function runRotary(index) {
    return new Promise((resolve, reject) => {
        const rotarbody = cookie + '&num=' + index;
        $.post(kdHost(`WebApi/RotaryTable/chestReward?_=${Date.now()}&`,rotarbody), (error, resp, data) => {
        let rotaryresp = JSON.parse(data);
            if (rotaryresp.status == 1) {
                detail += `【转盘宝箱${index}】+${rotaryresp.data.score}个青豆\n`;
            }else{
                if(rotaryresp.code == "10010"){
                    detail += `【转盘宝箱${index}】+今日抽奖完成\n`;
                }
            }
            resolve();
        })
    })
}

//转盘双倍奖励
function TurnDouble() {
  return new Promise((resolve, reject) =>{
    $.post(kdHost(`WebApi/RotaryTable/toTurnDouble?_=${Date.now()}&`,cookie), (error, resp, data) =>{
      try {
        let Doubleres = JSON.parse(data);
        if (Doubleres.data.is_double == 1) {
          $.log("获得双倍青豆+" + Doubleres.data.score1);
          doublerotary += Doubleres.data.score
        }
      } catch(e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    })
  })
}
function earningsInfo() {
  return new Promise((resolve, reject) =>{
    $.get(kdHost(`wap/user/balance?`+cookie), (error, response, data) =>{
      infores = JSON.parse(data);
      if (infores.status == 0) {
        detail += ` <收益统计>：\n`
        for (i = 0; i < infores.history[0].group.length; i++) {
          detail += '【' + infores.history[0].group[i].name + '】' + infores.history[0].group[i].money + '个青豆\n'
        }
        detail += '<今日合计>： ' + infores.history[0].score + " 青豆"
      }
      resolve()
    })
  })
}
async function showmsg() {
       if (rotaryres.status == 1 && rotarytimes >= 97) {
          $.msg($.name + " " + nick, subTitle, detail)  //默认前三次为通知
        }else if (rotaryres.status == 1 && rotarytimes % notifyInterval == 0) {
        $.msg($.name + " " + nick, subTitle, detail) //转盘次数/间隔整除时通知;
        }else if (rotaryres.code == 10010 && notifyInterval != 0) {
         rotarynum = ` 转盘${rotaryres.msg}🎉`
         $.msg($.name+"  "+nick+" "+rotarynum,subTitle,detail)//任务全部完成且通知间隔不为0时通知;
        } 
     else {
       console.log(`\n【收益总计】${totalscore}青豆  现金约${cash}元\n`+ detail)
   }
}

function GetCookie(){if($request&&$request.method!=`OPTIONS`&&$request.url.match(/\/NewTaskIos\/getTaskList/)){RefererVal=$request.headers.Referer;signheaderVal=RefererVal.match(/&uid=\d+/)+RefererVal.match(/&cookie=[_a-zA-Z0-9-]+/)+RefererVal.match(/&cookie_id=[a-zA-Z0-9]+/);if(signheaderVal)$.setdata(signheaderVal,'youthheader_zq');$.log(`${$.name}获取Cookie: 成功, signheaderVal: $}`);$.msg($.name,`获取Cookie: 成功🎉`,``)}else if($request&&$request.method!=`OPTIONS`&&$request.url.match(/\/article\/complete/)){const articlebodyVal=$request.body;if(articlebodyVal)$.setdata(articlebodyVal,'read_zq');$.log(`${$.name}获取阅读: 成功, articlebodyVal: ${articlebodyVal}`);$.msg($.name,`获取阅读请求: 成功🎉`,``)}else if($request&&$request.method!=`OPTIONS`&&$request.url.match(/\/v5\/user\/stay/)){const timebodyVal=$request.body;if(timebodyVal)$.setdata(timebodyVal,'readtime_zq');$.log(`${$.name}获取阅读时长: 成功, timebodyVal: ${timebodyVal}`);$.msg($.name,`获取阅读时长: 成功🎉`,``)}else if($request&&$request.method!=`OPTIONS`&&$request.url.match(/\/withdraw\d?\.json/)){const withdrawVal=$request.body;const withdrawUrl=$request.url;if(withdrawVal)$.setdata(withdrawVal,'cashbody_zq');if(withdrawUrl)$.setdata(withdrawUrl,'cashurl_zq');$.log(`${$.name}, 获取提现请求: 成功, withdrawUrl: ${withdrawUrl}`);$.log(`${$.name}, 获取提现请求: 成功, withdrawBody: ${withdrawVal}`);$.msg($.name,`获取提现请求: 成功🎉`,``)}}

function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
