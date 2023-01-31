let url = $request.url
let method = $request.method
let body = null
let obj = null

switch (true) {
    case url.includes("api.u51.com/generic-config-gateway/api"):
        obj = JSON.parse($response.body)
        if (obj.meTabConfigExts) {
            let reserve = ['设置', '我的账单']
            obj.meTabConfigExts = obj.meTabConfigExts.filter(item => reserve.includes(item.meTabConfigs[0].title))
            obj.operationResourceDTO = undefined
            body = JSON.stringify(obj)
        }
        break
    default:
        console.log("匹配到其他url：\n" + url)
        break
}

if (body) {
    $done({body})
} else {
    $done({})
}