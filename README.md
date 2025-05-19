# wool_scripts

## 致敬开源精神 净化网络环境

![GitHub contributors](https://img.shields.io/github/contributors/fmz200/wool_scripts?style=for-the-badge)
![GitHub stars](https://img.shields.io/github/stars/fmz200/wool_scripts?color=ffd700&style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/fmz200/wool_scripts?color=60c5ba&style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/fmz200/wool_scripts?color=1E90FF&style=for-the-badge)
![Github Codelines](https://img.shields.io/tokei/lines/github/fmz200/wool_scripts?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/fmz200/wool_scripts?style=for-the-badge)
[![](https://img.shields.io/badge/-t.me/quguanggao-3db6f1?style=for-the-badge&logo=Telegram&logoColor=2ca5e0)](https://t.me/lanjieguanggao)

<br />

<p align="center">
  <a href="https://github.com/fmz200/wool_scripts">
    <img src="pic/logo/logo05.png" alt="Logo" width="400" height="110">
  </a>
</p>

---

## ✅ 一些说明

▶️ 每个配置文件的开头部分都有使用说明，使用前请先看一看。

▶️ 本库中部分内容收集于其他开源项目，在此对原作者表示衷心的感谢。同时我们谴责将他人内容标注为自己原创的行为。

▶️ 使用本项目中的内容所造成的一切后果，均由使用者承担。

▶️ 如果你在使用过程中有问题欢迎提交PR或ISSUE，也可进群交流，群链接在下方。

▶️ 交流群组：👉🏻[苹果iOS去广告交流群](https://t.me/lanjieguanggao)，👉🏻[奶思资源分享|频道](https://t.me/inaisi)，👉🏻[Quantumult X Community](https://t.me/QuantumultXCommunity)。


## ⚠️ 温馨提示

▶️ 本项目中的任何内容请不要在中国大陆的任何平台传播（包括但不限于链接分享，评论装逼，发帖炫耀），否则你可能会被开盒或收到大量举报。

▶️ Please do not disseminate the content in this project on any platform in mainland China. Thanks!


---

## 🚸 常见问题

### 1️⃣ ~~我为什么指定了抖音的分流到国外，评论视频却显示“IP未知”~~ 
### ✅ 抖音已经不需要家宽就可以更改IP，稍微干净的IP就可以

> ~~答：抖音与其他软件判断IP归属地的方式不同，抖音需要家庭宽带IP（又叫住宅IP）才能生效，而现在的大部分机场都是机房的IP，所以评论视频就显示IP未知。~~
> 如果你不知道自己抖音分流的IP是不是家宽，可以访问[https://ipinfo.io](https://ipinfo.io/) 查看，在`asn`
> 信息中如果你看到`type:
"isp"`那就是家庭宽带，其他值（比如：hosting，business）都不是家宽。

下方的抖音分流就可以实现修改IP（需要代理IP干净）：
```plaintext
# 抖音修改IP (QuanX)
HOST-SUFFIX, amemv.com, proxy
HOST-SUFFIX, douyinvod.com, proxy
```
```plaintext
# 抖音修改IP (Loon，Surge)
DOMAIN-SUFFIX, amemv.com, proxy
DOMAIN-SUFFIX, douyinvod.com, proxy
```

### 2️⃣ 为什么有些软件明明很热门，却没有人做去广告的规则

> 答：对于一些软件，如果整个域名都是广告，则可以直接reject整个域名去广告，但是大部分广告都和非广告内容一起返回，这就需要对响应体（response-body）进行解析来去掉其中的广告内容。
> 解析响应体的前提条件是访问的域名可以MITM（MAN-IN-THE-MIDDLE：中间人攻击），但是有些域名禁止了MITM，所以无法对响应体进行解析去广告。

### 3️⃣ 支持的规则都哪些？
支持列表（部分可能失效需要自己排查）：
> 12123, 12306, 21经济网, 2345天气王, 360儿童卫士, 36kr, 555影视, 51信用卡管家, 58, 500, 51job, AcFun, AppSo, 阿里巴巴, 阿里云盘, 爱奇艺, 爱企查, 爱回收, 爱思助手, 爱美剧, 爱阅书香, 爱桐乡, 
> 安徽掌上10000, 安吉星, 澳觅, Blued, 半月谈, 宝宝树孕育, 北京银行, 掌上京彩, 百度地图, 百度输入法, 百度网盘, 百度贴吧, 百度翻译, 百度文库, 百度, 百信银行, 哔哩哔哩, 哔哩哔哩漫画, 北京首汽, 贝壳找房, 
> 贝太厨房, 菠萝包轻小说, 比特球云盘, 币世界, 币安, 乐刻, 必胜客, 百视TV, 波点音乐, 薄荷健康, clicli, csdn, crunchyroll, 彩云天气, 菜鸟裹裹, 超星学习通, 长城炼金术, 曹操专车, 车来了, 超级课程表, 潮玩宇宙, 
> 财新, 财联社, 财经杂志, 刺猬猫阅读, 创客贴设计, DJI Store (大疆商城), 大麦, 大师兄, 大智慧, 大众点评, 达达骑士版, 动卡空间, 到梦空间, 低端影视, 豆瓣, 斗鱼直播, 当当阅读, 叮咚买菜, 叮嗒出行, 东方财富, 懂球帝, 
> 丁香医生, 丁香园, 钉钉, 动画疯, 滴滴出行, 滴滴青桔, 滴滴代驾小程序, 嘀嗒出行, 得物, 电E宝, 电视家, 盯盯拍, e代驾, e充电, 饿了么, Flightradar24, 飞猪 + 阿里巴巴, 飞常准, 飞客茶馆, 番茄小说, 樊登读书, 丰巢,
> 凤凰秀, 富途牛牛, 分期乐, 返利网, 发现精彩, 粉笔, 光大银行, 光大银行 阳光惠生活, 工商银行, 工银E生活, 工银e生活小程序, 广发银行, 广州农商银行, 广汽传祺, 国泰君安, 国家医保服务平台, 高德地图, 国家地理, 谷歌, 
> 挂号网（微医）, 国美电器, 故宫博物馆小程序, 怪兽充电, 盖得排行, 冠寓, 广汽本田, 怪兽充电 微信小程序, 工时记录, 高铁管家, 华彩生活, 华尔街见闻, 虎牙直播, 华住, 韩剧TV, 好奇心日报, 好好住, 火猫, 花生地铁, 花小猪,
> 虎扑, 杭州市民, 杭州公交, 红版报, 虎嗅, 黄油相机, 华宝智投, 航旅纵横, 汇丰汇选, 和风天气, 合利宝展业通, 盒马, 海豚优惠, 
> 海尔服务小程序, 好型体重秤, 横店电影小程序, 汇付天下, 海马爸比, i3, IT之家, 吉林银行, 江苏银行, 建行生活, 简讯, 金山词霸, 京东, 京东健康, 京喜, 京东金融, 京东读书, 京东云无线宝, 界面新闻, 
> 驾校一点通, 驾考宝典, 金十数据, 今日头条, 今日水印相机, 加油广东, 韭菜公社, 机核网, 街电 微信小程序, 极简汇率, keep, 快看, 快手, 夸克, 酷我音乐, 看天下, 看理想, 快递100, 开源中国, 快手联盟,优量汇, 穿山甲, 
> 口袋校园, 考公雷达/公考雷达, 酷安, 肯德基, Line, 拉卡拉, 懒人听书, 懒投资, 来疯, 来电 小程序净化, 莱充, 蓝基因, 乐橙, 乐堡潮玩馆小程序, 联想, 拦截100, 旅法师营地, LING Club-原菱菱邦, LocSim, lofter, 
> linxi, 两步路, 猎聘, MIX, 妈妈网孕育, 猫耳FM, 猫眼, 美团 & 美团外卖, 美团众包, 美团充电宝小程序, 每日优鲜, 买单吧, 民生银行, 全民生活, 芒果TV, 马蜂窝, 马达出行, 咪咕, 秒拍, 美图秀秀, 马卡龙玩图, 蘑菇租房, 
> 美味不用等, 漫画人, 埋堆堆, 脉脉, 麦当劳, NTPlay, 农业银行, 奈菲影视, 南方航空, 宁聚, 牛津高阶词典第十版, 牛听听, ofo共享单车, ONE, omofun, Oray, pikpak, PushPlus微信推送广告, 浦发银行, 浦大喜奔, 朴朴超市,
> 平安好车主, 平安壹钱包, 平安证券, 平安口袋银行, 拼多多, 票根, 票星球, 澎湃新闻, 皮皮虾, 皮皮搞笑评论区, QQ钱包, QQ浏览器, QQ音乐, 去哪儿, 起点读书, 七猫小说, 汽车之家, 穷游, 汽水音乐, 球迷报, 亲宝宝, 全民K歌,
> 全家便利店, 全能浏览器, 全球购骑士卡, 去哒, Reddit, 人民日报, 人人视频, 日日煮, 日淘任意门, 日产智联, RARBG, 瑞幸咖啡, spotify, Soul, Stay, 苏宁, 苏e行, 苏周到, 苏打校园APP, 四季線上影視, 四川航空,
> 搜狐, 搜狗输入法, 搜电充电 微信小程序, 深圳通, 盛趣游戏, 什么值得买, 神马, 顺丰快递, 顺丰快递小程序, 顺丰优选, 少数派, 书旗小说, 神舟汽车, 上汽大众, 首汽约车, 首旅如家, 三联中读, 识货, 闪现一下, 闪动校园,
> 山姆会员商店, 旅途随身听, 收钱吧 - 买单小程序, 省省回头车, TestFlight, TT语音, TapTap, TubeMax, top-widget, 天府市民云, 天府手机银行, 天府银行小程序, 天府通, 天山云TV, 天天基金, 天星金融, 天猫精灵, 
> 天猫养车, 天翼云盘, 同花顺, 同程旅行, 淘票票, 淘淘阅读, 途牛, 途虎养车小程序, 途家民宿, 太平洋电脑, 太平洋知科技, 天气通 分流即可, 淘宝, 腾讯视频, 腾讯乘车码微信小程序, 腾讯游戏社区, 腾讯游戏, 腾讯手机管家, 
> 腾讯地图, 腾讯新闻, 腾讯体育, 腾讯广告, 推栏, U净, udn news, vgTime, Vista看天下, Weico(微博客户端), WPS, WIFI万能钥匙, 完美世界电竞, 万词王, 万达电影小程序, 微信, 网易新闻, 网易有钱, 网易严选, 
> 网易蜗牛读书, 网易考拉, 网易云音乐, 网易邮箱, 网易, 网易大神, 网易有道词典, 网上国网, 威锋, 微店, 无他相机, 悟空遥控器, 蜗牛睡眠, 本来生活, 唯品会, 稿定设计, 温尼伯站, 小米商城, 小米有品, 小米运动, 小米打印, 
> 小米金融, 米家, 米读, 米游社, 雪球, 下厨房, 兴业银行, 兴业生活, 星火英语, 星途 starway, 星财富, 迅雷, 迅游加速器, 小睡眠, 小特- 首选特斯拉中文社区, 小利生活, 小兔充充, 小电充电 微信小程序, 小合拓展, 小牛, 
> 小桔科技, 小艺, 小Biu智家, 小熊艺术, 小佩宠物, 小白学习打印机 开屏广告, 小象超市, 小芒, 小蚕霸王餐, 晓晓优选, 希尔顿 荣誉客会, 希沃白板5, 西施眼, 西窗烛, 稀饭动漫, 向日葵, 心悦俱乐部, 兴业证券, 熊猫直播, 讯飞, 
> 携程, 虾米音乐, 厦门航空, 闲鱼, 新浪新闻, 新片场, 香蕉是一种水果, 小红书, 喜马拉雅, YouTube, 曜影医疗, 云闪付, 邮储银行, 银盛通, 盈宝证券, 盈立智投, 优酷, 游戏时光, 永辉, 悠洗APP, 一淘, 一号店, 一汽大众, 
> 一起考教师, 有兔阅读(米兔), 雅虎, 印象笔记, 易车, 易捷加油小程序, 易校园, 萤石, 云宝宝大数据, 友邻优课, 友邦, 医考帮, 艺龙旅行网, 映客直播, 云麦, 央视, 央视频, 猿辅导, 一刻相册, 易捷加油, 翼支付, 鸭奈飞, 优书,
> 育学园, 亚马逊, 亚朵开屏, 永安行, 招商银行, 掌上生活, 中国银行, 中国银行 缤纷生活, 中信银行, 中国移动, 中国移动 江苏, 中国移动 安徽, 中国移动 广东, 中国移动 广西, 中国移动 山东, 中国移动云盘, 中国联通, 中国电信,
> 中国广电, 中国天气网小程序, 中国知网, 中国人保, 中油优途, 中羽在线, 中通快递, 中银跨境GO, 中油好客e站小程序, 中关村在线, 众邦银行, 涨乐财富通, 知乎, 追书神器, 作业帮, 掌阅, 掌上道具城, 掌上公交, 掌上鹿城, 
> 字节跳动, 最右, 转转, 掌上英雄联盟, 浙里办, 郑好办, 住这儿, 指点天下, 猪八戒, 智行APP, 自如, 追剧达人, 职工普惠, 正气助手, 招财猫直聘, 中国国际航空
> 

已知不能或不能完全去广告的app有：
> 抖音，今日头条、蜂巢、滴答清单 Taio、小米运动、有条下载、Fileball、万年历、豆瓣（信息流）、虎牙直播、货拉拉、番茄小说、凯叔讲故事、
> 什么值得买、广东移动、淘宝、银行类（绝大部分）。

---

## 🍑 开始使用

### 0️⃣ 其它项

| # | 配置类型    | 配置名称      | 配置链接                                                                                                    | 作者                                  | 特别说明              | 使用教程                           |
|---|---------|-----------|---------------------------------------------------------------------------------------------------------|-------------------------------------|-------------------|--------------------------------|
| # | icons图标 | `icons图标` | [icons-all.json](https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/icons-all.json)       | [fmz200](https://github.com/fmz200) | 包含APP，机场，LPL等大量图标 | 暂无                             |
| # | BoxJS订阅 | `BoxJS订阅` | [fmz200_boxjs.json](https://raw.githubusercontent.com/fmz200/wool_scripts/main/boxjs/fmz200_boxjs.json) | [fmz200](https://github.com/fmz200) | 先查看使用教程           | [点击查看](https://docs.boxjs.app) |


### 1️⃣ Loon配置

| # | 配置类型    | 配置名称               | 配置链接                                                                                              | 作者                                  | 特别说明                               | 使用教程 |
|---|---------|--------------------|---------------------------------------------------------------------------------------------------|-------------------------------------|------------------------------------|------|
| # | 配置      | `懒人配置`             | [Loon.conf](https://raw.githubusercontent.com/fmz200/wool_scripts/main/Loon/config/Loon.conf)     | [fmz200](https://github.com/fmz200) | 下载此文件会覆盖原本所有配置，小白慎用                | 暂无   |
| # | 插件      | `微博去广告`            | [weibo.plugin](https://github.com/fmz200/wool_scripts/raw/main/Loon/plugin/weibo.plugin)          | [fmz200](https://github.com/fmz200) | 可能有遗漏                              | 暂无   |
| # | 插件      | `去广告合集`            | [blockAds.plugin](https://github.com/fmz200/wool_scripts/raw/main/Loon/plugin/blockAds.plugin)    | [fmz200](https://github.com/fmz200) | (支持约538款APP/小程序)针对部分APP和小程序广告进行拦截  | 暂无   |
| # | 插件      | `获取cookie&token合集` | [cookies.plugin](https://github.com/fmz200/wool_scripts/raw/main/Loon/plugin/cookies.plugin)      | [fmz200](https://github.com/fmz200) | 包含fmz200/NobyDa/chavyleung/Sunert等 | 暂无   |
| # | 脚本      | `Task订阅`           | [tasks.scripts](https://github.com/fmz200/wool_scripts/raw/main/Loon/script/tasks.scripts)        | [fmz200](https://github.com/fmz200) | 需要先获取cookie或token再运行               | 暂无   |
| # | 脚本      | `工具合集`             | [tools.scripts](https://github.com/fmz200/wool_scripts/raw/main/Loon/script/tools.scripts)        | [fmz200](https://github.com/fmz200) | 节点测试工具，导入后长按节点使用                   | 暂无   |
| # | 规则      | `去广告合集`            | [rejectAd.plugin](https://github.com/fmz200/wool_scripts/raw/main/Loon/rule/rejectAd.list)        | [fmz200](https://github.com/fmz200) | 从QX的分流去广告转换而来                      | 暂无   |
| # | 规则      | `AI分流规则合集`         | [AI.list](https://github.com/fmz200/wool_scripts/raw/main/Loon/rule/AI.list)                      | [fmz200](https://github.com/fmz200) | 汇集常用的AI模型                          | 暂无   |
| # | 规则      | `屏蔽苹果系统更新`         | [apple_update.list](https://github.com/fmz200/wool_scripts/raw/main/Loon/rule/apple_update.list)  | [fmz200](https://github.com/fmz200) | 无                                  | 暂无   |


### 2️⃣ QuantumultX配置

- 2025-03-19 21:30:00，鉴于QX太久没有更新功能，无法更好地适配规则，所以停止更新。
- 2025-05-15 20:00:00，恢复更新。

> 📍 借助 [QuanX官方Github地址](https://github.com/crossutility/Quantumult-X)，你可以更快地理解QX配置。
>
> 📍 配置前建议先看一看 [QuanX 小白配置图文教程](./QuantumultX/How-To-Use.md)，这里包括了从准备配置到配置完成的详细说明。
>
> 📍 这里也有**Hell Cell**大佬的[视频教程](https://youtu.be/e8E8dtFaFUk)，强烈建议小白在配置前认真观看几遍！

| # | 配置类型   | 配置名称          | 配置链接                                                                                                               | 作者                                  | 特别说明                        | 使用教程                                                   |
|---|--------|---------------|--------------------------------------------------------------------------------------------------------------------|-------------------------------------|-----------------------------|--------------------------------------------------------|
| # | 配置     | `懒人配置`        | [QuanX.conf](https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/config/QuanX.conf)             | [fmz200](https://github.com/fmz200) | 下载此文件会覆盖原本所有配置              | [点击查看](./QuantumultX/config/00-How-To-Use-Config.md)   |
| # | 重写     | `去广告合集`       | [rewrite.snippet](https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/rewrite/rewrite.snippet)  | [fmz200](https://github.com/fmz200) | 去广告合集，不包含微博                 | [点击查看](./QuantumultX/rewrite/00-How-To-Use-Rewrite.md) |
| # | 重写     | `微博去广告`       | [weibo.snippet](https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/rewrite/weibo.snippet)      | [fmz200](https://github.com/fmz200) | 自用的配置                       | [点击查看](./QuantumultX/rewrite/00-How-To-Use-Rewrite.md) |
| # | 重写     | `获取cookie合集`  | [cookies.snippet](https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/rewrite/cookies.snippet)  | [fmz200](https://github.com/fmz200) | 包含NobyDa，chavyleung，Sunert等 | 暂无                                                     |
| # | 分流     | `去广告合集`       | [filter.list](https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/filter/filter.list)           | [fmz200](https://github.com/fmz200) | 无                           | [点击查看](./QuantumultX/filter/00-How-To-Use-Filter.md)   |
| # | 分流     | `屏蔽苹果系统更新`    | [apple.snippet](https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/filter/apple.snippet)       | [fmz200](https://github.com/fmz200) | 有效                          | [点击查看](./QuantumultX/filter/00-How-To-Use-Filter.md)   |
| # | Task订阅 | `Task订阅`      | [fmz200_tasks.json](https://raw.githubusercontent.com/fmz200/wool_scripts/main/boxjs/fmz200_tasks.json)            | [fmz200](https://github.com/fmz200) | 需要先获取cookie或token再运行        | 暂无                                                     |
| # | 重写     | `App&小程序净化合集` | [cleanup.snippet](https://github.com/fmz200/wool_scripts/raw/main/QuantumultX/rewrite/cleanup.snippet)             | [fmz200](https://github.com/fmz200) | 常见的微信小程序净化（有误杀慎用）           | 暂无                                                     |

> ⚠️ 当远程图标更新时如果你的图表库不更新多半是缓存的问题，请手动清理图标缓存(`点击右下角风车->划到最下面->选择其他设置->找到资源模块`，选择`删除图片缓存`)，并重启 Quantumult X，远程图标会重新下载并生效。


### 3️⃣ Surge配置

> 📍 你可以借助 [Script-Hub：重写 & 规则集转换](https://github.com/Script-Hub-Org/Script-Hub) 工具将上方的QX重写和分流添加到Surge中。
- 因为Loon和Surge的规则是通用的，所以统一把规则放到Loon文件夹中


### 4️⃣ ShadowRocket配置

> 📍 你可以借助 [Script-Hub：重写 & 规则集转换](https://github.com/Script-Hub-Org/Script-Hub) 工具将上方的QX重写和分流添加到ShadowRocket中。


### 5️⃣ Stash配置

> 📍 你可以借助 [Script-Hub：重写 & 规则集转换](https://github.com/Script-Hub-Org/Script-Hub) 工具将上方的QX重写和分流添加到Stash中。


### 6️⃣ Egern，LanceX配置

> 📍 你可以借助 [Script-Hub：重写 & 规则集转换](https://github.com/Script-Hub-Org/Script-Hub) 工具将上方的QX重写和分流添加到Egern或LanceX中。

---


## 🧚‍♂️ 特别鸣谢

- [@28413761](https://github.com/28413761)
- [@app2smile](https://github.com/app2smile)
- [@blackmatrix7](https://github.com/blackmatrix7)
- [@chavyleung](https://github.com/chavyleung)
- [@chengkongyiban](https://github.com/chengkongyiban)
- [@DivineEngine](https://github.com/DivineEngine)
- [@I-am-R-E](https://github.com/I-am-R-E)
- [@Keywos](https://github.com/Keywos)
- [@kokoryh](https://github.com/kokoryh)
- [@KOP-XIAO](https://github.com/KOP-XIAO)
- [@lodepuly](https://gitlab.com/lodepuly)
- [@NobyDa](https://github.com/NobyDa)
- [@Orz-3](https://github.com/Orz-3)
- [@RuCu6](https://github.com/RuCu6)
- [@Tartarus2014](https://github.com/Tartarus2014)
- [@zmqcherish](https://github.com/zmqcherish)

## ♻️ 项目状态

![Alt](https://repobeats.axiom.co/api/embed/3ed497076151b9b7ba73d5653f7ac9d025314de9.svg "Repobeats analytics image")


## 🌟 欢迎星标

![Star](https://api.star-history.com/svg?repos=fmz200/wool_scripts&type=Date)

## 💹 访问量统计

![Visitor Count](https://profile-counter.glitch.me/fmz200/count.svg)

