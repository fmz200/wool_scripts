/**
 * 名称：jianshu.js
 * 作者：elecV2
 *
 ******** Quantumult X conf ********
// 规则仅对手机网页版有效，如使用APP 请勿添加

// rewrite 远程地址：https://raw.githubusercontent.com/elecV2/QuantumultX-Tools/master/betterweb/jianshu.conf

---------- jianshu.conf ------------------
hostname = www.jianshu.com

// 先重写到桌面版
^https:\/\/www\.jianshu\.com\/p url request-header (\r\n)User-Agent:.+(\r\n) request-header $1User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36$2
// 再注入 CSS 进行优化
^https:\/\/www\.jianshu\.com\/p url script-response-body https://raw.githubusercontent.com/elecV2/QuantumultX-Tools/master/betterweb/jianshu.js
-------------

 ********
 * 频道: https://t.me/elecV2
**/

let body = $response.body

if (/<\/html>|<\/body>/.test(body)) {
  body = body.replace('</head>', `<style type="text/css">
*{max-width:100%!important;box-sizing:border-box!important;}.side-tool, #note-fixed-ad-container, #free-reward-panel, .show-foot, .meta-bottom, aside, nav, ._13lIbp, ._3Pnjry, ._7hb9O4, ._1kCBjS, ._3tCVn5, .-pXE92, .note-graceful-button, .call-app-btn, .recommend-ad, ._2xr8G8{display:none!important}._3VRLsv, .ouvJEz{padding: 12px}._gp-ck, .W2TSX_{margin: 0!important;}
</style></head>`)

  console.log('添加 tamperJS：jianshu.js')
}

$done({ body })
