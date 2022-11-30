var body = $response.body.replace(/"isVip":0/g, '"isVip":1').replace(/"success":false/g, '"success":true').replace(/"code":1/g, '"code":0');
$done({ body });