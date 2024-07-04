/**
 * @author fmz200
 * @date 2023-11-30 21:50:13
 * @function 转转APP净化+去广告
 */

let url = $request.url;
let responseBody = $response.body;

try {
    responseBody = JSON.parse(responseBody);
    // 删除“测一测，你的手机能卖多少钱”
    delete responseBody.respData.bmNewInfo;

    responseBody.respData.itemGroupList = responseBody.respData.itemGroupList.map(itemGroup => {
        // 去掉“我的钱包”
        if (itemGroup.groupType === 15) {
            return null; // 将groupType为15的元素置为null
        } else if (itemGroup.groupType === 3) { // 推荐工具只保留4个
            itemGroup.itemList = itemGroup.itemList.slice(0, 4);
        }
        return itemGroup;
    }).filter(Boolean); // 过滤掉为null的元素
    console.log('转转APP处理完成✅');
} catch (error) {
    console.log('脚本运行出现错误，部分内容未生效⚠️');
    console.log('错误信息：' + error.message);
}

$done({body: JSON.stringify(responseBody)});

