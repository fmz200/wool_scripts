/*
kwbook vip
/a.p?kweexVersion=1.1.5
/a.p
*/

var body = $response.body;
const path1 = "kuwo.cn/a.p?";

if ($request.url.indexOf(path1) != -1){
	body = body.replace(/"type":\d*/g,'"type":2').replace(/"end":\d*/g, '"end":4811209694000').replace(/"period":\d*/g, '"period":111').replace(/"bought_vip":\d*/g, '"bought_vip":1').replace(/"bought_vip_end":\d*/g, '"bought_vip_end":4811209694000');
}else {
	body = body.replace(/"limitfree":\d*/g, '"limitfree":1').replace(/"playable":\d*/g, '"playable":1').replace(/"downable":\d*/g, '"downable":1').replace(/"playright":\d*/g, '"playright":1').replace(/"downright":\d*/g, '"downright":1').replace(/"policytype":\d*/g, '"policytype":1').replace(/"policy":\d*/g, '"policy":1');
}
$done({ body });