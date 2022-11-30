/**
* @author: KleinerSource
* 
* @fileoverview Example to compose response for rewrite of script-echo-response.
*
* $request.url, $notify(title, subtitle, message), console.log(message), $done(response)
*
* @supported Quantumult X (v1.0.3-build141)
*/
var url = $request.url;

const myStatus = "HTTP/1.1 200 OK";
const myHeaders = {
    "Crack": "KS", 
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Headers": "*", 
    "Access-Control-Allow-Method": "*", 
    "Access-Control-Allow-Credentials": "true"
};


if (url.indexOf('/admin/service/registration/validateDevice') != -1) {
  obj = {
      "cacheExpirationDays": 365,
      "message": "Device Valid",
      "resultCode": "GOOD"
	};
} else if (url.indexOf('/admin/service/appstore/register') != -1) {
  obj = {
      "featId":"",
      "registered":true,
      "expDate":"2099-01-01",
      "key":""
	};
} else if (url.indexOf('/admin/service/registration/validate') != -1) {
	obj = {
      "featId":"",
      "registered":true,
      "expDate":"2099-01-01",
      "key":""
	};
} else if (url.indexOf('/admin/service/registration/getStatus') != -1){
	obj = {
      "planType":"Cracked",
      "deviceStatus":"",
      "subscriptions":[]
	};
} else if (url.indexOf('/admin/service/supporter/retrievekey') != -1){
	obj = {
      "Success":false,
      "ErrorMessage":"Supporter not found"
	};
}

myData = JSON.stringify(obj);

const myResponse = {
    status: myStatus,
    headers: myHeaders, // Optional.
    body: myData // Optional.
};

$done(myResponse);