/***********************************

> 應用名稱：B站启动时开启直连模式
> 軟件版本：0.0.0
> 下載地址：
> 腳本作者：Cuttlefish
> 微信賬號：墨魚手記
> 更新時間：2022-08-11
> 通知頻道：https://t.me/ddgksf2021
> 問題反饋：https://t.me/ddgksf2013_bot
> 特别說明：本腳本僅供學習交流使用，禁止轉載售賣
 
[rewrite_local]

# ～ B站启动时开启直连模式（2022-085-11）@ddgksf2013
^https?:\/\/app\.bilibili\.com\/x\/resource\/domain url script-response-body https://github.com/ddgksf2013/Scripts/raw/main/bilibili_startup_direct.js

[mitm] 

hostname=api.bilibili.com

***********************************/

//因为常常观看港澳台番剧后，B站连着外网，而我下次启动时，需要让其直连模式（主界面不同），有此需求，故写了一个简单脚本


//⚠️已自动获取野比配置的策略组，无需手动更改，DomesticMedia自行替换为自己的B站策略组名称



const Group = $prefs.valueForKey('BiliArea_Policy') || '港台番剧';

const message = {
    action: "set_policy_state",
    content: {[Group]: "direct"}
};
$configuration.sendMessage(message).then(resolve => {
    if (resolve.error) {
        console.log(resolve.error);
    }
    if (resolve.ret) {
        let output=JSON.stringify(resolve.ret);
        //console.log(output);
    }
    $done();
}, reject => {
    // Normally will never happen.
    $done();
});
