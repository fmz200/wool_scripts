
const url = $request.url;
let new_body = JSON.parse($response.body);

if (url.includes("app/ad/queryInfoFlow")) {
  new_body.obj = Object.values(new_body.obj).filter((item) => item.adverId == 2833);
}
$done({body: JSON.stringify(new_body)});
