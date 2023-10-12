/**
 * author:fmz200
 * date:2023-10-09 22:55:00
 * function:不分APP收集用户信息，将上传的内容换成空值
 */

let body = {content: "oops, nothing here."};
$done({body:JSON.stringify(body)});
