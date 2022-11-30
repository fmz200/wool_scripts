/*
Unlocks by Cuttlefish 公众号：墨鱼手记
*/
let body= $response.body; 
var obj = JSON.parse(body); 
obj={
  "Header": {
    "Result": 0,
    "Msg": "67e58be26210529f"
  },
  "Content": {
    "style": [],
    "end_time": "2029-10-10 22:08:05",
    "type": 2,
    "facility_list": [],
    "system_time": "2020-09-17 22:08:43"
  }
}
$done({body: JSON.stringify(obj)});
