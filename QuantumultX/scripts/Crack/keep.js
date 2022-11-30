if ($request['url']['indexOf']('/athena/v5/people/my') != -1) {
    re('memberStatus\":\\d+@username\":"[^"]+', 'memberStatus\":1@username\":\"ddgksf2013');
}
if ($request['url']['indexOf']('/nuocha/plans') != -1) {
    re('errorCode\":\\d+@status\":\\w+@text\":"[^"]+"@schema\":"[^"]+"', 'errorCode":0@status":true@text":null@schema":null');
}


function re() {var body = $response.body;if (arguments[0].includes("@")) {var regs = arguments[0].split("@");var strs = arguments[1].split("@");for (i = 0;i < regs.length;i++) {var reg = new RegExp(regs[i],"g");body = body.replace(reg, strs[i]);}}else {var reg = new RegExp(arguments[0],"g");body = body.replace(reg, arguments[1]);}$done(body);} 


