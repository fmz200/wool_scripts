/*

Author：@ddgksf2013

通知频道：https://t.me/ddgksf2021

app:  Cutisan V4.0.2

https://cutisanapi.imuuzi.com/api/Home/index

hostname=cutisanapi.imuuzi.com

update time:20220130

*/
 


var body = $response.body.replace(/download_url":""/g, 'download_url":"http:\/\/custisancdn.imuuzi.com\/b8395cc46cebc04b241caf07118ba5dd.jpg?imageMogr2\/thumbnail\/720x1560&e=1643508104&token=ErePNk7X80f9Btp_AA-88-wB3YxEZPEBlJtJpR49:qk8awUGfBDqEQK7WGQgThLihN80="')
$done({ body });