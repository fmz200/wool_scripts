let mapSeed2 = "";
let GLOBALFrequencyLength = 0
$(document).ready(function () {
    const fn = (t) => {
        t = t + 1
        return new Promise((resolve, reject) => {
            layer.msg('正在循环提交第' + t + '次', {
                'icon': 16
            });
            var token = $('#token').val();
            let url = "https://cat-match.easygame2021.com/sheep/v1/game/topic_game_over?rank_score=1&rank_state=1&rank_time=359&rank_role=1&skin=1"
            $.ajax({
                'cache': true,
                'type': 'get',
                'url': url,
                'data': {
                    't': token,
                },
                'dataType': 'json',
                'success': function (result) {
                    layer.closeAll()
                    $('#content').html('已经为您刷通关' + t + '次');
                    resolve(result)
                },
                'error': function (err) {
                    layer.closeAll()
                    $('#content').html('通关失败');
                    resolve(result)
                }
            });
        })
    };

    const fn2 = (levelNums) => {
        return new Promise((resolve, reject) => {
            layer.msg('正在提交首次加入羊群', {
                'icon': 16
            });
            var token = $('#token').val();
            let MatchPlayInfo = getMatchPlayInfo(levelNums)

            if (!MatchPlayInfo) {
                return
            }
            debugger;
            $.ajax({
                'cache': true,
                'type': 'post',
                'url': "https://cat-match.easygame2021.com/sheep/v1/game/game_over_ex?t=" + token,
                'dataType': 'json',
                'data': {
                    "rank_score": 1,
                    "rank_state": 1,
                    "rank_time": 3590, // 通关时间
                    "rank_role": 2,
                    "skin": 1,
                    "MatchPlayInfo": MatchPlayInfo,
                    "MapSeed2": mapSeed2,
                    "Version": "0.0.1"
                },
                'success': function (result) {
                    layer.closeAll()
                    if (result.err_code !== 0) {
                        if (result.err_msg === "没有权限") {
                            layer.msg('加入羊群失败：token错误，' + result.err_msg, {
                                'icon': 16
                            });
                        } else {
                            layer.msg('加入羊群失败：' + result.err_msg, {
                                'icon': 16
                            });
                        }
                    }
                    resolve(result)
                },
                'error': function (err) {
                    layer.closeAll()
                    layer.msg('加入羊群失败', {
                        'icon': 16
                    });
                    $('#content').html('加入羊群失败');
                    resolve(err)
                }
            });
        })
    };

    const fn3 = () => {
        return new Promise((resolve, reject) => {
            var token = $('#token').val();
            $.ajax({
                'cache': true,
                'type': 'get',
                'url': "https://cat-match.easygame2021.com/sheep/v1/game/map_info_ex?matchType=3&t=" + token,
                'success': function (result) {
                    if (result.err_code !== 0) {
                        if (result.err_msg === "没有权限") {
                            layer.msg('获取地图失败：token错误，' + result.err_msg, {
                                'icon': 16
                            });
                        } else {
                            layer.msg('获取地图失败：' + result.err_msg, {
                                'icon': 16
                            });
                        }
                        resolve(0)
                    } else {
                        debugger;
                        let map_md5 = result.data.map_md5[1];
                        mapSeed2 = result.data.map_seed_2;
                        console.log("map_seed_2=" + mapSeed2 + ", map_md5[1]=" + map_md5);
                        $.ajax({
                            'type': 'get',
                            'url': "https://cat-match-static.easygame2021.com/maps/" + map_md5 + ".txt",
                            'success': function (result) {
                                let levelData = JSON.parse(result).levelData
                                let levelNums = 0
                                console.log(Object.keys(levelData));
                                for (let i = 0; i < Object.keys(levelData).length; i++) {
                                    let levelMap = levelData[i + 1];
                                    levelMap.forEach(item => {
                                        levelNums++
                                    })
                                }
                                resolve(levelNums)
                            },
                            'error': function (err) {
                                layer.closeAll()
                                layer.msg('获取地图失败', {
                                    'icon': 16
                                });
                                $('#content').html('获取地图失败');
                                resolve(0)
                            }
                        });
                    }
                },
                'error': function (err) {
                    layer.closeAll()
                    layer.msg('获取地图失败', {
                        'icon': 16
                    });
                    $('#content').html('获取地图失败');
                    resolve(0)
                }
            });
        })
    }

    /**
     * arrs 请求数据源数组
     * limit 是每次并行发起多少个请求
     * handleFn 就是异步处理函数
     */
    function limitQueueFn(number, limit, handleFn) {
        console.log(number);
        if (number < limit) {
            limit = number
        }
        // 完成任务数
        let index = 0;
        // 第一次的时候 一次性执行 limit 个任务
        for (let i = 0; i < limit; i++) {

            run();
        }

        // 执行一个任务
        function run() {
            // 构造待执行任务 当该任务完成后 如果还有待完成的任务 继续执行任务
            new Promise((resolve, reject) => {
                index++; // 这个是同步操作
                // resolve 返回 promise
                resolve(handleFn(index))
            }).then(() => {
                if (index < number) {
                    run()
                }
            })
        }
    };

    $('#get_code').click(async function () {
        var token = $('#token').val();
        var frequencyLength = $('#frequency').val();
        var frequencyLimit = 1
        if (token == '') {
            layer.msg('请输入你的 token', {
                'icon': 5
            });
            return;
        } else if (!Number(frequencyLength)) {
            layer.msg('请输入你的通关次数', {
                'icon': 5
            });
            return;
        }
        let type = $("input:radio:checked").val()
        if (type == 1) {
            GLOBALFrequencyLength = 0
            gameOver()
        } else {
            limitQueueFn(Number(frequencyLength), Number(frequencyLimit) || 1, fn)
        }
    });

    async function gameOver() {
        layer.msg('开始获取地图数据');
        let userInfo = await getPersonInfo()
        if (userInfo.err_code != 0) {
            layer.msg(userInfo.err_msg, {
                'icon': 5
            });
            return
        }
        let {win_count} = userInfo.data
        $('#content').html('当前次数：' + win_count);
        let levelNums = await fn3() // 先获取今天多少张卡片
        if (levelNums === 0) return
        layer.msg('等待60秒');

        let time = 11;//倒计的时间
        //创建定时器
        let timer = setInterval(async function () {
            if (time == 0) {
                //清除定时器效果
                clearInterval(timer);
                layer.closeAll()
                layer.msg('开始本次通关');
                let res = await fn2(levelNums) // 先通关一次
                debugger;
                if (res.err_code === 0) {
                    let userInfo = await getPersonInfo()
                    let New_win_count = userInfo.data.win_count
                    if (New_win_count !== win_count) {
                        $('#content').html('当前次数：' + New_win_count);
                        GLOBALFrequencyLength++
                        if (GLOBALFrequencyLength == $('#frequency').val()) {
                            layer.msg('通关结束');
                            return
                        } else {
                            layer.msg('本次通关成功，开始下次通关');
                            gameOver()
                        }
                    } else {
                        layer.msg('本次通关失败，结束');
                    }
                }
            } else {
                layer.msg('等待60秒，' + "还剩" + time + "秒");
                time--;
            }
        }, 1000);//每隔1s调用一次
    }

    function generateRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getPersonInfo() {
        return new Promise((resolve, reject) => {
            var token = $('#token').val();
            $.ajax({
                'cache': true,
                'type': 'get',
                'url': "https://cat-match.easygame2021.com/sheep/v1/game/personal_info?t=" + token,
                'success': function (result) {
                    resolve(result)
                },
                'error': function (err) {
                    layer.closeAll()
                    layer.msg('获取个人信息失败');
                    $('#content').html('获取个人信息失败');
                    reject(err)
                }
            });
        })
    }

    function getMatchPlayInfo(levelNums) {
        var i = protobuf.Reader,
            a = protobuf.Writer,
            r = protobuf.util;
        MatchStepInfo = function () {
            function t(t) {
                if (t)
                    for (var e = Object.keys(t), o = 0; o < e.length; ++o) null != t[e[o]] &&
                    (this[e[o]] = t[e[o]])
            }

            return t.prototype.chessIndex = 0, t.prototype.timeTag = 0, t.create = function (e) {
                return new t(e)
            }, t.encode = function (t, e) {
                return e || (e = a.create()), null != t.chessIndex && Object.hasOwnProperty
                    .call(t, "chessIndex") && e.uint32(8).int32(t.chessIndex), null !=
                t.timeTag && Object.hasOwnProperty.call(t, "timeTag") && e.uint32(
                    16).int32(t.timeTag), e
            }, t.decode = function (t, e) {
                t instanceof i || (t = i.create(t));
                for (var o = void 0 === e ? t.len : t.pos + e, n = new MatchStepInfo; t
                    .pos < o;) {
                    var a = t.uint32();
                    switch (a >>> 3) {
                        case 1:
                            n.chessIndex = t.int32();
                            break;
                        case 2:
                            n.timeTag = t.int32();
                            break;
                        default:
                            t.skipType(7 & a)
                    }
                }
                return n
            }, t
        }(), MatchPlayInfo = function () {
            function t(t) {
                if (this.stepInfoList = [], t)
                    for (var e = Object.keys(t), o = 0; o < e.length; ++o) null != t[e[o]] &&
                    (this[e[o]] = t[e[o]])
            }

            return t.prototype.gameType = 0, t.prototype.mapId = 0, t.prototype.mapSeed = 0,
                t.prototype.stepInfoList = r.emptyArray, t.create = function (e) {
                return new t(e)
            }, t.encode = function (t, e) {
                if (e || (e = a.create()), null != t.gameType && Object.hasOwnProperty.call(
                    t, "gameType") && e.uint32(8).int32(t.gameType), null != t.mapId &&
                Object.hasOwnProperty.call(t, "mapId") && e.uint32(16).int32(t.mapId),
                null != t.mapSeed && Object.hasOwnProperty.call(t, "mapSeed") && e.uint32(
                    24).int32(t.mapSeed), null != t.stepInfoList && t.stepInfoList.length
                )
                    for (var o = 0; o < t.stepInfoList.length; ++o) MatchStepInfo
                        .encode(t.stepInfoList[o], e.uint32(34).fork()).ldelim();
                return e
            }, t.decode = function (t, e) {
                t instanceof i || (t = i.create(t));
                for (var o = void 0 === e ? t.len : t.pos + e, n = new MatchPlayInfo; t
                    .pos < o;) {
                    var a = t.uint32();
                    switch (a >>> 3) {
                        case 1:
                            n.gameType = t.int32();
                            break;
                        case 2:
                            n.mapId = t.int32();
                            break;
                        case 3:
                            n.mapSeed = t.int32();
                            break;
                        case 4:
                            n.stepInfoList && n.stepInfoList.length || (n.stepInfoList = []),
                                n.stepInfoList.push(MatchStepInfo.decode(t,
                                    t.uint32()));
                            break;
                        default:
                            t.skipType(7 & a)
                    }
                }
                return n
            }, t
        }()
        var operationList = []

        function addOp(t, e) { //增加操作
            void 0 === e && (e = -100);
            // console.log(t);
            if (t === 0) {
                var o = {
                    id: t, // 操作卡片的id，从levelData第一层开始按顺序编号
                    time: Date.now() // 操作时间
                };
            } else {
                var o = {
                    id: t, // 操作卡片的id，从levelData第一层开始按顺序编号
                    time: operationList[t - 1].time + generateRandomInteger(500, 2000) // 操作时间
                };
            }
            operationList.push(o)
        }

        function sleep(delay) {
            for (var t = Date.now(); Date.now() - t <= delay;) ;
        }

        let range = n => [...Array(n).keys()]
        for (let i of range(levelNums)) { // 生成了50次操作
            addOp(i);
            // sleep(Math.random() * 10); // 模拟操作过程中的等待
        }
        console.log(operationList)
        for (var u = operationList, p = [], d = 0, h = 0; h < u.length; h++) // 把时间戳转换为两次操作的间隔
            p.push({
                chessIndex: u[h].id,
                timeTag: 0 == d ? 0 : u[h].time - d
            }), d = u[h].time;
        console.log(p)
        GAMEDAILY = 3
        GAMETOPIC = 4
        for (var f = {
            gameType: GAMEDAILY,
            stepInfoList: p
        }, y = MatchPlayInfo.create(f), v = MatchPlayInfo.encode(y).finish(), b = "", _ = 0; _ < v.length; _++)
            b += String.fromCharCode(v[_]); // 序列化

        // console.log(data);
        return btoa(b)
    }
});