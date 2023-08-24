/*
5 8 * * * ck_ccb.js
*/
const utils = require('./utils');
const fetch = require('node-fetch');
const Env = utils.Env;
const $ = new Env('建行生活');
const getData = utils.getData;
const sleep = utils.sleep;
const notify = require('./sendNotify');
const AsVow = getData().CCB_LIFE;
var desp = '';
var info = '';
headers = {
    "Host": "yunbusiness.ccb.com",
    "Accept": "application/json,text/javascript,*/*",
    "Content-Type": "application/json;charset=UTF-8",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/CloudMercWebView/UnionPay/1.0 CCBLoongPay",
}

ccb_life();

async function ccb_life() {
    if (AsVow) {
        for (i in AsVow) {
            bodydata = JSON.parse(AsVow[i].body)
            headers['skey'] = AsVow[i].skey
            pat1 = /cityid=([0-9]+)/g
            pat2 = /userCityId=([0-9]+)/g
            cityid = pat1.exec(bodydata.ENCRYPT_MSG)
            usercityid = pat2.exec(bodydata.ENCRYPT_MSG)
            info +=`=== 正对在第 ${i+1} 个账号签到===\n`
            await get_Param(cityid[1],usercityid[1]).then (function(data){param_link = data});
            delete headers['Content-Type']
            delete headers['Accept']
            delete headers['skey']
            headers["Host"] = "fission-events.ccbft.com"
            await get_Cookie(param_link).then (function(data){cookies = data});
            headers["X-XSRF-TOKEN"] = decodeURIComponent(cookies.token)
            headers["Cookie"] = "XSRF-TOKEN=" + cookies.token + ";_session=" + cookies.session
            await get_Info().then (function(data){sign_str = data});
            if (sign_str){
                info += "今日已签过到！\n"
            } else {
                await sign();
            }
            desp += info;
            info = '';
        }
        info = desp;
        console.log(info);
        notify.sendNotify('建行生活', info);
    } else {
        info = '签到失败：请先获取Cookie⚠️';
        notify.sendNotify('建行生活', info);
    }
    $.done()
}

// 获取Param参数
function get_Param(t,b) {
    url = `https://yunbusiness.ccb.com/basic_service/txCtrl?txcode=A3341SB06`
    return new Promise(resolve => {
       fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(bodydata),
        }).then(function(response) {
          return response.json()
        }).then(function(body) {
          tmp = "https://fission-events.ccbft.com/a/31/AZGlA939?ccbParamSJ=" + encodeURIComponent(body["data"]["ENCRYPTED_MSG"]) + `&cityid=${t}&CITYID=${t}&userCityId=${b}&USERCITYID=${b}`
          console.log("ParamSJ链接为：\n" + tmp + "\n\n")
          resolve(tmp)
        }).catch(function(e) {
          const error = '获取Param出现错误，请检查⚠️';
          console.log(error + '\n' + e);
        })
    });
}

//获取cookie和token
function get_Cookie(t) {
    url = `${t}`;
    return new Promise(resolve => {
       fetch(url, {
          method: 'GET',
          headers: headers,
          redirect: 'manual',
        }).then(function(response) {
          cookies = {}
          tmp = response.headers.get('set-cookie')
          pat1 = /_session=([\w%]+);/g
          pat2 = /XSRF-TOKEN=([\w%]+);/g
          session = pat1.exec(tmp)
          token = pat2.exec(tmp)
          cookies.session = session[1]
          cookies.token = token[1]
          console.log("session参数为：\n"+ cookies.session + "\ntoken参数为：\n"+ cookies.token + "\n\n")
          resolve(cookies)
        }).catch(function(e) {
          const error = '获取cookie出现错误，请检查⚠️';
          console.log(error + '\n' + e);
        })
    });
}

//查看是否已签过到
function get_Info() {
    url = "https://fission-events.ccbft.com/activity/autographnew/info/31/LmqJbkZ6"
    return new Promise(resolve => {
       fetch(url, {
          method: 'GET',
          headers: headers,
        }).then(function(response) {
          return response.json()
        }).then(function(body) {
          if (body.message.includes("成功")){
              tmp = body.data.today_is_register
              console.log("今天是否已签过到：" + tmp + "\n")
          } else {
              console.log(body)
          }
          resolve(tmp)
        }).catch(function(e) {
          const error = '获取Info出现错误，请检查⚠️';
          console.log(error + '\n' + e);
        })
    });
}

//签到
function sign() {
    url = "https://fission-events.ccbft.com/activity/autographnew/register/31/LmqJbkZ6"
    return new Promise(resolve => {
       fetch(url, {
          method: 'POST',
          headers: headers,
        }).then(function(response) {
          return response.json()
        }).then(function(body) {
          if (body.message.includes("成功")){
              info += `已连续签到 ${body.data.continue_register_num}天\n`;
          } else {
              console.log(body)
          }
        }).catch(function(e) {
          const error = '签到出现错误，请检查⚠️';
          console.log(error + '\n' + e);
        }).finally(() => {
            resolve()
        })
    });
}
module.exports = ccb_life;
