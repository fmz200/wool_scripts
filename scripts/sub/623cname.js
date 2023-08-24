// 2023-06-23 14:45:57
const $ = $substore,
bl = $arguments["bl"],
yw = $arguments["yw"],
isp = $arguments["isp"],
yun = $arguments["yun"],
city = $arguments["city"],
flag = $arguments["flag"],
game = $arguments["game"],
yuan = $arguments["yuan"],
sheng = $arguments["sheng"],
offtz = $arguments["offtz"],
debug = $arguments["debug"],
numone = $arguments["snone"],
keyp = "3.s",
h = $arguments.h ? decodeURI($arguments.h) : "",
min = $arguments.min ? decodeURI($arguments.min) : "",
tzname = $arguments.tz ? decodeURI($arguments.tz) : "",
firstN = $arguments.name ? decodeURI($arguments.name) : "";
const FGF = $arguments.fgf == undefined ? " " : decodeURI($arguments.fgf),
  XHFGF = $arguments.sn == undefined ? " " : decodeURI($arguments.sn),
  { isLoon: isLoon, isSurge: isSurge } = $substore.env, dns = $arguments["dnsjx"],target = isLoon ? "Loon" : isSurge ? "Surge" : undefined,keypr= "peedtest";
let cd = $arguments["cd"] ? $arguments["cd"] : 460, timeout = $arguments["timeout"] ? $arguments["timeout"] : 1520, writet = "", innum = 1728e5, loontrue = false, onen = false, Sue = false, v4 = false, v6 = false, isNoAli = false;
if (min !== "") {
  Sue = true;
  innum = parseInt(min, 10) * 6e4;
  writet = $persistentStore.write(JSON.stringify(innum), "time-cache");
} else if (h !== "") {
  Sue = true;
  innum = parseInt(h, 10) * 36e5;
  writet = $persistentStore.write(JSON.stringify(innum), "time-cache");
} else {
  writet = $persistentStore.write(JSON.stringify(innum), "time-cache");
}
const nlc =
  /\u9080\u8bf7|\u8fd4\u5229|\u5faa\u73af|\u5b98\u7f51|\u5ba2\u670d|\u7f51\u7ad9|\u7f51\u5740|\u83b7\u53d6|\u8ba2\u9605|\u6d41\u91cf|\u5230\u671f|\u4e0b\u6b21|\u7248\u672c|\u5b98\u5740|\u5907\u7528|\u5230\u671f|\u8fc7\u671f|\u5df2\u7528|\u56fd\u5185|\u56fd\u9645|\u56fd\u5916|\u8054\u7cfb|\u90ae\u7bb1|\u5de5\u5355|\u8d29\u5356|\u5012\u5356|\u9632\u6b62|(\b(USE|USED|TOTAL|EXPIRE|EMAIL)\b)|\d\s?g/i;

// const regexArray = [/\u6e38\u620f|game/i];
// const valueArray = ["Game"];
async function operator(e) {
  let cs = 0;
  const startTime = new Date();
  const support = isLoon || isSurge;
  if (!support) {$.error(`No Loon or Surge`);
    return e;
  }
  if (typeof scriptResourceCache === "undefined") {
    console.log("\nNCNAME: 不支持此 SubStore,\n查看脚本说明\nhttps://github.com/Keywos/rule/raw/main/cname.js");
    if (target == "Surge") {
      $notification.post("NCNAME Sub-Store未更新","","请点击或查看log查看脚本说明安装对应版本",{url: "https://github.com/Keywos/rule/raw/main/Sub-Store/Sub-Store.sgmodule",});
    } else if (target == "Loon") {
      $notification.post("NCNAME Sub-Store未更新","","请点击安装插件, 或查看log安装对应版本, 并关闭原本的substore","loon://import?plugin=https://gitlab.com/lodepuly/vpn_tool/-/raw/main/Tool/Loon/Plugin/Sub-Store.plugin");
    }
    return e;
  }
  var bs = $arguments["bs"] ? $arguments["bs"] : 12;
  const ein = e.length;
  console.log(`设定api超时: ${zhTime(timeout)}`);
  console.log(`有缓api超时: ${zhTime(cd)}`);
  console.log(`批处理节点数: ${bs} 个`);
  console.log(`开始处理节点: ${ein} 个`);
//   console.log(`\n\n设定api超时: ${zhTime(timeout)}\n有缓api超时: ${zhTime(cd)}\n批处理节点数: ${bs} 个\n开始处理节点: ${ein} 个`);
  e = e.filter((item) => !nlc.test(item.name));
  let o = 0,Pushtd = "",intimed = "",stops = false,rere=false;
  do {
    while (o < e.length && !stops) {
      const batchs = e.slice(o, o + 1);
      await Promise.all(
        batchs.map(async (pk) => {
          try {
            const inss = new Map();
            const id = getid(pk);
            if (inss.has(id)) {
              return inss.get(id);
            }
            const cacheds = scriptResourceCache.get(id);
            if (cacheds) {
              if (!onen) {
                timeout = cd;
                onen = true;
                stops = true;
              }
              const readt = scriptResourceCache.gettime(id);
              let nt = new Date().getTime();
              let timedPush = "";
              if (target == "Loon") {
                let loontd = "";
                const loonkkk={"1分钟":6e4,"5分钟":3e5,"10分钟":6e5,"30分钟":18e5,"1小时":36e5,"2小时":72e5,"3小时":108e5,"6小时":216e5,"12小时":432e5,"24小时":864e5,"48小时":1728e5,"72小时":2592e5,参数传入:"innums"};
                intimed = $persistentStore.read("节点缓存有效期");
                loontd = loonkkk[intimed] || 1728e5;
                if (loontd == "innums") {
                  loontd = innum;
                }
                timedPush = zhTime(
                  parseInt(readt, 10) - nt + parseInt(loontd, 10)
                );
              } else if (target == "Surge" && Sue) {
                timedPush = zhTime(
                  parseInt(readt, 10) - nt + parseInt(innum, 10)
                );
              } else {
                timedPush = zhTime(
                  parseInt(readt, 10) - nt + parseInt(TIMEDKEY, 10)
                );
              }
              Pushtd = `, ${timedPush}后过期 \n`;
            }
          } catch (err) {}
        })
      );
      o += 1;
    }
    let i = 0;
    while (i < e.length) {
      const batch = e.slice(i, i + bs);
      await Promise.all(
        batch.map(async (pk) => {
          try {
// console.log("开始")
// console.log(pk.server)
            let keyover = [], Yserver = pk.server,luodi = "",inQcip = "",nxx = "",adflag = "",isCN = false, OGame="",Oisp="",Oispflag="",Osh="", Oct="",zhi = "";
            const inServer = await AliD(Yserver);
            switch (inServer) { // 入口 server
              case "keyn":
                isNoAli = true;
                inServer = Yserver;
                break;
              default:
                pk.keyrk = inServer;
                if (!isNoAli) {
                  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(inServer)) {
                    v4 = true;
                  } else if (/^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(inServer)) {
                    v6 = true;
                  }
                }
                break;
            }
            let inSpCn="",inSpSheng="",inSpCity="",inSpIsp="",inSpIp=""; //入口speedapi
            let inUsq="",inUs="",inCity="",inQuery="",inIpSh=""; //入口ipapi
            let outUsq="",outUs="",outCity="",outQuery=""; //落地
            const outip = await OUTIA(pk);
            // console.log(outip)
            ({country:outUsq, countryCode:outUs, city:outCity, query:outQuery} = outip);//落地

// console.log(outQuery)countryCode
            debug && (pk.keyoutld = outip);
            // if (debug) {
            //   pk.keyoutld = outip;
            // }
            
            luodi = (outUsq === "中国") ? outCity : (yw ? outUs : outUsq);
            let btip = outQuery !== inServer
// console.log(btip)
 
              // case (!isNoAli && v4 && (outQuery !== inServer)):
              if ((!isNoAli || v4) && btip){
                const spkey = await SPEC(Yserver, inServer);//入口国内api查询
                ({country:inSpCn,regionName:inSpSheng,city:inSpCity,isp:inSpIsp,ip:inSpIp} = spkey);//入口speedapi
    // console.log(inSpCn)
    // console.log(inSpCity)
                debug && (pk.keyinsp = spkey);
                isCN = inSpCn === "中国";
    // console.log(isCN)
                // if (spkey.country === "中国") {isCN=true} 
                debug && (pk.keyinsp = spkey, console.log("国内入口 " + JSON.stringify(spkey)), console.log("落地信息 " + JSON.stringify(outip)))
                const keycm = {电信:"🅳", 联通:"🅻", 移动: "🆈",广电:"🅶"};
                if (isCN){
                    inQcip = inSpIp;
                    if(isp && flag){
                        // console.log(inSpIsp)
                        inSpIsp=inSpIsp.replace(/中国/g, "")
                        flag && (Oispflag = keycm.hasOwnProperty(inSpIsp) ? keycm[inSpIsp] : "🅲");
                    } else if(isp){
                        Oisp = /电信|联通|移动|广电/.test(inSpIsp) ? inSpIsp.replace(/中国/g, "") : "企业";
                    }
                    sheng && (Osh = inSpSheng);
                    city && (Oct = inSpCity);
                }    
            }
            

            if ((isNoAli || v6 || !isCN) && btip){
                    const inip = await INIA(Yserver);//ipapi入口
                    ({country:inUsq, countryCode,inUs, city:inCity, query:inQuery, regionName:inIpSh} = inip);//入口ipapi
                    // console.log(inUsq)
                    // console.log(inUs)
                    debug && (pk.keyinipapi = inip);
                    inQcip = inQuery; //去重ip
                    if (inUsq === "中国") {
                        // inCity === inUs ? (incity=inCity) 
                        if(inCity === inIpSh){
                            inIpSh="";
                        }
                        sheng && (Osh = inIpSh);
                        city && (Oct = inCity);
                    // 运营商 未知
                        flag && (Oispflag = "🅲");

                    } else {
                        // console.log("-----")
                        // console.log(inip)
                        // console.log(outip)
                        // console.log(inQuery+"||"+outQuery)
                        // console.log(inQuery)
                        // console.log(outQuery)
                        // console.log("-----")
                        if(inQuery === outQuery){
                            flag && (Oispflag = "🆉");
                            // zhi = sheng || city ? "直连" : zhi;
                            (sheng || city || isp) && (zhi  = "直连");
                        } else if (yuan){
                            flag && (Oispflag = "🅲");
                            (sheng || city || isp) && (zhi  = inUsq);
                        } else {
                            flag && (Oispflag = "🆇");
                            (sheng || city || isp) && (zhi  = "境外");
                        }
                    }
            }

            if(!btip){
                flag && (Oispflag = "🆉");
                (sheng || city || isp) && (zhi  = "直连");
            }


            flag && (adflag = getflag(outUs));
            game && (OGame = /game|游戏/i.test(pk.name) ? (flag ? "🎮" : FGF+"Game") : OGame);
            if (bl){
                const match = pk.name.match(/(倍率\D?((\d\.)?\d+)\D?)|((\d\.)?\d+)(倍|X|x|×)/);
                if (match) {
                const matchVa = match[0].match(/(\d[\d.]*)/)[0];
                    if (matchVa !== "1") {
                        nxx = FGF + matchVa + "X";
                    }
                }
            }
            // regexArray.forEach((regex, index) => {if (regex.test(pk.name)) {rename = valueArray[index];}});

            keyover = keyover.concat(
                firstN, Oispflag,Osh,Oct,Oisp,zhi,FGF,adflag,luodi,OGame,nxx
                ).filter(ki => ki !== "");
            const overName = keyover.join("")
            // console.log(overName)
            dns && (pk.server = inQcip);
            pk.name = overName;
            pk.qc = inQcip + outQuery;
          } catch (err) {}
        })
      );
      !onen && await sleep(50);
      i += bs;
    }
    cs++;
    e = removels(e);
    rere = e.length < ein * 0.2 || false;
    (rere && cs === 1) && (cd = timeout,await sleep(50));
  } while (rere && cs < 2);
  cs < 3 && (console.log("任务执行次数: " + cs))
  e = removeqc(e);
  e = jxh(e);
  // if (firstN !== "") {e.forEach((pk) => {pk.name = firstN + " " + pk.name;});}
  numone && (e = onee(e));
  let eout = e.length;
  const endTime = new Date();
  const timeDiff = endTime.getTime() - startTime.getTime();
  if (dns) {
    console.log(`dns解析后共: ${eout} 个`);
  }
  apiRead > 0 ? console.log(`读取api缓存: ${apiRead} 个`) : null;
  apiw > 0 ? console.log(`写入api缓存: ${apiw} 个`) : null;
  console.log(`处理完后剩余: ${eout} 个`);
  if (target == "Loon") {
    console.log("缓存过期时间: " + intimed + ", 还剩" + Pushtd.replace(/,|\n/g, ""));
  } else {
    console.log("缓存过期时间: " +zhTime(TIMEDKEY) +", 还剩" +Pushtd.replace(/,|\n/g, ""));
  }
  console.log(`此方法总用时: ${zhTime(timeDiff)}\n----For New CNAME----`);
  const readlog = apiRead ? `读取缓存:${apiRead} ` : "";
  const writelog = apiw ? `写入缓存:${apiw}, ` : "";
  const Push = eout == ein ? "全部通过测试, " : "去除无效节点后有" + eout + "个, ";
  if (!offtz) {$notification.post(
      `${tzname}共${ein}个节点`,
      "",
      `${writelog}${readlog}${Pushtd}${Push}用时:${zhTime(timeDiff)}`
      );}
  return e;
}


function getflag(e) {
  const t = e
    .toUpperCase()
    .split("")
    .map((e) => 127397 + e.charCodeAt());
  return String.fromCodePoint(...t).replace(/🇹🇼/g, "🇨🇳");
}
function sleep(e) {
  return new Promise((t) => setTimeout(t, e));
}

let apiRead = 0,apiw = 0;
const outs = new Map();
async function OUTIA(e) {
  const t = getid(e);
  if (outs.has(t)) {
    return outs.get(t);
  }
  const n = scriptResourceCache.get(t);
  if (n) {
    apiRead++;
    return n;
  } else {
    const maxRE = 1;
    const n = new Promise((resolve, reject) => {
      if (cd < 1 && onen) {
        return n;
      } else {
        const retry = async (retryCount) => {
          const url = `http://ip-api.com/json?lang=zh-CN&fields=status,message,country,countryCode,city,query`;
          let r = ProxyUtils.produce([e], target);
          try {
            const response = await Promise.race([
              $.http.get({ url: url, node: r, "policy-descriptor": r }),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("timeout")), timeout)
              ),
            ]);
            const data = JSON.parse(response.body);
            if (data.status === "success") {
              scriptResourceCache.set(t, data);
              apiw++;
              resolve(data);
            } else {
              reject(new Error(data.message));
            }
          } catch (error) {
            if (retryCount < maxRE) {
              retry(retryCount + 1);
            } else {
              reject(error);
            }
          }
        };
        retry(0);
      }
    });
    outs.set(t, n);
    return n;
  }
}

const ali = new Map();
async function AliD(e) {
  const t =/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(e);
  if (t) {
    return e;
  } else {
    const t = getaliid(e);
    if (ali.has(t)) {
      return ali.get(t);
    }
    const n = scriptResourceCache.get(t);
    if (n) {
      return n;
    } else {
      const n = new Promise((s, o) => {
        if (cd < 1 && onen) {
          return n;
        } else {
          const n = `http://223.5.5.5/resolve?name=${e}&type=A&short=1`;
          const r = new Promise((e, t) => {
            setTimeout(() => {
              t(new Error("timeout"));
            }, timeout);
          });
          const i = $.http
            .get({ url: n })
            .then((e) => {
              const n = JSON.parse(e.body);
              if (n.length > 0) {
                scriptResourceCache.set(t, n[0]);
                s(n[0]);
              } else {
                s("keyn");
              }
            })
            .catch((e) => {
              o(e);
            });
          Promise.race([r, i]).catch((e) => {
            o(e);
          });
        }
      });
      ali.set(t, n);
      return n;
    }
  }
}

const spapi = new Map();
async function SPEC(e, t) {
  const n = getspcn(e);
  if (spapi.has(n)) {
    return spapi.get(n);
  }
  const s = scriptResourceCache.get(n);
  if (s) {
    return s;
  } else {
    const e = new Promise((s, o) => {
      if (cd < 1 && onen) {
        return e;
      } else {
        const e = t;
        const r = `https://api-v${keyp}${keypr}.cn/ip?ip=${e}`;
        const i = new Promise((e, t) => {
          setTimeout(() => {
            t(new Error("timeout"));
          }, timeout);
        });
        const c = $.http
          .get({ url: r })
          .then((e) => {
            const t = JSON.parse(e.body);
            if (t.data) {
              const {country: e,province: o,city: r,isp: i,ip: c,} = t.data;
              const a = { country: e, regionName: o, city: r, isp: i, ip: c };
              s(a);
              scriptResourceCache.set(n, a);
            } else {
              o(new Error());
            }
          })
          .catch((e) => {
            o(e);
          });
        Promise.race([i, c]).catch((e) => {
          o(e);
        });
      }
    });
    ins.set(n, e);
    return e;
  }
}

const ins = new Map();
async function INIA(e) {
  const t = getinid(e);
  if (ins.has(t)) {
    return ins.get(t);
  }
  const n = scriptResourceCache.get(t);
  if (n) {
    return n;
  } else {
    const n = new Promise((s, o) => {
      if (cd < 1 && onen) {
        return n;
      } else {
        const n = e;
        const r = `http://ip-api.com/json/${n}?lang=zh-CN&fields=status,message,country,city,query,regionName`;
        const i = new Promise((e, t) => {
          setTimeout(() => {
            t(new Error("timeout"));
          }, timeout);
        });
        const c = $.http
          .get({ url: r })
          .then((e) => {
            const o = JSON.parse(e.body);
            if (o.status === "success") {
              scriptResourceCache.set(t, o);
              s(o);
            } else {
              s(n);
            }
          })
          .catch((e) => {
            o(e);
          });
        Promise.race([i, c]).catch((e) => {
          o(e);
        });
      }
    });
    ins.set(t, n);
    return n;
  }
}

function removels(e) {
  const t = new Set();
  const n = [];
  for (const s of e) {
    if (s.qc && !t.has(s.qc)) {
      t.add(s.qc);
      n.push(s);
    }
  }
  return n;
}

function removeqc(e) {
  const t = new Set();
  const n = [];
  for (const s of e) {
    if (!t.has(s.qc)) {
      t.add(s.qc);
      const e = { ...s };
      delete e.qc;
      n.push(e);
    }
  }
  return n;
}

function jxh(e) {
  const t = e.reduce((e, t) => {
    const n = e.find((e) => e.name === t.name);
    if (n) {
      n.count++;
      n.items.push({
        ...t,
        name: `${t.name}${XHFGF}${n.count.toString().padStart(2, "0")}`,
      });
    } else {
      e.push({
        name: t.name,
        count: 1,
        items: [{ ...t, name: `${t.name}${XHFGF}01` }],
      });
    }
    return e;
  }, []);
  const n = t.flatMap((e) => e.items);
  e.splice(0, e.length, ...n);
  return e;
}
function onee(e) {
  const t = e.reduce((e, t) => {
    const n = t.name.replace(/[^A-Za-z0-9\u00C0-\u017F\u4E00-\u9FFF]+\d+$/, "");
    if (!e[n]) {
      e[n] = [];
    }
    e[n].push(t);
    return e;
  }, {});
  for (const e in t) {
    if (t[e].length === 1 && t[e][0].name.endsWith("01")) {
      const n = t[e][0];
      n.name = e;
    }
  }
  return e;
}
function zhTime(e) {
  e = e.toString().replace(/-/g, "");
  if (e < 1e3) {
    return `${Math.round(e)}毫秒`;
  } else if (e < 6e4) {
    return `${Math.round(e / 1e3)}秒`;
  } else if (e < 36e5) {
    return `${Math.round(e / 6e4)}分钟`;
  } else if (e >= 36e5) {
    return `${Math.round(e / 36e5)}小时`;
  }
}
var MD5=function(e){var t=M(V(Y(X(e),8*e.length)));return t.toLowerCase()};function M(e){for(var t,n="0123456789ABCDEF",s="",o=0;o<e.length;o++)t=e.charCodeAt(o),s+=n.charAt(t>>>4&15)+n.charAt(15&t);return s}function X(e){for(var t=Array(e.length>>2),n=0;n<t.length;n++)t[n]=0;for(n=0;n<8*e.length;n+=8)t[n>>5]|=(255&e.charCodeAt(n/8))<<n%32;return t}function V(e){for(var t="",n=0;n<32*e.length;n+=8)t+=String.fromCharCode(e[n>>5]>>>n%32&255);return t}function Y(e,t){e[t>>5]|=128<<t%32,e[14+(t+64>>>9<<4)]=t;for(var n=1732584193,s=-271733879,o=-1732584194,r=271733878,i=0;i<e.length;i+=16){var c=n,a=s,u=o,m=r;s=md5_ii(s=md5_ii(s=md5_ii(s=md5_ii(s=md5_hh(s=md5_hh(s=md5_hh(s=md5_hh(s=md5_gg(s=md5_gg(s=md5_gg(s=md5_gg(s=md5_ff(s=md5_ff(s=md5_ff(s=md5_ff(s,o=md5_ff(o,r=md5_ff(r,n=md5_ff(n,s,o,r,e[i+0],7,-680876936),s,o,e[i+1],12,-389564586),n,s,e[i+2],17,606105819),r,n,e[i+3],22,-1044525330),o=md5_ff(o,r=md5_ff(r,n=md5_ff(n,s,o,r,e[i+4],7,-176418897),s,o,e[i+5],12,1200080426),n,s,e[i+6],17,-1473231341),r,n,e[i+7],22,-45705983),o=md5_ff(o,r=md5_ff(r,n=md5_ff(n,s,o,r,e[i+8],7,1770035416),s,o,e[i+9],12,-1958414417),n,s,e[i+10],17,-42063),r,n,e[i+11],22,-1990404162),o=md5_ff(o,r=md5_ff(r,n=md5_ff(n,s,o,r,e[i+12],7,1804603682),s,o,e[i+13],12,-40341101),n,s,e[i+14],17,-1502002290),r,n,e[i+15],22,1236535329),o=md5_gg(o,r=md5_gg(r,n=md5_gg(n,s,o,r,e[i+1],5,-165796510),s,o,e[i+6],9,-1069501632),n,s,e[i+11],14,643717713),r,n,e[i+0],20,-373897302),o=md5_gg(o,r=md5_gg(r,n=md5_gg(n,s,o,r,e[i+5],5,-701558691),s,o,e[i+10],9,38016083),n,s,e[i+15],14,-660478335),r,n,e[i+4],20,-405537848),o=md5_gg(o,r=md5_gg(r,n=md5_gg(n,s,o,r,e[i+9],5,568446438),s,o,e[i+14],9,-1019803690),n,s,e[i+3],14,-187363961),r,n,e[i+8],20,1163531501),o=md5_gg(o,r=md5_gg(r,n=md5_gg(n,s,o,r,e[i+13],5,-1444681467),s,o,e[i+2],9,-51403784),n,s,e[i+7],14,1735328473),r,n,e[i+12],20,-1926607734),o=md5_hh(o,r=md5_hh(r,n=md5_hh(n,s,o,r,e[i+5],4,-378558),s,o,e[i+8],11,-2022574463),n,s,e[i+11],16,1839030562),r,n,e[i+14],23,-35309556),o=md5_hh(o,r=md5_hh(r,n=md5_hh(n,s,o,r,e[i+1],4,-1530992060),s,o,e[i+4],11,1272893353),n,s,e[i+7],16,-155497632),r,n,e[i+10],23,-1094730640),o=md5_hh(o,r=md5_hh(r,n=md5_hh(n,s,o,r,e[i+13],4,681279174),s,o,e[i+0],11,-358537222),n,s,e[i+3],16,-722521979),r,n,e[i+6],23,76029189),o=md5_hh(o,r=md5_hh(r,n=md5_hh(n,s,o,r,e[i+9],4,-640364487),s,o,e[i+12],11,-421815835),n,s,e[i+15],16,530742520),r,n,e[i+2],23,-995338651),o=md5_ii(o,r=md5_ii(r,n=md5_ii(n,s,o,r,e[i+0],6,-198630844),s,o,e[i+7],10,1126891415),n,s,e[i+14],15,-1416354905),r,n,e[i+5],21,-57434055),o=md5_ii(o,r=md5_ii(r,n=md5_ii(n,s,o,r,e[i+12],6,1700485571),s,o,e[i+3],10,-1894986606),n,s,e[i+10],15,-1051523),r,n,e[i+1],21,-2054922799),o=md5_ii(o,r=md5_ii(r,n=md5_ii(n,s,o,r,e[i+8],6,1873313359),s,o,e[i+15],10,-30611744),n,s,e[i+6],15,-1560198380),r,n,e[i+13],21,1309151649),o=md5_ii(o,r=md5_ii(r,n=md5_ii(n,s,o,r,e[i+4],6,-145523070),s,o,e[i+11],10,-1120210379),n,s,e[i+2],15,718787259),r,n,e[i+9],21,-343485551),n=safe_add(n,c),s=safe_add(s,a),o=safe_add(o,u),r=safe_add(r,m)}return Array(n,s,o,r)}function md5_cmn(e,t,n,s,o,r){return safe_add(bit_rol(safe_add(safe_add(t,e),safe_add(s,r)),o),n)}function md5_ff(e,t,n,s,o,r,i){return md5_cmn(t&n|~t&s,e,t,o,r,i)}function md5_gg(e,t,n,s,o,r,i){return md5_cmn(t&s|n&~s,e,t,o,r,i)}function md5_hh(e,t,n,s,o,r,i){return md5_cmn(t^n^s,e,t,o,r,i)}function md5_ii(e,t,n,s,o,r,i){return md5_cmn(n^(t|~s),e,t,o,r,i)}function safe_add(e,t){var n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}function bit_rol(e,t){return e<<t|e>>>32-t}function getid(e){let t="ld";return MD5(`${t}-${e.server}-${e.port}`)}function getinid(e){let t="ia";return MD5(`${t}-${e}`)}function getaliid(e){let t="al";return MD5(`${t}-${e}`)}function getspcn(e){let t="sc";return MD5(`${t}-${e}`)}
