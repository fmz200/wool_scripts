if ($request.url.indexOf("app/ad/queryInfoFlow") != -1) {
  var new_body = JSON.parse($response.body);
  new_body.obj = Object.values(new_body.obj).filter((item) => item.adverId == 2833);
  $done({
    body: JSON.stringify(new_body),
  });
}