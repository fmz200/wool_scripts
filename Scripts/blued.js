
let rsp_body = JSON.parse($response.body);
rsp_body.data[0].banner = {};
rsp_body.data[0].service = [];
rsp_body.data[0].healthy = {};
rsp_body.data[0].healthy_banner = [];
rsp_body.data[0].emotions = [];
$done({body: JSON.stringify(rsp_body)});