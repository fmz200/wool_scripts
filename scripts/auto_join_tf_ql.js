//*********************************
// */5 * * * * * fmz_own/Auto_join_TF_QL.js, tag=自动加入TestFlight
// 环境变量：TF_APP_ID，TF_KEY，session_id，session_digest，request_id
//*********************************

let apps = process.env.TF_APP_ID;
let Key = process.env.TF_KEY;
let session_id = process.env.session_id;
let session_digest = process.env.session_digest;
let request_id = process.env.request_id;

// 调用异步方法处理集合中的元素
processCollection().then(r => console.log('结束...'));

async function processCollection() {

  let ids = [];
  if (apps) {
    if (apps.indexOf(',') > -1) {
      ids = apps.split(',');
    } else if (apps.indexOf('\n') > -1) {
      ids = apps.split('\n');
    } else {
      ids = [apps];
    }
    console.log('需要加入的TF_APP_ID = ' + ids + "\n");
    try {
      for (const ID of ids) {
        await autoPost(ID.trim());
        console.log("\n");
      }
    } catch (error) {
      console.log("发生错误：" + error);
    }
  } else {
    console.log('未发现需要加入的TF_APP_ID，请填写TF_APP_ID!');
  }
}

async function autoPost(ID) {
  console.log(ID + " 开始执行...");
  let url = "https://testflight.apple.com/v3/accounts/" + Key + "/ru/" + ID;
  let headers = {
    "X-Session-Id": session_id,
    "X-Session-Digest": session_digest,
    "X-Request-Id": request_id,
  };

  console.log(ID + " 参数拼装完成...");
  // console.log(ID + " 请求URL = " + url);
  // console.log(ID + " 请求头 = " + JSON.stringify(headers));

  // 发送请求并获取响应的body
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers
    });
    console.log(ID + " 开始发送请求...");
    const body = await response.text();
    console.log(ID + " 收到响应内容...");
    // console.log(`${ID} 的响应body：`, body);
    if (body.status == 404) {
      console.log(ID + " 不存在该TF");
    } else {
      let jsonData = JSON.parse(body);
      if (jsonData.data == null) { // "This beta isn't accepting any new testers right now."
        console.log(ID + " 此测试版目前不接受任何新测试者。" + jsonData.messages[0].message);
      } else if (jsonData.data.status == "FULL") { // This beta is full.
        const appName = jsonData.data.app.name;
        console.log(ID + " " + appName + " 此测试版已满。" + jsonData.data.message);
      } else {
        const response1 = await fetch(url + "/accept", {
          method: "POST",
          headers: headers
        });
        const body1 = await response1.text();
        console.log(`${ID} 的响应body1：`, body1);
        let jsonBody = JSON.parse(body1);
        console.log(ID + " ：" + jsonBody.data.name + " TestFlight加入成功，请删除该APPID");
      }
    }
  } catch (error) {
    console.error(`处理元素 ${ID} 时出错:`, error);
  }
}

