/*
本脚本用于中青看点极速版获取阅读数据及刷阅读得青豆、刷阅读时长得奖励，仅适用NE工具，因为脚本中有持久化操作

注意：去重排序模式是为了优化刷阅读任务的效率（单个有效视频数据阅读次数上限大，将其排前面，在循环阅读时有更多机会执行；移除中青判断为重复的数据，让阅读数据首次执行时获得更高奖励及避免循环阅读时因达到上限无法获得奖励，浪费一次阅读时间间隔的执行机会）

中青看点数据抓取Loon插件地址（QX开启解析器时可使用）：根据@Sunert大佬的获取中青ck代码改版成支持多账号
https://raw.githubusercontent.com/ztxtop/x/main/rewrite-zq.plugin

中青看点阅读数据抓取Loon插件地址（QX开启解析器时可使用）：
https://raw.githubusercontent.com/ztxtop/x/main/rewrite-zqread.plugin

*/

const $ = new Env(`中青阅读`);
$.suffix = i => i > 0 ? i + 1 + '' : '';
$.nowTime = new Date().getTime();
$.isRewrite = 'undefined' !== typeof $request;
$.isResponse = 'undefined' !== typeof $response;
$.isTask = `undefined` === typeof $request;

let readtimeKey = `readtime_zq`; // 阅读时长数据key
let nextReadTimeKey = `next_read_time`; // 达到阅读时长基线时，将明天凌晨0点0分的时间戳记录下来，执行阅读时长时，当前时间戳小于此值则不执行时长任务
let redKey = `red_zq`; // 惊喜红包数据key
let signKey = `youthheader_zq`; // 签到数据key
let mainKey = `read_zq`; // 阅读数据key
let numKey = `read_pre_num`; // 上条阅读数据序号
let countKey = `read_count`; // 阅读数据总记录数
let lastReplacedNo = `replaceable_idx`; // 最后一条视频数据序号
let nextExecReadTimeKey = `next_exec_read_time`; // 下次最快可执行的时间戳，当前时间戳大于此值时，方可执行任务

/**
 * 0-循环阅读：任务执行时间需大于21秒
 * 1-去重排序：根据响应数据判断重复并将视频往前排，依此优化阅读效率（可用半角逗号间隔该模式运行的账号，如账号一跟账号三才执行去重排序：1,1,3）
 * 3-备份数据：根据指定的备份格式，将要备份的数据以log的形式打印出来
 * 4-清空所有中青数据
 */
const rmArr = ($.getval('readMode') || '0').split(',');
const readMode = parseInt(rmArr[0]) || 0;

!(async () => {
  if ($.isRewrite) {
    // 重写请求截取数据
    $.idx = $.suffix(($.getval('zqSuffix') || '1') - 1); // 抓包账号扩展字符
    $.acName = $.name + ($.idx || '1');
    await getRequestData();
  } else if ($.isTask) { // 定时任务处理
    // 根据执行环境所在时区的时间，获得北京时间戳
    const currDate = new Date();
    const utc8 = currDate.getTime() + (currDate.getTimezoneOffset() * 60 * 1000) + 8 * 60 * 60 * 1000;
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
    $.log('', `======== 共${zqAc.length}个账号位，执行时间(UTC+8)：${new Date(utc8).toLocaleString()}  ========`, '');
    for (let acIdx of zqAc) {
      $.idx = $.suffix(acIdx-1);
      $.acName = $.name + ($.idx || '1');
      const count = ($.getval(countKey + $.idx) || 0) - 0;
      if (readMode === 4 && count > 0) {
        for (let i = 1; i <= count; i++) {
          $.setval('', mainKey + $.idx + '_' + i);
        }
        $.setval('', numKey + $.idx);
        $.setval('', countKey + $.idx);
        $.setval('', lastReplacedNo + $.idx);
        $.setval('', 'readMode');
        $.log('', '清空数据成功', '');
      } else if (readMode === 3 && count > 0) {
        printReadDataToLog(count);
        $.setval('0', 'readMode');
      } else if (readMode === 1) {
        if (count > 0) {
          let t = rmArr.slice(1);
          if (t.length == 0 || t.findIndex(o => o == acIdx) >= 0) {
            const videoCount = ($.getval(lastReplacedNo + $.idx) || '0') - 0;
            $.setval('', numKey + $.idx);
            $.setval('', lastReplacedNo + $.idx);
            $.setval('0', 'readMode');
            await deduplication(count, videoCount);
          }
        }
      } else {
        await Promise.all([
          execReadTime(),
          doReadTask(count)
        ]);
      }
    }
  }
})().catch((e) => $.logErr(e)).finally(() => $.done());

function getRequestData() {
  return new Promise(async resolve => {
    let subt = '重写数据';
    try {
      if ($request.method != 'OPTIONS' && $request.url.match(/\/article\/complete\.json/)) {
        subt = '新增阅读数据';
        let count = ($.getval(countKey + $.idx) || 0) - 0 + 1;
        $.setval($request.body, mainKey + $.idx + '_' + count);
        let currNum = ($.getval(numKey + $.idx) || 0) - 0 + 1;
        let tips = `新增第${count}条阅读数据，下次阅读第${currNum}条数据`;
        $.msg($.acName, subt, tips);
        $.setval(count + '', countKey + $.idx);
      } else if ($request.method != 'OPTIONS' && $request.url.match(/\/article\/info\/get\.json/)) {
        subt = '新增阅读数据new';
        let count = ($.getval(countKey + $.idx) || 0) - 0 + 1;
        $.setval($request.url.match(/\?(p=.+$)/)[1], mainKey + $.idx + '_' + count);
        let currNum = ($.getval(numKey + $.idx) || 0) - 0 + 1;
        let tips = `新增第${count}条阅读数据，下次阅读第${currNum}条数据`;
        $.msg($.acName, subt, tips);
        $.setval(count + '', countKey + $.idx);
      } else if ($request.method != 'OPTIONS' && $request.url.match(/\/v5\/user\/app_stay\.json/)) {
        subt = '获取iOS阅读时长数据';
        // 顺序提交两个阅读时长，检查数据记录的时长是多少
        let start = await execReadTime($request.body);
        let end = await execReadTime($request.body);
        let oldBody = $.getval(readtimeKey + $.idx);
        if (!oldBody || (start >= 0 && end > 0 && end - start > 60)) {
          // 已有时长数据时，仅存储大于60秒的阅读时长
          $.setval($request.body, readtimeKey + $.idx);
          let tips = `🎉获取阅读时长数据成功；每次上传时长为${end-start}秒`;
          $.msg($.acName, subt, tips);
        } else {
          $.log($.acName, subt, `😭获取阅读时长数据失败；上传时长仅${end-start}秒`);
        }
      } else if ($request.method != 'OPTIONS' && $request.url.match(/\/(TaskCenter|NewTaskIos)\/(sign|getSign)(\?.+)?$/)) {
        subt = '获取签到数据';
        let ckFormat = $.getval('ckFormat') || ''
        let cookie = JSON.stringify($request.headers);
        if (ckFormat == 'true' && $request.headers) {
          let RefererVal = $request.headers.Referer;
          cookie = RefererVal.match(/&uid=\d+/) + RefererVal.match(/&cookie=[_a-zA-Z0-9-]+/) + RefererVal.match(/&cookie_id=[a-zA-Z0-9]+/);
        }
        $.setval(cookie, signKey + $.idx);
        let tips = `🎉获取签到数据成功`;
        $.msg($.acName, '', tips);
      }
    } catch (e) {
      $.msg($.acName, `${subt}处理异常`, `原因: ${e}`);
    } finally {
      resolve();
    }
  });
}

function execReadTime(checkVal) {
  return new Promise(resolve => {
    let timebodyVal = checkVal || $.getval(readtimeKey + $.idx);
    if (!checkVal) {
      let nextReadTime = ($.getval(nextReadTimeKey + $.idx) || 0) - 0;
      if (!timebodyVal || $.nowTime < nextReadTime) {
        resolve();
        return;
      }
    }
    const opts = {
      url: `https://ios.baertt.com/v5/user/stay.json`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
      },
      body: timebodyVal
    }
    $.post(opts, (error, response, data) => {
      let time = -1;
      try {
        const obj = JSON.parse(data);
        if (obj['error_code'] == 0) {
          $.log('', `【阅读时长】共计` + Math.floor(obj.time / 60) + `分钟`, '');
          time = obj.time;
          if (obj.time >= Math.floor(Math.random() * (7200 - 9000) + 9000)) {
            // 时长达2小时+，设置下次执行时间需大于明天凌晨
            let nextTime = new Date();
            nextTime.setHours(0);
            nextTime.setMinutes(0);
            $.setval((nextTime.getTime() + 24 * 60 * 60 * 1000) + '', nextReadTimeKey + $.idx);
          }
        } else if (obj['error_code'] == 200001) {
          $.log('', `【阅读时长】❎ 统计失败，原因: 未获取阅读时长Cookie`, '');
        } else {
          $.log('', `【阅读时长】❎ 统计失败，原因: ${obj.msg}`, '');
        }
      } catch (e) {
        $.log('', `【阅读时长】❎ 统计异常，原因: ${e}`, `响应数据: ${data}`, '');
      } finally {
        resolve(time);
      }
    });
  });
}

function doReadTask(count) {
  return new Promise(async resolve => {
    if (count <= 0) {
      resolve();
      return;
    }
    try {
      let data;
      do {
        let currNum = ($.getval(numKey + $.idx) || 0) - 0 + 1;
        if ($.time('yyyy-MM-dd') != $.getval(`execDay${$.idx}`)) {
          // 今日未执行阅读任务，重置阅读位置
          currNum = 1;
          $.setval('', numKey + $.idx);
          $.setval($.time('yyyy-MM-dd'), `execDay${$.idx}`);
          $.setjson({'0':0, '3':0}, `execCount${$.idx}`);
          $.log('', `${$.acName}: 😄今日首次执行阅读的时间：${$.time('yyyy-MM-dd qq HH:mm:ss.S')}`, '');
        }
        currNum = currNum > count ? 1 : currNum;
        data = $.getval(mainKey + $.idx + '_' + currNum);
        if (data) {
          let nextExecTime = ($.getval(nextExecReadTimeKey + $.idx) || 0) - 0;
          if (nextExecTime <= $.nowTime) {
            if (currNum == 1) {
              $.msg($.acName, '', `🎉新一轮阅读任务(${($.getval(lastReplacedNo + $.idx) || '0') - 0}/${count})开始：${$.time('yyyy-MM-dd qq HH:mm:ss.S')}`);
            }
            // 记录下次最快执行时间为21秒之后
            $.setval(($.nowTime + 21000) + '', nextExecReadTimeKey + $.idx);
            await execRead(currNum, count, data);
          } else {
            let tips = '任务执行时间间隔过小，阅读任务执行间隔不能小于21秒';
            if ($.time('yyyy-MM-dd') != $.time('yyyy-MM-dd', nextExecTime)) {
              tips = '今日阅读到上限啦，去任务中心继续赚青豆吧';
            }
            $.log('', `${$.acName}:【${currNum}/${count}】⚠️ ${tips}`, `下次最早可执行时间: ${$.time('yyyy-MM-dd HH:mm:ss', nextExecTime)}`, `当前视频记录数：${($.getval(lastReplacedNo + $.idx) || '0') - 0}`, '');
          }
        } else {
          $.msg($.acName, '', `${$.acName}:【${currNum}/${count}】待处理数据不存在，移动最后一条数据到此处后再重试`);
          transfer(currNum, count, '');
          count--;
        }
      } while (!data && count > 0);
      resolve();
    } catch (e) {
      resolve();
      $.log('', `${$.acName}异常，原因: ${e}`, '');
    }
  });
}

function execRead(currNum, count, body) {
  return new Promise(async resolve => {
    let subt = '执行阅读任务';
    try {
      const opts = {
        url: `https://ios.baertt.com/v5/article/complete.json`,
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
        },
        body: body,
      }
      $.post(opts, async (error, response, resData) => {
        try {
          if (resData) {
            let obj = JSON.parse(resData);
            let readScore = obj.items && obj.items['read_score'];
            const videoNo = ($.getval(lastReplacedNo + $.idx) || 0) - 0;
            if (readScore > 0) {
              // 如果为视频阅读数据，在已执行过去重排序操作后，判断当前数据的位置是否在视频记录数之后，是则重新归并到视频范围中（去重操作无法识别已删除的阅读数据类型，会暂时归并到文章中）
              if (obj.items['ctype'] == 3 && videoNo > 0 && currNum > videoNo) {
                transfer(currNum, count, 1);
              }
              // 领激励视频奖励,其实只能领15次
              if (currNum <= 15) await gameVideo(body);
              $.log('', `${$.acName}:【${currNum}/${count}】😄${obj.items['ctype']}阅读任务获取青豆奖励：${readScore}`, '');
              // 获取奖励成功，记录奖励次数，一种类型的阅读设置最大只能获取300次
              let ecObj = $.getjson(`execCount${$.idx}`) || {'0':0, '3':0};
              ecObj[obj.items['ctype']] = (ecObj[obj.items['ctype']] || 0) - 0 + 1;
              $.setjson(ecObj, `execCount${$.idx}`);
            } else if (readScore == 0) {
              // 该阅读已达今日领取上限，根据情况决策是否设置下次执行任务的位置或时间
              if (videoNo > 0 && obj.items['ctype'] == 3 && obj.items['max_video'] == 1) {
                // 视频任务达上限，切换到文章任务序号，待下次执行
                const articleNo = Math.max(1, videoNo + 1);
                $.log('', `${$.acName}:【${currNum}/${count}】😄视频任务已达今日奖励上限，下次执行文章阅读任务位置：${articleNo}`, '');
                currNum = articleNo > currNum ? articleNo - 1 : currNum;
              } else if (videoNo > 0 && obj.items['ctype'] == 0 && obj.items['max_article'] == 1) {
                // 文章任务达上限，切换到视频任务序号，待下次执行
                $.log('', `${$.acName}:【${currNum}/${count}】😄文章任务已达今日奖励上限，下次执行视频阅读任务位置：1`, '');
                currNum = 0;
              } else if (obj.items['max_notice'] == '\u4eca\u65e5\u9605\u8bfb\u5230\u4e0a\u9650\u5566\uff0c\u53bb\u4efb\u52a1\u4e2d\u5fc3\u7ee7\u7eed\u8d5a\u9752\u8c46\u5427') {
                // 今日阅读到上限啦，去任务中心继续赚青豆吧
                $.msg($.acName, '', `${$.acName}:【${currNum}/${count}】🥺${obj.items['max_notice']}`);
                // 阅读达每日上限，设置第二天才能调用阅读接口
                let nextTime = new Date($.nowTime);
                nextTime.setHours(0);
                nextTime.setMinutes(0);
                $.setval((nextTime.getTime() + 24 * 60 * 60 * 1000) + '', nextExecReadTimeKey + $.idx);
              } else {
                $.log('', `${$.acName}:【${currNum}/${count}】😒${obj.items['ctype']}阅读任务未获取到青豆奖励，进入下一个阅读任务`, '');
              }
            } else {
              if (!obj.items) {
                $.msg($.acName, `【${currNum}/${count}】⚠️阅读出现未知情况，跳过此数据`, resData);
              } else {
                let ecObj;
                if (videoNo > 0 && currNum < videoNo && (ecObj = $.getjson(`execCount${$.idx}`)) && (ecObj['3'] || 0) >= 300) {
                  currNum = videoNo;
                  $.log('', `${$.acName}:【${currNum}/${count}】⚠️无奖励信息，执行间隔过短或账号异常了，当前为视频数据范围，下次尝试执行文章任务`);
                } else {
                  $.log('', `${$.acName}:【${currNum}/${count}】⚠️无奖励信息，执行间隔过短或账号异常了，跳过此数据`);
                }
              }
            }
            // 记录当前阅读任务序号，以便下次任务可执行下一个阅读任务
            $.setval(currNum + '', numKey + $.idx);
          } else {
            $.log('', `${$.acName}:【${currNum}/${count}】⚠️ 请求无响应体数据: ${resData}`, '');
          }
        } catch (e) {
          $.log('', `${$.acName}:【${currNum}/${count}】⚠️ 执行异常，原因: ${e}`, '');
        } finally {
          resolve();
        }
      });
    } catch (e) {
      $.msg($.acName, `${subt}处理异常`, `原因: ${e}`);
      resolve();
    }
  });
}

// 阅读数据去重
async function deduplication(count, videoCount) {
  $.log('', `${$.acName}: 开始执行去重任务,原统计视频记录数：${videoCount}`, '');
  let acIds = [];
  let unknowCount = 0;
  videoCount = 0;
  for (let i = 1; i <= count; i++) {
    let body = $.getval(mainKey + $.idx + '_' + i);
    if (body) {
      // 有数据，获取对应阅读数据信息
      let article = await getArticleInfo(body);
      if (article.acId) {
        // 获得阅读页面ID
        if (acIds.includes(article.acId)) {
          // 重复，移除掉
          transfer(i, count, 0);
        } else {
          if (article.ctype == 3) {
            // ctype=0是阅读数据，ctype=3是视频数据，视频数据尝试往前移动
            transfer(i, count, 1);
            videoCount++;
          }
          acIds.push(article.acId);
        }
      } else {
        unknowCount++;
        $.log('', `${$.acName}:【${i}/${count}】获取阅读信息失败: ${article.message || '本条数据跳过去重处理'}`, '');
      }
    } else {
      // 无数据，移除掉
      transfer(i, count, '');
      count--;
      i--;
    }

    if (i > 0 && i % 50 == 0) {
      // 每处理50条数据，打印一次进度日志
      $.log('', `${$.acName}:当前总阅读数：${count}、当前已处理记录数：${i}`, '');
    }
  }
  $.msg($.acName, `视频记录数：${videoCount}`, unknowCount > 0 ? `有${unknowCount}条阅读数据无法识别信息将在循环阅读任务时修正其排序` : '');
}

// 获取阅读数据相关信息
function getArticleInfo(body) {
  return new Promise(resolve => {
    if (!body) {
      resolve({});
      return;
    }
    const opts = {
      url: `https://ios.baertt.com/v5/article/info/get.json?${body}`,
      headers: {
        'User-Agent': 'KDApp/1.8.2 (iPhone; iOS 14.3; Scale/2.00)'
      },
      opts: {
        'filter': "try {var od = JSON.parse(body);let acId = '';acId = (acId = (obj.url || '').match(/.+\/(\d+)$/)) && acId[1];return JSON.stringify({error_code: od['error_code'],ctype: od['ctype'],qxAcId: acId})} catch (e) {return `=> QX过滤器发生错误: ${e.message}`}"
      }
    }
    $.get(opts, (error, response, data) => {
      let rtObj = {};
      try {
        if (error) {
          throw new Error(error);
        } else {
          const obj = JSON.parse(data || '{}');
          if (obj['error_code'] == 0) {
            let acId = '';
            acId = obj.qxAcId || ((acId = (obj.url || '').match(/.+\/(\d+)$/)) && acId[1]);
            rtObj.acId = acId;
            rtObj.ctype = obj.ctype;
            if (!acId) {
              $.logErr(`响应码正常，但未获取到阅读数据页面ID, 结果：${data}`)
            }
          } else {
            rtObj.message = obj.message;
          }
        }
      } catch (e) {
        $.log('', `${$.acName}:【阅读数据去重】❎ 去重异常，原因: ${e}`, `数据信息: ${data}`, '');
      } finally {
        resolve(rtObj);
      }
    });
  });
}

function transfer(currNum, count, flag) {
  if (!flag) {
    if (flag === 0) {
      $.log('', `${$.acName}:【${currNum}/${count}】移除的重复数据: \n${$.getval(mainKey+$.idx + '_' + currNum)}`, '');
    }
    // 当前位置数据为空或判定为重复数据，移动最后一个数据到当前位置，等待下次执行
    if (currNum < count) {
      const lastNode = $.getval(mainKey + $.idx + '_' + count);
      $.setval(lastNode, mainKey + $.idx + '_' + currNum);
    }
    $.setval('', mainKey + $.idx + '_' + count);
    $.setval((count > 1 ? count - 1 : 0) + '', countKey + $.idx);
  } else if (currNum > 0) {
    // 当前位置数据为视频类型，尝试将其迁移到前面，如果前面全是视频类型的数据，则仅更新视频记录数
    const videoNo = Math.max(1, ($.getval(lastReplacedNo + $.idx) || '0') - 0 + 1);
    if (videoNo < currNum) {
      $.log('', `${$.acName}:【${currNum}/${count}】任务排序交换位置：${currNum} ↔️ ${videoNo}😊 `, '');
      // 获取待交换位置的两个数据，并执行替换
      const currData = $.getval(mainKey + $.idx + '_' + currNum);
      const swapNode = $.getval(mainKey + $.idx + '_' + videoNo);
      $.setval(currData, mainKey + $.idx + '_' + videoNo);
      $.setval(swapNode, mainKey + $.idx + '_' + currNum);
    }
    // 保存最后一个视频数据的序号
    $.setval(Math.min(videoNo, currNum) + '', lastReplacedNo + $.idx);
  } else {
    $.msg($.acName, '任务排序', `🤔️ 待前移的任务数据的序号小于1？：${currNum}`);
  }
}

// 激励视频奖励
function gameVideo(bodyVal) {
  return new Promise((resolve, reject) => {
    const url = {
      url: `https://ios.baertt.com/v5/Game/GameVideoReward.json`,
      body: bodyVal,
    }
    $.post(url, (error, response, data) => {
      let desc = data && data.match(/"score":"(.+?)"/);
      if (desc) {
        $.log('', `${$.acName}:【激励视频】: ${desc[1]}`, '');
      } else {
        $.log('', `${$.acName}:【激励视频】: ${data}`, '');
      }
      resolve();
    })
  })
}

function printReadDataToLog(count) {
  let allData = [];
  $.scheme = $.getval('zqReadScheme') || '';
  for (let i = 1; i <= count; i++) {
    const data = $.getval(mainKey + $.idx + '_' + i);
    if (data) {
      switch ($.scheme) {
        case 'QX': {
          allData.push(`$prefs.setValueForKey('${data}', '${mainKey+$.idx}_${i}');`);
          break;
        };
      case 'LS': {
        allData.push(`$persistentStore.write('${data}', '${mainKey+$.idx}_${i}');`);
        break;
      };
      case 'GA': {
        allData.push(data);
        break;
      };
      default: {
        if ($.isQuanX) {
          allData.push(`$prefs.setValueForKey('${data}', '${mainKey+$.idx}_${i}');`);
        } else {
          allData.push(`$persistentStore.write('${data}', '${mainKey+$.idx}_${i}');`);
        }
      }
      }
    }
  }
  if (allData.length > 0) {
    const videoNo = Math.max(0, ($.getval(lastReplacedNo + $.idx) || '0') - 0);
    const signVal = $.getval(signKey + $.idx) || '';
    const redVal = $.getval(redKey + $.idx) || '';
    const readtimeVal = $.getval(readtimeKey + $.idx) || '';
    switch ($.scheme) {
      case 'QX': {
        allData.push(`$prefs.setValueForKey('${videoNo}', '${lastReplacedNo+$.idx}');`);
        allData.push(`$prefs.setValueForKey('${count}', '${countKey+$.idx}');`);
        allData.push(`$prefs.setValueForKey('${signVal}', '${signKey+$.idx}');`);
        allData.push(`$prefs.setValueForKey('${redVal}', '${redKey+$.idx}');`);
        allData.push(`$prefs.setValueForKey('${readtimeVal}', '${readtimeKey+$.idx}');`);
        break;
      };
    case 'LS': {
      allData.push(`$persistentStore.write('${videoNo}', '${lastReplacedNo+$.idx}');`);
      allData.push(`$persistentStore.write('${count}', '${countKey+$.idx}');`);
      allData.push(`$persistentStore.write('${signVal}', '${signKey+$.idx}');`);
      allData.push(`$persistentStore.write('${redVal}', '${redKey+$.idx}');`);
      allData.push(`$persistentStore.write('${readtimeVal}', '${readtimeKey+$.idx}');`);
      break;
    };
    case 'GA': {
      allData = [allData.join('&')];
      break;
    };
    default: {
      if ($.isQuanX) {
        allData.push(`$prefs.setValueForKey('${videoNo}', '${lastReplacedNo+$.idx}');`);
        allData.push(`$prefs.setValueForKey('${count}', '${countKey+$.idx}');`);
        allData.push(`$prefs.setValueForKey('${signVal}', '${signKey+$.idx}');`);
        allData.push(`$prefs.setValueForKey('${redVal}', '${redKey+$.idx}');`);
        allData.push(`$prefs.setValueForKey('${readtimeVal}', '${readtimeKey+$.idx}');`);
      } else {
        allData.push(`$persistentStore.write('${videoNo}', '${lastReplacedNo+$.idx}');`);
        allData.push(`$persistentStore.write('${count}', '${countKey+$.idx}');`);
        allData.push(`$persistentStore.write('${signVal}', '${signKey+$.idx}');`);
        allData.push(`$persistentStore.write('${redVal}', '${redKey+$.idx}');`);
        allData.push(`$persistentStore.write('${readtimeVal}', '${readtimeKey+$.idx}');`);
      }
    }
    }
    $.log('', ...allData, '');
  } else {
    $.log('', `${$.acName}:【打印数据】暂无阅读数据`, '');
  }
}

// 公共tools
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}