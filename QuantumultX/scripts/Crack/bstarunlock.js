let body = $request.body;

body = body.replace(/&sim_code=\d+/,"&sim_code=52507");
body = body.replace(/&locale=en_US/,"&&locale=en_SG");
body = body.replace(/&s_locale=en_US/,"&s_locale=SG");

console.log(body)

$done({body});
