var body = $response.body.replace(/specialExclusion":1/g, 'specialExclusion":0').replace(/backState":1/g, 'backState":null').replace(/intoState":0/g, 'intoState":null');
$done({ body });
