
/* 公众号墨鱼手记 crated by ddgksf2013 on 2022-10-30 */
var body = $response.body
    .replace(/<head>/, '<head><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ddgksf2013/Html/netflix.css" type="text/css">');
$done({ body });