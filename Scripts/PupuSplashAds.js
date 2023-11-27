/**
 * @author fmz200
 * @function 朴朴超市
 * @date 2023-11-27 22:50:13
 */
let obj = JSON.parse($response.body);
obj.data = obj.data.filter(item => item.position_type !== 50);
$done({body: JSON.stringify(obj)});
