// ==UserScript==
// @Name              网球规则[翻译]成Surge、QuantumultX、Loon脚本
// @Author            Cuttlefish
// @Tg group          https://t.me/ddgksf2013
// @WechatID          公众号墨鱼手记
// @UpdateTime        2022-05-03
// @ScriptURL         https://ocd0522.tk/ddgksf2013/Cuttlefish/raw/branch/master/Crack/sample.js
// ==/UserScript==

// ==KeyExplain==
// @Function          text.replace(regexp/substr,replacement)
// @key1              待替换的关键字段1
// @key2              待替换的关键字段2
// @originalValue     字段key对应的原始value
// @replaceValue      字段key替换之后的value
// @/g                正则匹配时匹配多个key键值
// ==/KeyExplain==


var body = $response.body.replace(/"key1":originalValue/g, '"key1":replaceValue').replace(/"key2":originalValue/g, '"key2":replaceValue')
$done({ body });
