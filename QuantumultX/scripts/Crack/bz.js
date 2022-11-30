var body = $response.body.replace(/viptype":"1"/g, 'viptype":"4"')
$done({ body });