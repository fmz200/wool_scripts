let obj = JSON.parse($response.body);

// 过滤掉 layout 为 advert_self 的 data 条目
obj.data = obj.data.filter(item => item.layout !== "advert_self");

// 对每个 data 条目中的 list 进行二次过滤 (移除 type=3 的元素)
obj.data.forEach(item => {
  item.list = item.list.filter(ad => ad.type !== 3);
});

$done({body: JSON.stringify(obj)});