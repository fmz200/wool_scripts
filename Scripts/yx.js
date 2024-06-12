/**
 * 悠洗APP
 */

let obj = JSON.parse($response.body);
obj.data.topFunctionalArea.splice(5);
$done({body: JSON.stringify(obj)});
