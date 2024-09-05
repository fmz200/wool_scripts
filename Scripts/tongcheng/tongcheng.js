let body = JSON.parse($response.body);

// 删除轮播图
if (body.hasOwnProperty('data')) {
    delete body.data.banner;
}

// 定义需要过滤的导航项
const iconsToExclude = ["汽车票优惠", "特惠酒店", "顺风车", "特惠机票"];

// 优化下方导航栏的过滤操作
if (Array.isArray(body.data.icon)) {
    body.data.icon = body.data.icon.filter(item => !iconsToExclude.includes(item.name));
}

let newBody = JSON.stringify(body);
$done({ body: newBody });