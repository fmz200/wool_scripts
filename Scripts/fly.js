var body = $response.body;
var new_body = JSON.parse(body);

if (new_body.Variables.data.threaddetail) {
  new_body.Variables.data.threaddetail.tagadv = "";
  new_body.Variables.data.threaddetail.threadapp_ad_video = [];
  new_body.Variables.data.threaddetail.pingyouadv = "";
  new_body.Variables.data.threaddetail.middleadv = "";
  new_body.Variables.data.threaddetail.bottomadv = "";
  new_body.Variables.data.threaddetail.appdetailadv = [];
}

$done({body: JSON.stringify(new_body)});