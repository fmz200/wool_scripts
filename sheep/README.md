
羊了个羊接口文档
===========================
该文档仅供学习交流使用，不可用于非法目的。如侵权请联系我删除！
****

|作者| fmz200 | [邮箱 📮](#haima@duck.com)
|---|--------|--------

****
**说明：该文档中的 t ，uid，token 为用户信息，自行抓取，请勿泄露给他人。**
**如有问题提issue，补充欢迎pr👨‍💻 ‍。**
****
更新日志：
* 1、2022-09-27 新增羊了个羊接口说明
* 2、
****

## 目录
* [1、登录接口](#1、登录接口)
* [2、更新用户信息接口](#2、更新用户信息接口)
* [3、查询用户信息接口](#3、查询用户信息接口)
* [4、朋友圈今日排行榜](#4、朋友圈今日排行榜)
* [5、朋友圈历史排行榜](#5、朋友圈历史排行榜)
* [6、首页全国羊群接口](#6、首页全国羊群接口)
* [7、话题信息接口](#7、话题信息接口)
* [8、获取地图接口](#8、获取地图接口)
* [9、游戏结束接口](#9、游戏结束接口)
* [10、获取第一关地图接口](#10、获取第一关地图接口)
* [11、获取第二关地图接口](#11、获取第二关地图接口)
* [12、俺的名片接口](#12、俺的名片接口)



### 1、登录接口
<details>
<summary>点击展开</summary>

#### 1.1 请求URL：https://cat-match.easygame2021.com/sheep/v1/user/login_wx
#### 请求体：
```json
{
  "code" : "............"
}
```
#### 响应体：
```json
{
  "err_code" : 0,
  "err_msg" : "",
  "data" : {
    "time" : 1664431123219,
    "uid" : "你的uid",
    "token" : "你的token",
    "open_id" : "xx"
  }
}
```
#### 脚本示例：
```javascript
const url = `https://cat-match.easygame2021.com/sheep/v1/user/login_wx?`;
const method = `POST`;
const headers = {
    'Accept-Encoding' : `gzip,compress,br,deflate`,
    'content-type' : `application/json`,
    'Connection' : `keep-alive`,
    't' : `你的t值`,
    'Referer' : `https://servicewechat.com/wx141bfb9b73c970a9/29/page-frame.html`,
    'Host' : `cat-match.easygame2021.com`,
    'User-Agent' : `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d25) NetType/4G Language/zh_CN`
};
const body = `{"code":"............"}`;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
```
</details>


### 2、更新用户信息接口
<details>
<summary>点击展开</summary>

#### 2.1 请求URL：https://cat-match.easygame2021.com/sheep/v1/game/update_user
#### 2.2 请求体：
```json
{
  "nick_name" : "你的昵称",
  "avatar" : "https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/132",
  "gender" : 0
}

```
#### 2.3 响应体：
```json
{
  "err_code" : 0,
  "err_msg" : "",
  "data" : "OK"
}

```
#### 2.4 脚本示例：
```javascript
const url = `https://cat-match.easygame2021.com/sheep/v1/game/update_user?`;
const method = `POST`;
const headers = {
    'Accept-Encoding': `gzip,compress,br,deflate`,
    'content-type': `application/json`,
    'Connection': `keep-alive`,
    't': `你的t值`,
    'Referer': `https://servicewechat.com/wx141bfb9b73c970a9/29/page-frame.html`,
    'Host': `cat-match.easygame2021.com`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d25) NetType/4G Language/zh_CN`
};
const body = `{"nick_name":"你的昵称","avatar":"https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/132","gender":0}`;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
```
</details>

### 3、查询用户信息接口
<details>
<summary>点击展开</summary>

#### 3.1 请求URL：https://cat-match.easygame2021.com/sheep/v1/game/user_info?uid=你的uid
#### 3.2 请求体：
```json
  无请求体
```
#### 3.3 响应体：
```json
{
  "err_code" : 0,
  "err_msg" : "",
  "data" : {
    "gender" : 0,
    "nick_name" : "你的昵称",
    "avatar" : "https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/132",
    "id" : "你的用户id",
    "created_at" : "2022-09-22T02:55:03.466Z",
    "union_id" : "oNvyk5vFHYFQQ6YeD9L1Nmi3UmPQ",
    "platform" : 1,
    "updated_at" : "2022-09-22T02:55:03.466Z",
    "open_id" : "oOYg25J5qEbZgzRY0jQI3SHpxV2I"
  }
}
```
#### 3.4 脚本示例：
```javascript
const url = `https://cat-match.easygame2021.com/sheep/v1/game/user_info?uid=你的用户id`;
const method = `GET`;
const headers = {
    'Accept-Encoding': `gzip,compress,br,deflate`,
    'content-type': `application/json`,
    'Connection': `keep-alive`,
    'Referer': `https://servicewechat.com/wx141bfb9b73c970a9/29/page-frame.html`,
    't': `你的t值`,
    'Host': `cat-match.easygame2021.com`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d25) NetType/4G Language/zh_CN`
};
const body = ``;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
```
</details>


### 4、朋友圈今日排行榜
<details>
<summary>点击展开</summary>

#### 4.1 请求URL：https://cat-match.easygame2021.com/sheep/v1/game/user_rank_info?uid=你的用户id
#### 4.2 请求体：
```json
  无请求体
```
#### 4.3 响应体：
```json
{
  "err_code" : 0,
  "err_msg" : "",
  "data" : {
    "region" : "中国",
    "user" : {
      "state" : 0,
      "first" : 0,
      "uid" : "",
      "nick_name" : "",
      "time" : 0,
      "avatar" : "",
      "skin" : 0,
      "city" : "",
      "region" : "",
      "role" : 0,
      "ts" : 0,
      "fail" : 0,
      "gender" : 0
    }
  }
}
```
#### 4.4 脚本示例：
```javascript
const url = `https://cat-match.easygame2021.com/sheep/v1/game/user_rank_info?uid=你的用户id`;
const method = `GET`;
const headers = {
    'Accept-Encoding': `gzip,compress,br,deflate`,
    'content-type': `application/json`,
    'Connection': `keep-alive`,
    'Referer': `https://servicewechat.com/wx141bfb9b73c970a9/29/page-frame.html`,
    't': `你的t值`,
    'Host': `cat-match.easygame2021.com`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d25) NetType/4G Language/zh_CN`
};
const body = ``;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
```
</details>


### 5、朋友圈历史排行榜
<details>
<summary>点击展开</summary>

#### 5.1 请求URL：https://cat-match.easygame2021.com/sheep/v1/game/rank_stage_info
#### 5.2 请求体：
```json
    无请求体
```
#### 5.3 响应体：
```json

{
  "err_code" : 0,
  "err_msg" : "",
  "data" : {
    "iqWin" : {
      "state" : 0,
      "first" : 0,
      "uid" : "",
      "nick_name" : "",
      "time" : 0,
      "avatar" : "",
      "skin" : 0,
      "city" : "",
      "region" : "",
      "role" : 0,
      "ts" : 0,
      "fail" : 0,
      "gender" : 0
    },
    "firstWin" : {
      "state" : 0,
      "first" : 0,
      "uid" : "",
      "nick_name" : "",
      "time" : 0,
      "avatar" : "",
      "skin" : 0,
      "city" : "",
      "region" : "",
      "role" : 0,
      "ts" : 0,
      "fail" : 0,
      "gender" : 0
    },
    "timeWin" : {
      "state" : 0,
      "first" : 0,
      "uid" : "",
      "nick_name" : "",
      "time" : 0,
      "avatar" : "",
      "skin" : 0,
      "city" : "",
      "region" : "",
      "role" : 0,
      "ts" : 0,
      "fail" : 0,
      "gender" : 0
    }
  }
}
```
#### 5.3 脚本示例：
```javascript
const url = `https://cat-match.easygame2021.com/sheep/v1/game/rank_stage_info?`;
const method = `GET`;
const headers = {
    'Accept-Encoding': `gzip,compress,br,deflate`,
    'content-type': `application/json`,
    'Connection': `keep-alive`,
    'Referer': `https://servicewechat.com/wx141bfb9b73c970a9/29/page-frame.html`,
    't': `你的t值`,
    'Host': `cat-match.easygame2021.com`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d25) NetType/4G Language/zh_CN`
};
const body = ``;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
```
</details>

### 6、首页全国羊群接口
<details>
<summary>点击展开</summary>

#### 6.1 请求URL：https://cat-match.easygame2021.com/sheep/v1/game/rank_info_byte?isByte=true
#### 6.2 请求体：
```json
    无请求体
```
#### 6.3 响应体：
```json
    响应为字节数据文本
```
#### 6.4 脚本示例：
```javascript
const url = `https://cat-match.easygame2021.com/sheep/v1/game/rank_info_byte?isByte=true`;
const method = `GET`;
const headers = {
    'Accept-Encoding': `gzip,compress,br,deflate`,
    'content-type': `application/json`,
    'Connection': `keep-alive`,
    'Referer': `https://servicewechat.com/wx141bfb9b73c970a9/29/page-frame.html`,
    't': `你的t值`,
    'Host': `cat-match.easygame2021.com`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d25) NetType/4G Language/zh_CN`
};
const body = ``;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});

```
</details>

### 7、话题信息接口
<details>
<summary>点击展开</summary>

#### 7.1 请求URL：https://cat-match.easygame2021.com/sheep/v1/game/topic_match_info?type=2&uid=你的用户id
#### 7.2 请求体：
```json
    无请求体
```
#### 7.3 响应体：
```json
{
  "err_code" : 0,
  "err_msg" : "",
  "data" : {
    "taoist" : null,
    "taoist_fail_count" : 0,
    "taoist_fail_member" : 0,
    "topic" : {
      "id" : 0,
      "ts" : "",
      "info" : {
        "nick_name" : "",
        "avatar" : "",
        "uid" : "",
        "time" : 0,
        "ts" : 0,
        "fail" : 0,
        "city" : "",
        "type" : 0,
        "state" : 0
      },
      "name" : "",
      "tomb" : 0,
      "taoist" : 0
    },
    "tomb_fail_count" : 0,
    "tomb_fail_member" : 0,
    "tomb" : null
  }
}
```
#### 7.4 脚本示例：
```javascript
const url = `https://cat-match.easygame2021.com/sheep/v1/game/topic_match_info?type=2&uid=你的用户id`;
const method = `GET`;
const headers = {
    'Accept-Encoding': `gzip,compress,br,deflate`,
    'content-type': `application/json`,
    'Connection': `keep-alive`,
    'Referer': `https://servicewechat.com/wx141bfb9b73c970a9/29/page-frame.html`,
    't': `你的t值`,
    'Host': `cat-match.easygame2021.com`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d25) NetType/4G Language/zh_CN`
};
const body = ``;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});

```
</details>

### 8、获取地图接口
<details>
<summary>点击展开</summary>

#### 8.1 请求URL：https://cat-match.easygame2021.com/sheep/v1/game/map_info_ex?matchType=3
#### 8.2 请求体：
```json
    无请求体
```
#### 8.3 响应体：
```json
{
  "err_code" : 0,
  "err_msg" : "",
  "data" : {
    "map_md5" : [
      "046ef1bab26e5b9bfe2473ded237b572",
      "d9d5f97bbf1c587b34da2120da77c22e"
    ],
    "map_seed" : [
      4232401885,
      132803809,
      1943796078,
      1076140864
    ],
    "map_seed_2" : "1665528879"
  }
}

```
#### 8.4 脚本示例：
```javascript
const url = `https://cat-match.easygame2021.com/sheep/v1/game/map_info_ex?matchType=3`;
const method = `GET`;
const headers = {
    'Accept-Encoding': `gzip,compress,br,deflate`,
    'content-type': `application/json`,
    'Connection': `keep-alive`,
    'Referer': `https://servicewechat.com/wx141bfb9b73c970a9/29/page-frame.html`,
    't': `你的t值`,
    'Host': `cat-match.easygame2021.com`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d25) NetType/4G Language/zh_CN`
};
const body = ``;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});

```
</details>

### 9、游戏结束接口
<details>
<summary>点击展开</summary>

#### 9.1 请求URL：https://cat-match.easygame2021.com/sheep/v1/game/game_over_ex
#### 9.2 请求体：
```json
{
  "MatchPlayInfo" : "CAMiBQi+ARADIgUIuwEQAyIFCMEBEAMiBQixARAKIgUI2QEQCiIFCJMBEAciBQjDARAHIgUIywEQByIFCMIBEAsiBQiaARALIgQIUBALIgUIzAEQBCIFCLIBEAQiBQjIARAEIgUIxwEQASIFCMoBEAEiBQiqARABIgUI1wEQECIECE8QCSIFCM4BEA4iBQjPARANIgUIrQEQDQ==",
  "Version" : "0.0.1",
  "MapSeed2" : "1665528879",
  "skin" : 1,
  "rank_time" : 34,
  "rank_role" : 1,
  "rank_state" : 2,
  "rank_score" : 1
}
```
#### 9.3 响应体：
```json
{
  "err_code" : 0,
  "err_msg" : "",
  "data" : 0
}
```
#### 9.4 脚本示例：
```javascript
const url = `https://cat-match.easygame2021.com/sheep/v1/game/game_over_ex?`;
const method = `POST`;
const headers = {
    'Accept-Encoding': `gzip,compress,br,deflate`,
    'content-type': `application/json`,
    'Connection': `keep-alive`,
    't': `你的t值`,
    'Referer': `https://servicewechat.com/wx141bfb9b73c970a9/29/page-frame.html`,
    'Host': `cat-match.easygame2021.com`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d25) NetType/4G Language/zh_CN`
};
const body = `{"rank_score":1,"rank_state":2,"rank_time":34,"rank_role":1,"skin":1,"MatchPlayInfo":"CAMiBQi+ARADIgUIuwEQAyIFCMEBEAMiBQixARAKIgUI2QEQCiIFCJMBEAciBQjDARAHIgUIywEQByIFCMIBEAsiBQiaARALIgQIUBALIgUIzAEQBCIFCLIBEAQiBQjIARAEIgUIxwEQASIFCMoBEAEiBQiqARABIgUI1wEQECIECE8QCSIFCM4BEA4iBQjPARANIgUIrQEQDQ==","MapSeed2":"1665528879","Version":"0.0.1"}`;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
```
</details>

### 10、获取第一关地图接口
<details>
<summary>点击展开</summary>

#### 10.1 请求URL：https://cat-match-static.easygame2021.com/maps/046ef1bab26e5b9bfe2473ded237b572.txt
#### 10.2 请求体：
```json
    无请求体
```
#### 10.3 响应体：
```json

{
  "widthNum" : 8,
  "blockTypeData" : {
    "1" : 1,
    "2" : 2,
    "3" : 2
  },
  "levelKey" : 80001,
  "heightNum" : 10,
  "levelData" : {
    "1" : [
      {
        "rolNum" : 16,
        "rowNum" : 16,
        "blockNode" : null,
        "id" : "1-16-16",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 1
      },
      {
        "rolNum" : 28,
        "rowNum" : 16,
        "blockNode" : null,
        "id" : "1-28-16",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 1
      },
      {
        "rolNum" : 40,
        "rowNum" : 16,
        "blockNode" : null,
        "id" : "1-40-16",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 1
      },
      {
        "rolNum" : 16,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "1-16-32",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 1
      },
      {
        "rolNum" : 28,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "1-28-32",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 1
      },
      {
        "rolNum" : 40,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "1-40-32",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 1
      },
      {
        "rolNum" : 16,
        "rowNum" : 48,
        "blockNode" : null,
        "id" : "1-16-48",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 1
      },
      {
        "rolNum" : 28,
        "rowNum" : 48,
        "blockNode" : null,
        "id" : "1-28-48",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 1
      },
      {
        "rolNum" : 40,
        "rowNum" : 48,
        "blockNode" : null,
        "id" : "1-40-48",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 1
      }
    ],
    "2" : [
      {
        "rolNum" : 16,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "2-16-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 2
      },
      {
        "rolNum" : 28,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "2-28-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 2
      },
      {
        "rolNum" : 40,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "2-40-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 2
      },
      {
        "rolNum" : 16,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "2-16-20",
        "moldType" : 1,
        "type" : 1,
        "layerNum" : 2
      },
      {
        "rolNum" : 28,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "2-28-20",
        "moldType" : 1,
        "type" : 1,
        "layerNum" : 2
      },
      {
        "rolNum" : 40,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "2-40-20",
        "moldType" : 1,
        "type" : 1,
        "layerNum" : 2
      },
      {
        "rolNum" : 16,
        "rowNum" : 49,
        "blockNode" : null,
        "id" : "2-16-49",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 2
      },
      {
        "rolNum" : 28,
        "rowNum" : 49,
        "blockNode" : null,
        "id" : "2-28-49",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 2
      },
      {
        "rolNum" : 40,
        "rowNum" : 49,
        "blockNode" : null,
        "id" : "2-40-49",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 2
      }
    ],
    "3" : [

    ]
  }
}
```
#### 10.4 脚本示例：
```javascript
const url = `https://cat-match-static.easygame2021.com/maps/046ef1bab26e5b9bfe2473ded237b572.txt`;
const method = `GET`;
const headers = {
    'Referer': `https://servicewechat.com/wx141bfb9b73c970a9/29/page-frame.html`,
    'Connection': `keep-alive`,
    'Accept-Encoding': `gzip,compress,br,deflate`,
    'Host': `cat-match-static.easygame2021.com`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d25) NetType/4G Language/zh_CN`
};
const body = ``;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
```

</details>


### 11、获取第二关地图接口
<details>
<summary>点击展开</summary>

#### 11.1 请求URL：https://cat-match-static.easygame2021.com/maps/d9d5f97bbf1c587b34da2120da77c22e.txt
#### 11.2 请求体：
```json
    无请求体
```
#### 11.3 响应体：
<details>
<summary>点击展开json内容</summary>

```json
{
  "levelData" : {
    "18" : [
      {
        "rolNum" : 20,
        "rowNum" : 16,
        "blockNode" : null,
        "id" : "18-20-16",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 18
      },
      {
        "rolNum" : 28,
        "rowNum" : 16,
        "blockNode" : null,
        "id" : "18-28-16",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 18
      },
      {
        "rolNum" : 16,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "18-16-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 18
      },
      {
        "rolNum" : 16,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "18-16-32",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 18
      },
      {
        "rolNum" : 24,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "18-24-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 18
      },
      {
        "rolNum" : 40,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "18-40-32",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 18
      },
      {
        "rolNum" : 32,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "18-32-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 18
      },
      {
        "rolNum" : 40,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "18-40-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 18
      },
      {
        "rolNum" : 32,
        "rowNum" : 48,
        "blockNode" : null,
        "id" : "18-32-48",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 18
      },
      {
        "rolNum" : 40,
        "rowNum" : 12,
        "blockNode" : null,
        "id" : "18-40-12",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 18
      },
      {
        "rolNum" : 36,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "18-36-20",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 18
      },
      {
        "rolNum" : 44,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "18-44-20",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 18
      },
      {
        "rolNum" : 12,
        "rowNum" : 44,
        "blockNode" : null,
        "id" : "18-12-44",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 18
      },
      {
        "rolNum" : 20,
        "rowNum" : 44,
        "blockNode" : null,
        "id" : "18-20-44",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 18
      },
      {
        "rolNum" : 20,
        "rowNum" : 52,
        "blockNode" : null,
        "id" : "18-20-52",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 18
      }
    ],
    "10" : [
      {
        "rolNum" : 24,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "10-24-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 10
      },
      {
        "rolNum" : 32,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "10-32-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 10
      },
      {
        "rolNum" : 24,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "10-24-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 10
      },
      {
        "rolNum" : 32,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "10-32-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 10
      },
      {
        "rolNum" : 4,
        "rowNum" : 37,
        "blockNode" : null,
        "id" : "10-4-37",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 10
      },
      {
        "rolNum" : 52,
        "rowNum" : 37,
        "blockNode" : null,
        "id" : "10-52-37",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 10
      }
    ],
    "19" : [
      {
        "rolNum" : 16,
        "rowNum" : 12,
        "blockNode" : null,
        "id" : "19-16-12",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 24,
        "rowNum" : 12,
        "blockNode" : null,
        "id" : "19-24-12",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 32,
        "rowNum" : 12,
        "blockNode" : null,
        "id" : "19-32-12",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 12,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "19-12-20",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 20,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "19-20-20",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 28,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "19-28-20",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 12,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "19-12-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 20,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "19-20-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 28,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "19-28-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 36,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "19-36-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 44,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "19-44-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 12,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "19-12-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 20,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "19-20-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 28,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "19-28-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 36,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "19-36-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 44,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "19-44-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 28,
        "rowNum" : 44,
        "blockNode" : null,
        "id" : "19-28-44",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 36,
        "rowNum" : 44,
        "blockNode" : null,
        "id" : "19-36-44",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 44,
        "rowNum" : 44,
        "blockNode" : null,
        "id" : "19-44-44",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 28,
        "rowNum" : 52,
        "blockNode" : null,
        "id" : "19-28-52",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 36,
        "rowNum" : 52,
        "blockNode" : null,
        "id" : "19-36-52",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 44,
        "rowNum" : 8,
        "blockNode" : null,
        "id" : "19-44-8",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 40,
        "rowNum" : 16,
        "blockNode" : null,
        "id" : "19-40-16",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 48,
        "rowNum" : 16,
        "blockNode" : null,
        "id" : "19-48-16",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 16,
        "rowNum" : 48,
        "blockNode" : null,
        "id" : "19-16-48",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      },
      {
        "rolNum" : 20,
        "rowNum" : 56,
        "blockNode" : null,
        "id" : "19-20-56",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 19
      }
    ],
    "11" : [
      {
        "rolNum" : 24,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "11-24-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 11
      },
      {
        "rolNum" : 32,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "11-32-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 11
      },
      {
        "rolNum" : 36,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "11-36-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 11
      },
      {
        "rolNum" : 20,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "11-20-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 11
      },
      {
        "rolNum" : 4,
        "rowNum" : 38,
        "blockNode" : null,
        "id" : "11-4-38",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 11
      },
      {
        "rolNum" : 52,
        "rowNum" : 38,
        "blockNode" : null,
        "id" : "11-52-38",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 11
      }
    ],
    "12" : [
      {
        "rolNum" : 20,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "12-20-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 12
      },
      {
        "rolNum" : 36,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "12-36-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 12
      },
      {
        "rolNum" : 32,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "12-32-20",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 12
      },
      {
        "rolNum" : 40,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "12-40-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 12
      },
      {
        "rolNum" : 16,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "12-16-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 12
      },
      {
        "rolNum" : 24,
        "rowNum" : 44,
        "blockNode" : null,
        "id" : "12-24-44",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 12
      },
      {
        "rolNum" : 24,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "12-24-32",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 12
      },
      {
        "rolNum" : 32,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "12-32-32",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 12
      },
      {
        "rolNum" : 4,
        "rowNum" : 39,
        "blockNode" : null,
        "id" : "12-4-39",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 12
      },
      {
        "rolNum" : 52,
        "rowNum" : 39,
        "blockNode" : null,
        "id" : "12-52-39",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 12
      }
    ],
    "1" : [
      {
        "rolNum" : 28,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "1-28-32",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 1
      },
      {
        "rolNum" : 4,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "1-4-28",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 1
      },
      {
        "rolNum" : 52,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "1-52-28",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 1
      },
      {
        "rolNum" : 4,
        "rowNum" : 56,
        "blockNode" : null,
        "id" : "1-4-56",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 1
      },
      {
        "rolNum" : 12,
        "rowNum" : 56,
        "blockNode" : null,
        "id" : "1-12-56",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 1
      },
      {
        "rolNum" : 44,
        "rowNum" : 56,
        "blockNode" : null,
        "id" : "1-44-56",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 1
      },
      {
        "rolNum" : 52,
        "rowNum" : 56,
        "blockNode" : null,
        "id" : "1-52-56",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 1
      }
    ],
    "20" : [
      {
        "rolNum" : 12,
        "rowNum" : 8,
        "blockNode" : null,
        "id" : "20-12-8",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 20,
        "rowNum" : 8,
        "blockNode" : null,
        "id" : "20-20-8",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 28,
        "rowNum" : 8,
        "blockNode" : null,
        "id" : "20-28-8",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 36,
        "rowNum" : 8,
        "blockNode" : null,
        "id" : "20-36-8",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 8,
        "rowNum" : 16,
        "blockNode" : null,
        "id" : "20-8-16",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 16,
        "rowNum" : 16,
        "blockNode" : null,
        "id" : "20-16-16",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 24,
        "rowNum" : 16,
        "blockNode" : null,
        "id" : "20-24-16",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 32,
        "rowNum" : 16,
        "blockNode" : null,
        "id" : "20-32-16",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 12,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "20-12-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 20,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "20-20-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 28,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "20-28-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 36,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "20-36-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 44,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "20-44-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 12,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "20-12-32",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 20,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "20-20-32",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 28,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "20-28-32",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 36,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "20-36-32",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 44,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "20-44-32",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 12,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "20-12-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 20,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "20-20-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 28,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "20-28-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 36,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "20-36-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 44,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "20-44-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 24,
        "rowNum" : 48,
        "blockNode" : null,
        "id" : "20-24-48",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 32,
        "rowNum" : 48,
        "blockNode" : null,
        "id" : "20-32-48",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 40,
        "rowNum" : 48,
        "blockNode" : null,
        "id" : "20-40-48",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 48,
        "rowNum" : 4,
        "blockNode" : null,
        "id" : "20-48-4",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 44,
        "rowNum" : 12,
        "blockNode" : null,
        "id" : "20-44-12",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 28,
        "rowNum" : 56,
        "blockNode" : null,
        "id" : "20-28-56",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 36,
        "rowNum" : 56,
        "blockNode" : null,
        "id" : "20-36-56",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      },
      {
        "rolNum" : 16,
        "rowNum" : 52,
        "blockNode" : null,
        "id" : "20-16-52",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 20
      }
    ],
    "2" : [
      {
        "rolNum" : 24,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "2-24-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 2
      },
      {
        "rolNum" : 32,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "2-32-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 2
      },
      {
        "rolNum" : 4,
        "rowNum" : 29,
        "blockNode" : null,
        "id" : "2-4-29",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 2
      },
      {
        "rolNum" : 52,
        "rowNum" : 29,
        "blockNode" : null,
        "id" : "2-52-29",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 2
      },
      {
        "rolNum" : 8,
        "rowNum" : 52,
        "blockNode" : null,
        "id" : "2-8-52",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 2
      },
      {
        "rolNum" : 48,
        "rowNum" : 52,
        "blockNode" : null,
        "id" : "2-48-52",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 2
      }
    ],
    "13" : [
      {
        "rolNum" : 24,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "13-24-20",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 13
      },
      {
        "rolNum" : 16,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "13-16-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 13
      },
      {
        "rolNum" : 32,
        "rowNum" : 44,
        "blockNode" : null,
        "id" : "13-32-44",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 13
      },
      {
        "rolNum" : 40,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "13-40-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 13
      },
      {
        "rolNum" : 36,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "13-36-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 13
      },
      {
        "rolNum" : 20,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "13-20-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 13
      },
      {
        "rolNum" : 4,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "13-4-40",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 13
      },
      {
        "rolNum" : 52,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "13-52-40",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 13
      }
    ],
    "3" : [
      {
        "rolNum" : 28,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "3-28-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 3
      },
      {
        "rolNum" : 28,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "3-28-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 3
      },
      {
        "rolNum" : 4,
        "rowNum" : 30,
        "blockNode" : null,
        "id" : "3-4-30",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 3
      },
      {
        "rolNum" : 52,
        "rowNum" : 30,
        "blockNode" : null,
        "id" : "3-52-30",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 3
      }
    ],
    "21" : [
      {
        "rolNum" : 8,
        "rowNum" : 4,
        "blockNode" : null,
        "id" : "21-8-4",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 16,
        "rowNum" : 4,
        "blockNode" : null,
        "id" : "21-16-4",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 24,
        "rowNum" : 4,
        "blockNode" : null,
        "id" : "21-24-4",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 32,
        "rowNum" : 4,
        "blockNode" : null,
        "id" : "21-32-4",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 40,
        "rowNum" : 4,
        "blockNode" : null,
        "id" : "21-40-4",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 52,
        "rowNum" : 0,
        "blockNode" : null,
        "id" : "21-52-0",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 12,
        "rowNum" : 12,
        "blockNode" : null,
        "id" : "21-12-12",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 20,
        "rowNum" : 12,
        "blockNode" : null,
        "id" : "21-20-12",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 28,
        "rowNum" : 12,
        "blockNode" : null,
        "id" : "21-28-12",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 36,
        "rowNum" : 12,
        "blockNode" : null,
        "id" : "21-36-12",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 16,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "21-16-20",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 24,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "21-24-20",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 32,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "21-32-20",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 40,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "21-40-20",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 20,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "21-20-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 28,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "21-28-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 36,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "21-36-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 12,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "21-12-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 44,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "21-44-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 12,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "21-12-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 12,
        "rowNum" : 44,
        "blockNode" : null,
        "id" : "21-12-44",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 20,
        "rowNum" : 44,
        "blockNode" : null,
        "id" : "21-20-44",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 28,
        "rowNum" : 44,
        "blockNode" : null,
        "id" : "21-28-44",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 36,
        "rowNum" : 44,
        "blockNode" : null,
        "id" : "21-36-44",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 44,
        "rowNum" : 44,
        "blockNode" : null,
        "id" : "21-44-44",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 44,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "21-44-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      },
      {
        "rolNum" : 40,
        "rowNum" : 52,
        "blockNode" : null,
        "id" : "21-40-52",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 21
      }
    ],
    "14" : [
      {
        "rolNum" : 20,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "14-20-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 14
      },
      {
        "rolNum" : 36,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "14-36-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 14
      },
      {
        "rolNum" : 32,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "14-32-20",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 14
      },
      {
        "rolNum" : 16,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "14-16-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 14
      },
      {
        "rolNum" : 40,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "14-40-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 14
      },
      {
        "rolNum" : 24,
        "rowNum" : 44,
        "blockNode" : null,
        "id" : "14-24-44",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 14
      }
    ],
    "4" : [
      {
        "rolNum" : 32,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "4-32-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 4
      },
      {
        "rolNum" : 24,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "4-24-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 4
      },
      {
        "rolNum" : 24,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "4-24-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 4
      },
      {
        "rolNum" : 32,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "4-32-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 4
      },
      {
        "rolNum" : 4,
        "rowNum" : 31,
        "blockNode" : null,
        "id" : "4-4-31",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 4
      },
      {
        "rolNum" : 52,
        "rowNum" : 31,
        "blockNode" : null,
        "id" : "4-52-31",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 4
      }
    ],
    "5" : [
      {
        "rolNum" : 24,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "5-24-32",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 5
      },
      {
        "rolNum" : 32,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "5-32-32",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 5
      },
      {
        "rolNum" : 20,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "5-20-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 5
      },
      {
        "rolNum" : 36,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "5-36-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 5
      },
      {
        "rolNum" : 4,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "5-4-32",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 5
      },
      {
        "rolNum" : 52,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "5-52-32",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 5
      }
    ],
    "15" : [
      {
        "rolNum" : 24,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "15-24-20",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 15
      },
      {
        "rolNum" : 16,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "15-16-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 15
      },
      {
        "rolNum" : 40,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "15-40-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 15
      },
      {
        "rolNum" : 32,
        "rowNum" : 44,
        "blockNode" : null,
        "id" : "15-32-44",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 15
      },
      {
        "rolNum" : 36,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "15-36-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 15
      },
      {
        "rolNum" : 20,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "15-20-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 15
      }
    ],
    "22" : [
      {
        "rolNum" : 4,
        "rowNum" : 0,
        "blockNode" : null,
        "id" : "22-4-0",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 22
      },
      {
        "rolNum" : 12,
        "rowNum" : 0,
        "blockNode" : null,
        "id" : "22-12-0",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 22
      },
      {
        "rolNum" : 20,
        "rowNum" : 0,
        "blockNode" : null,
        "id" : "22-20-0",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 22
      },
      {
        "rolNum" : 28,
        "rowNum" : 0,
        "blockNode" : null,
        "id" : "22-28-0",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 22
      },
      {
        "rolNum" : 36,
        "rowNum" : 0,
        "blockNode" : null,
        "id" : "22-36-0",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 22
      },
      {
        "rolNum" : 44,
        "rowNum" : 0,
        "blockNode" : null,
        "id" : "22-44-0",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 22
      },
      {
        "rolNum" : 12,
        "rowNum" : 48,
        "blockNode" : null,
        "id" : "22-12-48",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 22
      },
      {
        "rolNum" : 44,
        "rowNum" : 48,
        "blockNode" : null,
        "id" : "22-44-48",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 22
      }
    ],
    "6" : [
      {
        "rolNum" : 24,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "6-24-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 6
      },
      {
        "rolNum" : 32,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "6-32-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 6
      },
      {
        "rolNum" : 20,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "6-20-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 6
      },
      {
        "rolNum" : 36,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "6-36-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 6
      },
      {
        "rolNum" : 4,
        "rowNum" : 33,
        "blockNode" : null,
        "id" : "6-4-33",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 6
      },
      {
        "rolNum" : 52,
        "rowNum" : 33,
        "blockNode" : null,
        "id" : "6-52-33",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 6
      }
    ],
    "23" : [
      {
        "rolNum" : 8,
        "rowNum" : 4,
        "blockNode" : null,
        "id" : "23-8-4",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 23
      },
      {
        "rolNum" : 48,
        "rowNum" : 4,
        "blockNode" : null,
        "id" : "23-48-4",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 23
      },
      {
        "rolNum" : 28,
        "rowNum" : 4,
        "blockNode" : null,
        "id" : "23-28-4",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 23
      }
    ],
    "7" : [
      {
        "rolNum" : 20,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "7-20-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 7
      },
      {
        "rolNum" : 36,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "7-36-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 7
      },
      {
        "rolNum" : 20,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "7-20-32",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 7
      },
      {
        "rolNum" : 36,
        "rowNum" : 32,
        "blockNode" : null,
        "id" : "7-36-32",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 7
      },
      {
        "rolNum" : 4,
        "rowNum" : 34,
        "blockNode" : null,
        "id" : "7-4-34",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 7
      },
      {
        "rolNum" : 52,
        "rowNum" : 34,
        "blockNode" : null,
        "id" : "7-52-34",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 7
      }
    ],
    "16" : [
      {
        "rolNum" : 20,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "16-20-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 16
      },
      {
        "rolNum" : 36,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "16-36-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 16
      },
      {
        "rolNum" : 32,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "16-32-20",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 16
      },
      {
        "rolNum" : 16,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "16-16-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 16
      },
      {
        "rolNum" : 40,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "16-40-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 16
      },
      {
        "rolNum" : 24,
        "rowNum" : 44,
        "blockNode" : null,
        "id" : "16-24-44",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 16
      }
    ],
    "8" : [
      {
        "rolNum" : 24,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "8-24-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 8
      },
      {
        "rolNum" : 32,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "8-32-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 8
      },
      {
        "rolNum" : 4,
        "rowNum" : 35,
        "blockNode" : null,
        "id" : "8-4-35",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 8
      },
      {
        "rolNum" : 52,
        "rowNum" : 35,
        "blockNode" : null,
        "id" : "8-52-35",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 8
      }
    ],
    "17" : [
      {
        "rolNum" : 24,
        "rowNum" : 20,
        "blockNode" : null,
        "id" : "17-24-20",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 17
      },
      {
        "rolNum" : 16,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "17-16-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 17
      },
      {
        "rolNum" : 40,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "17-40-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 17
      },
      {
        "rolNum" : 32,
        "rowNum" : 44,
        "blockNode" : null,
        "id" : "17-32-44",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 17
      },
      {
        "rolNum" : 36,
        "rowNum" : 16,
        "blockNode" : null,
        "id" : "17-36-16",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 17
      },
      {
        "rolNum" : 32,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "17-32-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 17
      },
      {
        "rolNum" : 40,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "17-40-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 17
      },
      {
        "rolNum" : 16,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "17-16-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 17
      },
      {
        "rolNum" : 24,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "17-24-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 17
      },
      {
        "rolNum" : 24,
        "rowNum" : 48,
        "blockNode" : null,
        "id" : "17-24-48",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 17
      }
    ],
    "9" : [
      {
        "rolNum" : 28,
        "rowNum" : 40,
        "blockNode" : null,
        "id" : "9-28-40",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 9
      },
      {
        "rolNum" : 28,
        "rowNum" : 24,
        "blockNode" : null,
        "id" : "9-28-24",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 9
      },
      {
        "rolNum" : 20,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "9-20-36",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 9
      },
      {
        "rolNum" : 36,
        "rowNum" : 28,
        "blockNode" : null,
        "id" : "9-36-28",
        "moldType" : 1,
        "type" : 0,
        "layerNum" : 9
      },
      {
        "rolNum" : 4,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "9-4-36",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 9
      },
      {
        "rolNum" : 52,
        "rowNum" : 36,
        "blockNode" : null,
        "id" : "9-52-36",
        "moldType" : 2,
        "type" : 0,
        "layerNum" : 9
      }
    ]
  },
  "blockTypeData" : {
    "10" : 5,
    "2" : 5,
    "3" : 5,
    "11" : 5,
    "4" : 5,
    "16" : 5,
    "5" : 5,
    "12" : 4,
    "6" : 5,
    "13" : 4,
    "7" : 5,
    "8" : 5,
    "14" : 5,
    "1" : 5,
    "9" : 5
  },
  "widthNum" : 8,
  "heightNum" : 10,
  "levelKey" : 90026
}
```

</details>

#### 11.4 脚本示例：
```javascript
const url = `https://cat-match-static.easygame2021.com/maps/d9d5f97bbf1c587b34da2120da77c22e.txt`;
const method = `GET`;
const headers = {
    'Referer': `https://servicewechat.com/wx141bfb9b73c970a9/29/page-frame.html`,
    'Connection': `keep-alive`,
    'Accept-Encoding': `gzip,compress,br,deflate`,
    'Host': `cat-match-static.easygame2021.com`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d25) NetType/4G Language/zh_CN`
};
const body = ``;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
```

</details>



### 12、俺的名片接口
<details>
<summary>点击展开</summary>

#### 12.1 请求URL：https://cat-match.easygame2021.com/sheep/v1/game/personal_info
#### 12.2 请求体：
```json
    无请求体
```
#### 12.3 响应体：
```json
{
  "err_code" : 0,
  "err_msg" : "",
  "data" : {
    "today_state" : 0,
    "today_ts" : 0,
    "uid" : "你的uid",
    "nick_name" : "你的昵称",
    "register_time" : 1663815303,
    "avatar" : "https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/132",
    "skin" : 0,
    "today_time" : 0,
    "daily_count" : 0,
    "challenge" : 0,
    "win_count" : 0,
    "topic_count" : 0,
    "today_fail_count" : 0
  }
}
```
#### 12.4 脚本示例：
```javascript
const url = `https://cat-match.easygame2021.com/sheep/v1/game/personal_info?`;
const method = `GET`;
const headers = {
    'Accept-Encoding': `gzip,compress,br,deflate`,
    'content-type': `application/json`,
    'Connection': `keep-alive`,
    'Referer': `https://servicewechat.com/wx141bfb9b73c970a9/29/page-frame.html`,
    't': `你的t值`,
    'Host': `cat-match.easygame2021.com`,
    'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.29(0x18001d26) NetType/WIFI Language/zh_CN`
};
const body = ``;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    console.log(response.statusCode + "\n\n" + response.body);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});

```

</details>



****
**---- end ----**
#### [回到顶部](#readme)


