const A3341AB03 = 'A3341AB03';
const A3341AB04 = 'A3341AB04';
const A3341AB05 = 'A3341AB05';

let url = $request.url;
let body = $response.body;

if (!$response.body) {
  console.log("无body 返回空对象");
  $done({});
}

let obj = JSON.parse($response.body);

//
if (url.includes(A3341AB03)) {
  /*  if (obj.data.TAG_AD_INFO) {
      console.log("去除广告A3341AB03-TAG_AD_INFO");
      obj.data.TAG_AD_INFO = [];
    }
    if (obj.data.MEBCT_AD_INFO) {
      console.log("去除广告A3341AB03-MEBCT_AD_INFO");
      obj.data.MEBCT_AD_INFO = [];
    }*/

}

//
if (url.includes(A3341AB04)) {
  if (obj.data.ICON_SKIN_INFO) {
    console.log("去除广告A3341AB04-ICON_SKIN_INFO");
    obj.data.ICON_SKIN_INFO = {};
  }
}

//
if (url.includes("A3341A120")) {
  delete obj.data.POP_AD_INFO;
}

//
if (url.includes(A3341AB04)) {
  if (obj.data.ICON_SKIN_INFO) {
    console.log("去除广告A3341AB04-ICON_SKIN_INFO");
    obj.data.ICON_SKIN_INFO = {};
  }
}

$done({body: JSON.stringify(obj)});



