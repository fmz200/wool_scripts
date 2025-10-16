# wool_scripts

## 致敬开源精神 净化网络环境

![GitHub contributors](https://img.shields.io/github/contributors/fmz200/wool_scripts?style=for-the-badge)
![GitHub stars](https://img.shields.io/github/stars/fmz200/wool_scripts?color=ffd700&style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/fmz200/wool_scripts?color=60c5ba&style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/fmz200/wool_scripts?color=1E90FF&style=for-the-badge)
![GitHub](https://img.shields.io/github/license/fmz200/wool_scripts?style=for-the-badge)
[![](https://img.shields.io/badge/-t.me/inaisi-3db6f1?style=for-the-badge&logo=Telegram&logoColor=2ca5e0)](https://t.me/inaisi)

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
# 抖音修改IP (QuanX 打开解析器，Loon，Surge，Egern直接引用)
https://github.com/fmz200/wool_scripts/raw/main/Loon/rule/Douyin.list
```

### 2️⃣ 为什么有些软件明明很热门，却没有人做去广告的规则

> 答：对于一些软件，如果整个域名都是广告，则可以直接reject整个域名去广告，但是大部分广告都和非广告内容一起返回，这就需要对响应体（response-body）进行解析来去掉其中的广告内容。
> 解析响应体的前提条件是访问的域名可以MITM（MAN-IN-THE-MIDDLE：中间人攻击），但是有些域名禁止了MITM，所以无法对响应体进行解析去广告。

### 3️⃣ 支持的规则都哪些？
支持列表（部分可能失效需要自己排查）：
> 往下翻有详细的列表

已知不能或不能完全去广告的app有：
> 抖音，今日头条、蜂巢、滴答清单 Taio、小米运动、有条下载、Fileball、万年历、豆瓣（信息流）、虎牙直播、货拉拉、番茄小说、凯叔讲故事、银行类（绝大部分）。

---

## 🍑 开始使用

### 0️⃣ 其它配置

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

| # | 配置类型   | 配置名称          | 配置链接                                                                                                                         | 作者                                  | 特别说明                        | 使用教程                                                   |
|---|--------|---------------|------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|-----------------------------|--------------------------------------------------------|
| # | 配置     | `懒人配置`        | [QuanX.conf](https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/config/QuanX.conf)                       | [fmz200](https://github.com/fmz200) | 下载此文件会覆盖原本所有配置              | [点击查看](./QuantumultX/config/00-How-To-Use-Config.md)   |
| # | 重写     | `去广告合集`       | [rewrite.snippet](https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/rewrite/rewrite.snippet)            | [fmz200](https://github.com/fmz200) | 去广告合集，不包含微博                 | [点击查看](./QuantumultX/rewrite/00-How-To-Use-Rewrite.md) |
| # | 重写     | `微博去广告`       | [weibo.snippet](https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/rewrite/weibo.snippet)                | [fmz200](https://github.com/fmz200) | 自用的配置                       | [点击查看](./QuantumultX/rewrite/00-How-To-Use-Rewrite.md) |
| # | 重写     | `获取cookie合集`  | [cookies.snippet](https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/rewrite/cookies.snippet)            | [fmz200](https://github.com/fmz200) | 包含NobyDa，chavyleung，Sunert等 | 暂无                                                     |
| # | 重写     | `App&小程序净化合集` | [cleanup.snippet](https://github.com/fmz200/wool_scripts/raw/main/QuantumultX/rewrite/cleanup.snippet)                       | [fmz200](https://github.com/fmz200) | 常见的微信小程序净化（有误杀慎用）           | 暂无                                                     |
| # | 分流     | `去广告合集`       | [filter.list](https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/filter/filter.list)                     | [fmz200](https://github.com/fmz200) | 无                           | [点击查看](./QuantumultX/filter/00-How-To-Use-Filter.md)   |
| # | 分流     | `屏蔽苹果系统更新`    | [blockAppleUpdate.list](https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/filter/blockAppleUpdate.list) | [fmz200](https://github.com/fmz200) | 有效                          | [点击查看](./QuantumultX/filter/00-How-To-Use-Filter.md)   |
| # | Task订阅 | `Task订阅`      | [fmz200_tasks.json](https://raw.githubusercontent.com/fmz200/wool_scripts/main/QuantumultX/tasks/fmz200_tasks.json)          | [fmz200](https://github.com/fmz200) | 需要先获取cookie或token再运行        | 暂无                                                     |

> ⚠️ 当远程图标更新时如果你的图表库不更新多半是缓存的问题，请手动清理图标缓存(`点击右下角风车->划到最下面->选择其他设置->找到资源模块`，选择`删除图片缓存`)，并重启 Quantumult X，远程图标会重新下载并生效。


### 3️⃣ Surge配置

> 📍 你可以借助 [Script-Hub：重写 & 规则集转换](https://github.com/Script-Hub-Org/Script-Hub) 工具将上方的QX重写和分流添加到Surge中。
- 因为Loon和Surge的规则是通用的，所以统一把规则放到Loon文件夹中


### 4️⃣ ShadowRocket配置

> 📍 你可以借助 [Script-Hub：重写 & 规则集转换](https://github.com/Script-Hub-Org/Script-Hub) 工具将上方的QX重写和分流添加到ShadowRocket中。


### 5️⃣ Stash配置

> 📍 你可以借助 [Script-Hub：重写 & 规则集转换](https://github.com/Script-Hub-Org/Script-Hub) 工具将上方的QX重写和分流添加到Stash中。


### 6️⃣ Egern配置

> 📍 你可以借助 [Script-Hub：重写 & 规则集转换](https://github.com/Script-Hub-Org/Script-Hub) 工具将上方的QX重写和分流添加到Egern中。

---

## 🍟 规则列表

### 🧬 规则文件超长无法显示完全，点击右侧链接跳转，[点我点我](https://github.com/fmz200/wool_scripts/blob/main/README-RULE.md#-%E8%A7%84%E5%88%99%E5%88%97%E8%A1%A8)


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
- [@lodepuly](https://github.com/luestr)
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

![Visitor Count](https://visitor-badge.laobi.icu/badge?page_id=fmz200.wool_scripts)

<!---   ![Visitor Count](https://profile-counter.glitch.me/fmz200/count.svg)    --->

