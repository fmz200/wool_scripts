/**
 * @Sub-Store-Page
 * CNAME 接口查询去重/重命名 2023-11-16 20:34:08
 * - 入口查询[国内spapi 识别到国外为ip-api] 落地查询[ip-api]
 * - 根据接口返回的真实结果，重新对节点命名。
 * - 添加入口城市、落地国家或地区、国内运营商信息，并对这些数据做持久化缓存（48小时有效期），减少API请求次数，提高运行效率。
 * - 仅兼容 Surge, Loon 客户端。
 * - Surge 需要固定带 ability 参数版本。
 * 特别说明：
 * - 符号：🅳电信 🅻联通 🆈移动 🅶广电 🅲公司 🆉直连 🎮游戏
 * - 首次运行或者在没有缓存的情况下会通知进度
 * - 无参数时的节点命名格式: "美国 01"
 * - 1. 官方默认版(目前不带 ability 参数, 不保证以后不会改动): 》https://raw.githubusercontent.com/sub-store-org/Sub-Store/master/config/Surge.sgmodule
 *
 * - 2. 固定带 ability 参数版本,可能会爆内存, 如果需要使用指定节点功能 例如 [加国旗脚本或者cname脚本] 请使用此带 ability 参数版本: https://raw.githubusercontent.com/sub-store-org/Sub-Store/master/config/Surge-ability.sgmodule
 *
 * - 3. 固定不带 ability 参数版本：https://raw.githubusercontent.com/sub-store-org/Sub-Store/master/config/Surge-Noability.sgmodule
 *
 * - 参数必须以"#"开头，多个参数使用"&"连接，例如 https://github.com/Keywos/rule/raw/main/cname.js#city&iisp&name=Name
 * - 以下是此脚本支持的参数，必须以"#"开头，多个参数使用"&"连接，需要传入参数的话用 "=" 例如 "name=一元" 参考上述地址为例使用参数。
 * - 无参数时的节点命名格式: "美国 01"，如果 [入口IP或国家]或 [落地IP或国家]一样则为 "直连 德国 01" 
 * - 首次运行或者在没有缓存的情况下会通知进度
 * 
 * 
 * 入口参数
 * - [iisp]      增加入口运营商或者直连标识；
 * - [city]      增加入口城市文字标识；
 * - [sheng]     增加入口省份文字标识；
 * - [yuan]      为境外入口添加真实的入口属地标识，当未配置此此参数时，则将境外入口统一标记为 [境外]，默认未配置此参数；
 * - [inflag]    增加入口国旗
 * 
 * 落地参数
 * - [yisp]      显示落地详细运营商名称；
 * - [yw]        落地归属地使用英文缩写标识，不建议与其他入口参数配合使用，因为其他参数API没有返回英文；
 * - [xy]        此参数关闭落地查询，仅查询入口；开启 yisp || yw || flag 参数后 xy 参数无效
 * 
 * 图标参数
 * - [game]      增加游戏节点标识；
 * - [flag]      增加国家或地区的旗帜标识，默认无此参数；
 * - [bl]        保留倍率标识；
 * - [snone]     清理某地区内只有一个节点的序号；
 * 
 * 分隔符参数
 * - [fgf=]      设置入口和落地之间的分隔符，默认为空格；
 * - [sn=]       设置国家与序号之间的分隔符，默认为空格；
 * - [name=]     为节点添加机场名称前缀；
 * 
 * 通知参数
 * - [offtz]     关闭脚本通知；
 * 
 * 解析参数
 * - [dnsjx]     将节点域名解析为IP，普通用户不建议使用；
 * 
 * 逻辑参数
 * - [bs=]       批处理节点数建议10个左右，如果经常读不到节点建议减小批处理个数；
 * 
 * 缓存参数
 * - [h=]        节点缓存有效期，单位小时，时间参数只能二选一，Loon用户不需填写要此参数，请进入Sub-Store插件的配置界面自定义缓存有效期；
 * - [min=]      节点缓存有效期，单位分钟，时间参数只能二选一，Loon用户不需填写要此参数，请进入Sub-Store插件的配置界面自定义缓存有效期；
 * 
 * 超时参数
 * - [timeout=]  当无任何节点缓存时测试节点HTTP延时允许的最大超时参数，超出允许范围则判定为无效节点，默认2000ms；
 * - [cd=]       当有缓存时，会先读取缓存，直接输出结果；默认 [cd=]的值等于0，微直接读取缓存； 
当设为更高的值: 比如'460'则每次读缓存都会再次处理之前判定为超时的节点,超时为460ms
*
* 其他参数
* - [debug]     调试日志，普通用户不建议使用。
* - 异常：如遇问题，Loon可以进入[配置]→[持久化缓存]→[删除指定数据]→输入Key [sub-store-cached-script-resource]并删除缓存。累计输出节点为0个3次以上将清理所有缓存
* - Surge需要进入[脚本编辑器]→左下角[设置]→[$persistentStore]  [sub-store-cached-script-resource]删除缓存数据。
*/

const SUB_STORE_SCHEMA = {
  title: "CNAME",
  description: "根据接口返回的真实结果，重新对节点命名/去重。 如：入口/落地详细地区信息",
  scope: ["Surge", "Loon"],
  author: "@Key @奶茶姐 @小一 @可莉",
  updateTime: "2023-11-11 18:26:00",
  version: "1.2.2",
  params: {
    flag: {
      datatype: "boolean",
      description: "增加落地国家或地区的旗帜标识，默认无此参数",
      defaultValue: false,
    },
    inflag:{
      datatype: "boolean",
      description: "增加入口国家或地区的旗帜标识，默认无此参数",
      defaultValue: false,
    },
    xy: {
      datatype: "boolean",
      description: "关闭落地查询，仅查询入口；开启 yisp || yw || flag 参数后 xy 参数无效",
      defaultValue: false,
    },
    iisp: {
      datatype: "boolean",
      description: "增加入口运营商或者直连标识",
      defaultValue: false,
    },
    city: {
      datatype: "boolean",
      description: "增加入口城市文字标识",
      defaultValue: false,
    },
    sheng: {
      datatype: "boolean",
      description: "增加入口省份文字标识",
      defaultValue: false,
    },
    yuan: {
      datatype: "boolean",
      description:
        "为境外入口添加真实的入口属地标识，当未配置此此参数时，则将境外入口统一标记为[境外]，默认未配置此参数",
      defaultValue: false,
    },
    yisp: {
      datatype: "boolean",
      description: "显示落地详细运营商名称",
      defaultValue: false,
    },
    yw: {
      datatype: "boolean",
      description:
        "落地归属地使用英文缩写标识，不建议与其他入口参数配合使用，因为其他参数API没有返回英文",
      defaultValue: false,
    },
    game: {
      datatype: "boolean",
      description: "增加游戏节点标识",
      defaultValue: false,
    },
    bl: {
      datatype: "boolean",
      description: "保留倍率标识",
      defaultValue: false,
    },
    snone: {
      datatype: "boolean",
      description: "清理某地区内只有一个节点的序号",
      defaultValue: false,
    },
    offtz: {
      datatype: "boolean",
      description: "关闭脚本通知",
      defaultValue: false,
    },
    dnsjx: {
      datatype: "boolean",
      description: "将节点域名解析为IP, 普通用户不建议使用",
      defaultValue: false,
    },
    debug: {
      datatype: "boolean",
      description: "调试日志，普通用户不建议使用",
      defaultValue: false,
    },
    fgf: {
      datatype: "string",
      description: "设置入口和落地之间的分隔符，默认为空格",
      defaultValue: " ",
    },
    sn: {
      datatype: "string",
      description: "设置国家与序号之间的分隔符，默认为空格",
      defaultValue: " ",
    },
    name: {
      datatype: "string",
      description: "为节点添加机场名称前缀",
      defaultValue: "",
    },
    timeout: {
      datatype: "number",
      description:
        "当无任何节点缓存时测试节点HTTP延时允许的最大超时参数，超出允许范围则判定为无效节点，默认2000ms",
      defaultValue: 2000,
    },
    cd: {
      datatype: "number",
      description:
        "当有缓存时，会先读取缓存，直接输出结果；默认[cd=]的值等于0，微直接读取缓存； 当设为更高的值: 比如'460'则每次读缓存都会再次处理之前判定为超时的节点,超时为460ms",
      defaultValue: 0,
    },
    bs: {
      datatype: "number",
      description:
        "批处理节点数建议10个左右，如果经常读不到节点建议减小批处理个数",
      defaultValue: 10,
    },
    h: {
      datatype: "number",
      description:
        "节点缓存有效期，单位小时，时间参数只能二选一，Loon用户不需填写要此参数，请进入Sub-Store插件的配置界面自定义缓存有效期",
      defaultValue: "",
    },
    min: {
      datatype: "number",
      description:
        "节点缓存有效期，单位分钟，时间参数只能二选一，Loon用户不需填写要此参数，请进入Sub-Store插件的配置界面自定义缓存有效期",
      defaultValue: "",
    },
  },
};


const $ = $substore;
const iar = $arguments;
let FGF = iar.fgf == undefined ? " " : decodeURI(iar.fgf),FGFS = FGF,debug = iar.debug;
const { yw, bl, iisp, xy,  yisp, yun, city, flag, inflag, game, yuan, sheng, offtz, snone: numone} = iar;
const h = iar.h ? decodeURI(iar.h) : "",min = iar.min ? decodeURI(iar.min) : "",firstN = iar.name ? decodeURI(iar.name) : "";
const XHFGF = iar.sn == undefined ? " " : decodeURI(iar.sn),{ isLoon: isLoon, isSurge: isSurge } = $substore.env, dns = iar.dnsjx,target = isLoon ? "Loon" : isSurge ? "Surge" : undefined,keypr= "peedtest";
let cd = iar.cd ? iar.cd : 0, timeout = iar.timeout ? iar.timeout : 2000, writet = "", innum = 1728e5, loontrue = false, onen = false, Sue = false, rawtime = 1500;
const keyp = "3.s",EXPIRATION_KEY = "#sub-store-csr-expiration-time";
if (min !== "") {
  Sue = true;
  innum = parseInt(min, 10) * 6e4;
  writet = $.write(JSON.stringify(innum), EXPIRATION_KEY);
} else if (h !== "") {
  Sue = true;
  innum = parseInt(h, 10) * 36e5;
  writet = $.write(JSON.stringify(innum), EXPIRATION_KEY);
} else {
  writet = $.write(JSON.stringify(innum), EXPIRATION_KEY);
}
let TIMEDKEY = $.read(EXPIRATION_KEY),inapi=0;
async function operator(e = [], targetPlatform, env) {
  let tzname = "", subcoll = "", x = false, xys = false;
  if (env?.source?.[e?.[0]?.subName]) x = true;
  if (env?.source?._collection?.name) xys = true;
  if (x && xys) {
    tzname =
      env.source._collection.name + ": [" + env.source._collection.subscriptions + "]";
    subcoll = "组合订阅内单条订阅加了脚本, 输出组合订阅";
  } else if (x) {
    tzname = env.source[e[0].subName].name;
    subcoll = "单条订阅脚本";
  } else {
    tzname = env.source._collection.name;
    subcoll = "组合订阅脚本";
  }
  const startTime = new Date();
  const support = isLoon || isSurge;
  if (!xy) {
    if (!support) {
      $.notify("No Loon or Surge")
      $.error(`No Loon or Surge`);
        return e;
      }
  }
  function klog(...arg) {
    console.log('[CNAME] ' +subcoll+ tzname +" : "+ arg);
  }
  if (e.length < 1) {$.notify(subcoll +tzname,"订阅无节点","");return e;}
  if (typeof scriptResourceCache === "undefined")return e;
  let bs = iar.bs ? iar.bs : 9;
  const ein = e.length;
  const eins = ein/2;
  klog(`开始处理节点: ${ein} 个`);
  klog(`批处理节点数: ${bs} 个`);
  klog(`设定api超时: ${zhTime(timeout)}`);
  klog(`有缓api超时: ${zhTime(cd)}`);
  // e = e.filter((item) => !nlc.test(item.name));
  let o = 0,Pushtd = "",intimed = "",stops = false,rere=false,iflag="",cachen = 0;
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
          if (cacheds) cachen++;
          if (cachen > eins) {
            if (!onen) {
              klog(`检查缓存数量: ${cachen}/${ein} 个`);
              rawtime = timeout;
              timeout = cd;
              onen = true;
              stops = true;
            }
            const readt = scriptResourceCache.gettime(id);
            let nt = new Date().getTime();
            let timedPush = "";
            if (isLoon) {
              let loontd = "";
              const loonkkk={"1分钟":6e4,"5分钟":3e5,"10分钟":6e5,"30分钟":18e5,"1小时":36e5,"2小时":72e5,"3小时":108e5,"6小时":216e5,"12小时":432e5,"24小时":864e5,"48小时":1728e5,"72小时":2592e5,参数传入:"innums"};
              intimed = $.read("#节点缓存有效期");
              loontd = loonkkk[intimed] || 1728e5;
              if (loontd == "innums") {
                loontd = innum;
              }
              timedPush = zhTime(
                parseInt(readt, 10) - nt + parseInt(loontd, 10)
              );
            } else if (target === "Surge" && Sue) {
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
        } catch (err) {delog(err.message)}
      })
    );
    o += 1;
  }
  if (!onen && !offtz) $.notify(subcoll+tzname, `开始处理节点: ${ein} 个 批处理数量: ${bs} 个`, "请等待处理完毕后再次点击预览");

  let retryi = 0,breaki=false, isone = 0;
  do {
    let i = 0,newnode = [];isone++;
    while (i < e.length) {
      const batch = e.slice(i, i + bs);
      await Promise.all(
        batch.map(async (pk) => {
            try {
              let keyover = [], Yserver = pk.server,luodi = "",inQcip = "",nxx = "",adflag = "",OGame="",Oisp="",Oispflag="",Osh="", Oct="",zhi = "",yuanisp ="",isCN = false,v4 = false, v6 = false, isNoAli = false;
              let inServer = await AliD(Yserver);
              delog(inServer)
              switch (inServer) {
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
              
              let btip = true,outu="",outips="";
              if (!xy || yisp || yw || flag) {
                if (!support) {
                  $.notify("No Loon or Surge")
                  $.error(`No Loon or Surge, 开启 yisp || yw || flag 参数后 xy 参数无效`);
                    return e;
                  }
                  
                const outip = await OUTIA(pk);
                let {country:outUsq, countryCode:outUs, city:outCity, query:outQuery, isp:outisp} = outip;//落地
                if (yisp) {
                    yuanisp = FGFS+outisp
                };
                debug && (pk.keyoutld = outip);
                delog("落地信息 " + JSON.stringify(outip))
                outu = outUs;
                outips = outQuery;
                luodi = (outUsq === "中国") ? outCity : (yw ? outUs : outUsq);
                btip = outQuery !== inServer
              };
              
              if (btip || xy) {
                if (!isNoAli || v4) {
                  const spkey = await SPEC(inServer);
                  let {country:inSpCn,regionName:inSpSheng,city:inSpCity,isp:inSpIsp,ip:inSpIp,countryCode:inCode} = spkey;
                  inflag && (iflag = getflag(inCode));
                  debug && (pk.keyinsp = spkey);
                  isCN = inSpCn === "中国";
                  inQcip = inServer;
                  const keycm = {电信:"🅳", 联通:"🅻", 移动: "🆈",广电:"🅶"};
                  if (isCN){
                      debug && (pk.keyinsp = spkey)
                      delog("国内入口 " + JSON.stringify(spkey));
                      if(iisp && flag){
                          inSpIsp=inSpIsp.replace(/中国/g, "")
                          flag && (Oispflag = keycm.hasOwnProperty(inSpIsp) ? keycm[inSpIsp] : "🅲");
                      } else if(iisp){
                          Oisp = /电信|联通|移动|广电/.test(inSpIsp) ? inSpIsp.replace(/中国/g, "") : "企业";
                      }
                      (inSpSheng === inSpCity) && (inSpCity = "");

                      if (sheng && city){
                        Osh = inSpSheng;Oct = inSpCity
                      } else if (sheng){
                        Osh = inSpSheng;
                      } else if (city){
                        Oct = inSpCity ? inSpCity : inSpSheng;
                      }

                  }    
                }    
                if (isNoAli || v6 || !isCN) {
                      const inip = await INIA(Yserver);
                      let {country: inUsq, city: inCity, query: inQuery, regionName: inIpSh, countryCode:inaCode} = inip;
                      inflag && (iflag = getflag(inaCode));
                      debug && (pk.keyinipapi = inip);
                      delog("ipapi入口 " + JSON.stringify(inip));
                      inQcip = inQuery; //去重ip
                      if (inUsq === "中国") {
                          // inCity === inUs ? (incity=inCity) 
                          (/[a-zA-Z]/.test(inCity)) && (inCity = inIpSh);
                          (inCity === inIpSh) && (inIpSh="");
                          if (sheng && city){
                            Osh = inIpSh;Oct = inCity;
                          } else if (sheng){
                            Osh = inIpSh;
                          } else if (city){
                            Oct = inCity ? inCity : inIpSh;
                          }
                          // 运营商 未知
                          flag && (Oispflag = "🅲");

                      } else {
                          if(inQuery === outips){
                              flag && (Oispflag = "🆉");
                              (sheng || city || iisp) && (zhi  = "直连");
                          } else if (yuan){
                              flag && (Oispflag = "🅲");
                              (sheng || city || iisp) && (zhi  = inUsq);
                          } else {
                              flag && (Oispflag = "🆇");
                              (sheng || city || iisp) && (zhi  = "境外");
                          }
                      }
                }
              } else {
                flag && (Oispflag = "🆉");
                (sheng || city || iisp) && (zhi  = "直连");
              }
              flag && (adflag = getflag(outu));
              game && (OGame = /game|游戏/i.test(pk.name) ? (flag ? "🎮" : FGF+"Game") : OGame);
              if (bl){
                const match = pk.name.match(/((倍率|X|x|×)\D?((\d\.)?\d+)\D?)|((\d\.)?\d+)(倍|X|x|×)/);
                if (match) {
                const matchVa = match[0].match(/(\d[\d.]*)/)[0];
                    if (matchVa !== "1") {
                        nxx = XHFGF + matchVa + "X";
                    }
                }
              }
              (!iisp && !city && !sheng && !xy && !inflag) && (Oispflag = "",FGF ="");
              keyover = keyover.concat(
                  firstN, Oispflag,Osh,Oct,Oisp,zhi,FGF,adflag,luodi,OGame,nxx,yuanisp
                  ).filter(ki => ki !== "");
                  // delog(keyover)
              let overName = keyover.join("");
              xy && (overName = iflag +overName +FGF+ pk.name);
              // delog(overName)
              newnode.push(outips);
              dns && (pk.server = inQcip);
              pk.name = overName;
              inflag && (pk.name = iflag + overName);
              pk.qc = inQcip + outips;
            } catch (err) {
              if (inapi >= 1) {
                retryi++;
                breaki = true;
              }
              delog(err.message)
            };
        })
      );
      i += bs;
      klog(`处理进度${i}/${ein}`)
      if (!onen){
        if(!offtz && (ein > (i*2))){
            if (i >= (e.length / 3) && i < (e.length * 2 / 3) && ein>i) {
                $.notify(subcoll+tzname, `处理进度${i}/${ein}`, "耐心等待, 请勿重复点击预览...");
            }
        }
        await sleep(GRa());
      }
    }
    !xy && (e = removels(e));
    var eout = e.length;
    if (eout > 3 && isSurge){
      const allsame = newnode.every((value, index, arr) => value === arr[0]);
      if(allsame){
          klog(`未使用带指定节点功能的 SubStore, 或所有节点落地IP相同`);
          $.notify('CNAME：点击以安装对应版本','未使用带指定节点功能的 SubStore，或所有节点落地IP相同','',{url: "https://raw.githubusercontent.com/sub-store-org/Sub-Store/master/config/Surge-ability.sgmodule",})
          return e;
      }
    }
    if (inapi >= 1) {
      retryi++;
      timeout = rawtime;
      onen = false;
      spMap.clear();alMap.clear();iaMap.clear();oaMap.clear();
      klog(`重试中...`);
    } else {
      retryi = 2;
    }
  } while(retryi < 2);
    
  !xy && (e = removeqc(e));
  e = jxh(e);
  // if (firstN !== "") {e.forEach((pk) => {pk.name = firstN + " " + pk.name;});}
  numone && (e = onee(e));
  const endTime = new Date();
  const timeDiff = endTime.getTime() - startTime.getTime();
  if (dns) {
    klog(`dns解析后共: ${eout} 个`);
  }
  apiRead > 0 ? klog(`读取api缓存: ${apiRead} 个`) : null;
  apiw > 0 ? klog(`写入api缓存: ${apiw} 个`) : null;
  klog(`处理完后剩余: ${eout} 个`);
  // const Nullv ='#SubStoreNullvalue';
  // if (eout === 0 && ein !== 0){
  //   let Nullvi = parseInt($.read(Nullv), 10);
  //   if (isNaN(Nullvi)) {
  //     klog(`错误1次, 3次后将清理所有节点缓存`);
  //     $.write("0", Nullv);
  //   } else {
  //     Nullvi += 1;
  //     klog(`错误${Nullvi}次, 3次后将清理所有节点缓存`);
  //     $.write(Nullvi.toString(), Nullv);
  //   }
  //   if (Nullvi > 3) {
  //     $.write({}, "#sub-store-cached-script-resource");
  //     klog(`错误${Nullvi}次, 已清理所有节点缓存`);
  //     Nullvi = 0;
  //     $.write(Nullvi.toString(), Nullv);
  //   }
  // }
  if (isLoon) {
    klog("缓存过期时间: " + intimed + ", 还剩" + Pushtd.replace(/,|\n/g, ""));
  } else {
    klog("缓存过期时间: " +zhTime(TIMEDKEY) +", 还剩" +Pushtd.replace(/,|\n/g, ""));
  }
  klog(`此方法总用时: ${zhTime(timeDiff)}\n----For New CNAME----\n\n\n\n\n`);
  const readklog = apiRead ? `读取缓存:${apiRead} ` : "";
  const writeklog = apiw ? `写入缓存:${apiw}, ` : "";
  const Push = (eout === ein && eout === 0) ? "" : (eout === ein ? "全部通过测试, " : "去除无效节点后有" + eout + "个, ");
  if (!offtz) {$.notify(
      `${subcoll}${tzname} 共${ein}个节点`,
      "",
      `${writeklog}${readklog}${Pushtd}${Push}用时:${zhTime(timeDiff)}`
      );}
  return e;
}

function getflag(e) { const t = e .toUpperCase() .split("") .map((e) => 127397 + e.charCodeAt()); return String.fromCodePoint(...t).replace(/🇹🇼/g, "🇨🇳"); } function sleep(e) { return new Promise((t) => setTimeout(t, e)); } let apiRead = 0, apiw = 0; 
const oaMap = new Map(); async function OUTIA(e) { const t = getid(e); if (oaMap.has(t)) return oaMap.get(t); const cached = scriptResourceCache.get(t);if (cached) { apiRead++; return cached; } else {inapi++;};const maxRE = 2; const url = `http://ip-api.com/json?lang=zh-CN&fields=status,message,country,countryCode,city,query,isp`; const getHttp = async (reTry) => { try { let r = ProxyUtils.produce([e], target); const response = await Promise.race([ $.http.get({ url: url, node: r, "policy-descriptor": r }), new Promise((_, reject) => setTimeout(() => reject(new Error("timeout-OUTIA")), timeout) ), ]); const data = JSON.parse(response.body); if (data.status === "success") { scriptResourceCache.set(t, data); return data; } else { throw new Error(resdata.message); } } catch (error) { if (reTry < maxRE) { await sleep(GRa()); delog(e.name + "-> [outipApi超时查询次数] " + reTry); return getHttp(reTry + 1); } else { throw error; } } }; const resGet = new Promise((resolve, reject) => { if (cd < 1 && onen) return resGet; getHttp(1) .then((data) => { apiw++; resolve(data); }) .catch(reject); }); oaMap.set(t, resGet); return resGet; };
const alMap = new Map(); async function AliD(e) { const ti = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test( e ); if (ti) return e; const t = getaliid(e); if (alMap.has(t)) return alMap.get(t); const cached = scriptResourceCache.get(t); if (cached) { apiRead++; return cached;} else {inapi++;};const maxRE = 2; let alip = Math.random() < 0.5 ? '223.5.5.5' : '223.6.6.6';const url = `https://${alip}/resolve?name=${e}&type=A&short=1`; const getHttp = async (reTry) => { try { const response = await Promise.race([ $.http.get({ url: url }), new Promise((_, reject) => setTimeout(() => reject(new Error("timeout-AliD")), timeout) ), ]); const resdata = JSON.parse(response.body); if (resdata.length > 0) { scriptResourceCache.set(t, resdata[0]); return resdata[0]; } else { return "keyn"; } } catch (error) { if (reTry < maxRE) { await sleep(GRa()); delog(e + " [->Ali超时查询次数] " + reTry); return getHttp(reTry + 1); } else { throw error; } } }; const resGet = new Promise((resolve, reject) => { if (cd < 1 && onen) { return resGet; } else { getHttp(1) .then((data) => { resolve(data); }) .catch(reject); } }); alMap.set(t, resGet); return resGet; };function getaliid(e){let t="al";return MD5(`${t}-${e}`)};function getspcn(e){let t="sc";return MD5(`${t}-${e}`)};
const spMap = new Map(); async function SPEC(e) { const n = getspcn(e); if (spMap.has(n)) return spMap.get(n);const cached = scriptResourceCache.get(n); if (cached) {apiRead++;return cached;} else {inapi++;}; const maxRE = 2; const url = `https://api-v${keyp}${keypr}.cn/ip?ip=${e}`; const getHttp = async (reTry) => { try { const response = await Promise.race([ $.http.get({ url: url }), new Promise((_, reject) => setTimeout(() => reject(new Error("timeout-SPEC")), timeout) ), ]); const resdata = JSON.parse(response.body); delog(resdata); if (resdata.data) { const { country: e, province: o, city: r, isp: i, ip: c, countryCode: k, } = resdata.data; const a = { country: e, regionName: o, city: r, isp: i, ip: c, countryCode: k, }; delog("写入"); scriptResourceCache.set(n, a); return a; } else { throw new Error(resdata.message); } } catch (error) { if (reTry < maxRE) { await sleep(GRa()); delog(e + "-> [SP超时查询次数] " + reTry); return getHttp(reTry + 1); } else { throw error; } } }; const resGet = new Promise((resolve, reject) => {if (cd < 1 && onen) return resGet; getHttp(1) .then((data) => { resolve(data); }) .catch(reject); }); spMap.set(n, resGet); return resGet; };
const iaMap = new Map(); async function INIA(e) { const t = getinid(e); if (iaMap.has(t)) return iaMap.get(t); const cached = scriptResourceCache.get(t); if (cached) {apiRead++;return cached;} else {inapi++;}; const maxRE = 2; const url = `http://ip-api.com/json/${e}?lang=zh-CN&fields=status,message,country,city,query,regionName,countryCode`; const getHttp = async (reTry) => { try { delog(url); const response = await Promise.race([ $.http.get({ url: url }), new Promise((_, reject) => setTimeout(() => reject(new Error("timeout-INIA")), timeout) ), ]); const data = JSON.parse(response.body); if (data.status === "success") { scriptResourceCache.set(t, data); return data; } else { throw new Error(resdata.message); } } catch (error) { if (reTry < maxRE) { await sleep(GRa()); delog(e + "-> [inipApi超时查询次数] " + reTry); return getHttp(reTry + 1); } else { throw error; } } }; const resGet = new Promise((resolve, reject) => { if (cd < 1 && onen) return resGet; getHttp(1) .then((data) => { resolve(data); }) .catch(reject); }); iaMap.set(t, resGet); return resGet; } function GRa() { return Math.floor(Math.random() * (500 - 50 + 1) + 50); };
function delog(...arg) { if (debug) { console.log("[CNAME] :" + arg); } } function removels(e) { const t = new Set(); const n = []; for (const s of e) { if (s.qc && !t.has(s.qc)) { t.add(s.qc); n.push(s); } } return n; } function removeqc(e) { const t = new Set(); const n = []; for (const s of e) { if (!t.has(s.qc)) { t.add(s.qc); const e = { ...s }; delete e.qc; n.push(e); } } return n; } function jxh(e) { const t = e.reduce((e, t) => { const n = e.find((e) => e.name === t.name); if (n) { n.count++; n.items.push({ ...t, name: `${t.name}${XHFGF}${n.count.toString().padStart(2, "0")}`, }); } else { e.push({ name: t.name, count: 1, items: [{ ...t, name: `${t.name}${XHFGF}01` }], }); } return e; }, []); const n = t.flatMap((e) => e.items); e.splice(0, e.length, ...n); return e; } 
function onee(e) { const t = e.reduce((e, t) => { const n = t.name.replace(/[^A-Za-z0-9\u00C0-\u017F\u4E00-\u9FFF]+\d+$/, ""); if (!e[n]) { e[n] = []; } e[n].push(t); return e; }, {}); for (const e in t) { if (t[e].length === 1 && t[e][0].name.endsWith("01")) { t[e][0].name= t[e][0].name.replace(/[^.]01/, "") } } return e; }
function zhTime(e) { e = e.toString().replace(/-/g, ""); if (e < 1e3) { return `${Math.round(e)}毫秒`; } else if (e < 6e4) { return `${Math.round(e / 1e3)}秒`; } else if (e < 36e5) { return `${Math.round(e / 6e4)}分钟`; } else if (e >= 36e5) { return `${Math.round(e / 36e5)}小时`; } } 
var MD5=function(e){var t=M(V(Y(X(e),8*e.length)));return t.toLowerCase()};function M(e){for(var t,n="0123456789ABCDEF",s="",o=0;o<e.length;o++)t=e.charCodeAt(o),s+=n.charAt(t>>>4&15)+n.charAt(15&t);return s}function X(e){for(var t=Array(e.length>>2),n=0;n<t.length;n++)t[n]=0;for(n=0;n<8*e.length;n+=8)t[n>>5]|=(255&e.charCodeAt(n/8))<<n%32;return t}function V(e){for(var t="",n=0;n<32*e.length;n+=8)t+=String.fromCharCode(e[n>>5]>>>n%32&255);return t}function Y(e,t){e[t>>5]|=128<<t%32,e[14+(t+64>>>9<<4)]=t;for(var n=1732584193,s=-271733879,o=-1732584194,r=271733878,i=0;i<e.length;i+=16){var c=n,a=s,u=o,m=r;s=md5_ii(s=md5_ii(s=md5_ii(s=md5_ii(s=md5_hh(s=md5_hh(s=md5_hh(s=md5_hh(s=md5_gg(s=md5_gg(s=md5_gg(s=md5_gg(s=md5_ff(s=md5_ff(s=md5_ff(s=md5_ff(s,o=md5_ff(o,r=md5_ff(r,n=md5_ff(n,s,o,r,e[i+0],7,-680876936),s,o,e[i+1],12,-389564586),n,s,e[i+2],17,606105819),r,n,e[i+3],22,-1044525330),o=md5_ff(o,r=md5_ff(r,n=md5_ff(n,s,o,r,e[i+4],7,-176418897),s,o,e[i+5],12,1200080426),n,s,e[i+6],17,-1473231341),r,n,e[i+7],22,-45705983),o=md5_ff(o,r=md5_ff(r,n=md5_ff(n,s,o,r,e[i+8],7,1770035416),s,o,e[i+9],12,-1958414417),n,s,e[i+10],17,-42063),r,n,e[i+11],22,-1990404162),o=md5_ff(o,r=md5_ff(r,n=md5_ff(n,s,o,r,e[i+12],7,1804603682),s,o,e[i+13],12,-40341101),n,s,e[i+14],17,-1502002290),r,n,e[i+15],22,1236535329),o=md5_gg(o,r=md5_gg(r,n=md5_gg(n,s,o,r,e[i+1],5,-165796510),s,o,e[i+6],9,-1069501632),n,s,e[i+11],14,643717713),r,n,e[i+0],20,-373897302),o=md5_gg(o,r=md5_gg(r,n=md5_gg(n,s,o,r,e[i+5],5,-701558691),s,o,e[i+10],9,38016083),n,s,e[i+15],14,-660478335),r,n,e[i+4],20,-405537848),o=md5_gg(o,r=md5_gg(r,n=md5_gg(n,s,o,r,e[i+9],5,568446438),s,o,e[i+14],9,-1019803690),n,s,e[i+3],14,-187363961),r,n,e[i+8],20,1163531501),o=md5_gg(o,r=md5_gg(r,n=md5_gg(n,s,o,r,e[i+13],5,-1444681467),s,o,e[i+2],9,-51403784),n,s,e[i+7],14,1735328473),r,n,e[i+12],20,-1926607734),o=md5_hh(o,r=md5_hh(r,n=md5_hh(n,s,o,r,e[i+5],4,-378558),s,o,e[i+8],11,-2022574463),n,s,e[i+11],16,1839030562),r,n,e[i+14],23,-35309556),o=md5_hh(o,r=md5_hh(r,n=md5_hh(n,s,o,r,e[i+1],4,-1530992060),s,o,e[i+4],11,1272893353),n,s,e[i+7],16,-155497632),r,n,e[i+10],23,-1094730640),o=md5_hh(o,r=md5_hh(r,n=md5_hh(n,s,o,r,e[i+13],4,681279174),s,o,e[i+0],11,-358537222),n,s,e[i+3],16,-722521979),r,n,e[i+6],23,76029189),o=md5_hh(o,r=md5_hh(r,n=md5_hh(n,s,o,r,e[i+9],4,-640364487),s,o,e[i+12],11,-421815835),n,s,e[i+15],16,530742520),r,n,e[i+2],23,-995338651),o=md5_ii(o,r=md5_ii(r,n=md5_ii(n,s,o,r,e[i+0],6,-198630844),s,o,e[i+7],10,1126891415),n,s,e[i+14],15,-1416354905),r,n,e[i+5],21,-57434055),o=md5_ii(o,r=md5_ii(r,n=md5_ii(n,s,o,r,e[i+12],6,1700485571),s,o,e[i+3],10,-1894986606),n,s,e[i+10],15,-1051523),r,n,e[i+1],21,-2054922799),o=md5_ii(o,r=md5_ii(r,n=md5_ii(n,s,o,r,e[i+8],6,1873313359),s,o,e[i+15],10,-30611744),n,s,e[i+6],15,-1560198380),r,n,e[i+13],21,1309151649),o=md5_ii(o,r=md5_ii(r,n=md5_ii(n,s,o,r,e[i+4],6,-145523070),s,o,e[i+11],10,-1120210379),n,s,e[i+2],15,718787259),r,n,e[i+9],21,-343485551),n=safe_add(n,c),s=safe_add(s,a),o=safe_add(o,u),r=safe_add(r,m)}return Array(n,s,o,r)}function md5_cmn(e,t,n,s,o,r){return safe_add(bit_rol(safe_add(safe_add(t,e),safe_add(s,r)),o),n)}function md5_ff(e,t,n,s,o,r,i){return md5_cmn(t&n|~t&s,e,t,o,r,i)}function md5_gg(e,t,n,s,o,r,i){return md5_cmn(t&s|n&~s,e,t,o,r,i)}function md5_hh(e,t,n,s,o,r,i){return md5_cmn(t^n^s,e,t,o,r,i)}function md5_ii(e,t,n,s,o,r,i){return md5_cmn(n^(t|~s),e,t,o,r,i)}function safe_add(e,t){var n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}function bit_rol(e,t){return e<<t|e>>>32-t}function getid(e){let t="ld";return MD5(`${t}-${e.server}-${e.port}`)}function getinid(e){let t="ia";return MD5(`${t}-${e}`)};
