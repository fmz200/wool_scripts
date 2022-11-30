/*
作者：photonmang
脚本更新：
2021/4/18 修复因Keep课程调整导致的一直加载问题

注意：此解锁仅针对Keep版本号6.24-6.27的版本。其他版本的未做适配，后续看心情适配。

智能计划使用说明：请根据自己的训练时间计划，自行安排时间和结束时间。时间设置请自行在startDate和endDate修改开始结束时间。


其他计划说明：后续其他部位的智能计划也会逐步适配，敬请关注。

# Keep 解锁私人课程,动作库,解锁运动课程页面会员精讲，解锁会员专属页面会员课程，解锁智能训练(胸背部无跑步无器材84天锻炼)
https://api.gotokeep.com/(.+/subject|.+/dynamic|.+/coursePlus/.+|.+/status|.+/tab|.+/my|.+/start|.+/join|.+/complete|.+/detail/.+|.+/preview|.+/auth|.+/tab|.+/days) url script-response-body https://raw.githubusercontent.com/photonmang/quantumultX/master/keep.js
MITM = api.gotokeep.com,59.110.149.231,129.211.156.213
*/

let url = $request.url;
let body = $response.body;
let obj = JSON.parse(body);

const startDate="20200923"; // 训练开始时间
const endDate="20201115"  //训练结束时间

const path1 = 'dynamic';
const path2 = 'subject';
const path3 = 'coursePlus'
const path4 = '/suit/v1/home/tab'
const path5 = '/kprime/v1/suit/tab/status'
const path6 = '/athena/v4/people/my'
const path7 = 'start|join';
const path8 = '/kprime/v2/home/complete';
const path9 = 'detail';
//const path10 = 'preview'
const path11 = '/kprime/v1/auth'
const path13 = '/training/v3/suits/days'
if (url.indexOf(path1) != -1) {
   obj.data.permission.isMembership = true;
   obj.data.permission.inSuit = true;
   obj.data.permission.membership = true;
}
if (url.indexOf(path2) != -1) {
   for (var i = 0; i < obj.data.subjectInfos.length; i++) {
         obj.data.subjectInfos[i].needPay = false;
   }
}
if (url.indexOf(path3) != -1) {
   for (var i = 0; i <  
obj.data.courseDetail.videoInfos.length; i++) {
obj.data.courseDetail.videoInfos[i].preview = true;
  }
}

if (url.indexOf(path5) != -1) {
   obj.data.status = 50;
   }
if (url.indexOf(path6) != -1) {
obj.data.user.memberInfo.memberStatus = 1;
}
if (url.match(path7)) {
obj.data.status = true;
}
if (url.indexOf(path8) != -1) {
obj.data.memberInfo.status = 1;
obj.data.memberInfo.gmtExpire = 9999999999000;
}
if (url.indexOf(path9) != -1) {
obj.data.memberEntrance.prime = true;
obj.data.memberEntrance.memberStatus = 1;
obj.data.memberInfo.memberStatus = 1;
}
//  if (url.indexOf(path10) != -1) {
//  obj.data.extendInfo.sectionStyle = "after";
//  }
if (url.indexOf(path11) != -1) {
obj.data = {
  "id": 3685024,
  "userId": "5d8cbc3db52fab2f5c3b9e73",
  "membershipType": "FREE_CARD",
  "orderNo": "1585069663090718744",
  "memberNo": "718769573118",
  "autoRenew": true,
  "status": 1,
  "gmtEffective": 1585069663000,
  "gmtPaidTypeEffective": 1569573119000,
  "gmtCurrentTypeEffective": 1585069663000,
  "gmtCurrentTypeExpire": 9999999999000,
  "gmtPaidTypeExpire": 9999999999000,
  "gmtExpire": 9999999999000,
  "totalEffectiveDays": 34,
  "currentEffectiveDays": 1
 }
}
if (url.indexOf(path4) != -1 ) {
obj = {
 "ok": true,
 "data": {
  "userInfo": {
   "name": "photonmang",
   "userId": "5d8cbc3db52fab2f5c3b9e73",
   "memberInfo": {
    "member": true,
    "renewSchema": null,
    "memberOffDays": 4,
    "memberStatus": 1
   },
   "bindKitbit": false,
   "lockFollowTraining": true,
   "surveyGroups": []
  },
  "sections": [
   {
    "type": "suitInprogress",
    "index": 0,
    "sectionName": "智能训练计划",
    "more": null,
    "moreText": null,
    "data": null,
    "picture": null,
    "needCache": false,
    "fallback": false,
    "suit": {
     "coachTalks": "本周是计划第 1 周，你的训练任务已完成 0 / 84 天。",
     "meta": {
      "id": "5e7de69eb1136f5caf326441",
      "startDate": startDate,
      "endDate": endDate,
      "suitType": "member",
      "version": "3.1",
      "totalDaysCount": 84,
      "trainingDaysCount": 84,
      "goals": "F",
      "stageGoals": [
       {
        "current": {
         "content": "松弛赘肉",
         "pic": "https://static1.keepcdn.com/2019/04/28/11/1556422491937_246x246.png"
        },
        "goal": {
         "content": "线条紧致",
         "pic": "https://static1.keepcdn.com/2019/04/28/11/1556422594010_246x246.png"
        },
        "goals": "F",
        "startTime": 1585584000772
       },
       {
        "current": {
         "content": "松弛赘肉",
         "pic": "https://static1.keepcdn.com/2019/04/28/11/1556422491937_246x246.png"
        },
        "goal": {
         "content": "线条紧致",
         "pic": "https://static1.keepcdn.com/2019/04/28/11/1556422594010_246x246.png"
        },
        "goals": "F",
        "startTime": 1585584000772
       },
       {
        "current": {
         "content": "松弛赘肉",
         "pic": "https://static1.keepcdn.com/2019/04/28/11/1556422491937_246x246.png"
        },
        "goal": {
         "content": "线条紧致",
         "pic": "https://static1.keepcdn.com/2019/04/28/11/1556422594010_246x246.png"
        },
        "goals": "F",
        "startTime": 1585584000772
       },
       {
        "current": {
         "content": "松弛赘肉",
         "pic": "https://static1.keepcdn.com/2019/04/28/11/1556422491937_246x246.png"
        },
        "goal": {
         "content": "线条紧致",
         "pic": "https://static1.keepcdn.com/2019/04/28/11/1556422594010_246x246.png"
        },
        "goals": "F",
        "startTime": 1585584000772
       },
       {
        "current": {
         "content": "松弛赘肉",
         "pic": "https://static1.keepcdn.com/2019/04/28/11/1556422491937_246x246.png"
        },
        "goal": {
         "content": "线条紧致",
         "pic": "https://static1.keepcdn.com/2019/04/28/11/1556422594010_246x246.png"
        },
        "goals": "F",
        "startTime": 1585584000772
       },
       {
        "current": {
         "content": "松弛赘肉",
         "pic": "https://static1.keepcdn.com/2019/04/28/11/1556422491937_246x246.png"
        },
        "goal": {
         "content": "线条紧致",
         "pic": "https://static1.keepcdn.com/2019/04/28/11/1556422594010_246x246.png"
        },
        "goals": "F",
        "startTime": 1585584000772
       }
      ],
      "suitGenerateType": "smartResistance",
      "suitTemplateId": null,
      "suitTemplateName": null,
      "paidType": 0
     },
     "offDays": {
      "available": 24,
      "leave": false,
      "endTime": null,
      "adjustText": "从今天开始请假\n保存后从今天开始休息，训练安排延后"
     },
     "summary": {
      "suitStatsText": {
       "totalDuration": 0,
       "completedDays": 0,
       "totalDays": 84,
       "totalCalorie": 0
      },
      "athleticAbilityInfo": {
       "picture": "https://static1.keepcdn.com/2018/11/13/14/1542090464507_957x375.png",
       "modified": "1",
       "modifiedText": "上次评估结果（1天前)",
       "status": null,
       "grade": "F3",
       "gradeType": "塑形",
       "athleticAbilityText": "评估详情",
       "athleticAbilitySchema": "keep://training/suits/result?kbizPos=suit_home&kbizType=suit",
       "buttonTitle": "立即进入计划",
       "buttonSchema": "https://show.gotokeep.com/training/suits/generating?kbizType=suit&kbizPos=suit_home&background=584F60"
      }
     },
     "days": [
      {
       "leave": false,
       "leaveEndDayIndex": null,
       "dayIndex": 0,
       "tasks": [
        {
         "title": "完成 2 个训练",
         "coachGuide": null,
         "todoList": [
          {
           "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
           "id": "5b88bc3ba29e3409b394eb89",
           "type": "workout",
           "name": "整体热身",
           "completed": false,
           "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=0&suitId=5e7de69eb1136f5caf326441",
           "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
           "hasPlus": true,
           "duration": 2,
           "equipments": [],
           "canBeReplaced": false,
           "category": null
          },
          {
           "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
           "id": "5db11796e381087e597320dd",
           "type": "workout",
           "name": "核心力量强化 5级",
           "completed": false,
           "schema": "keep://plans/5db11796e381087e597320dd?selectWorkout=5db11796e381087e597320dd&source=suit&suitDayIndex=0&suitId=5e7de69eb1136f5caf326441",
           "previewSchema": "keep://training/step/list?planId=5db11796e381087e597320dd&selectWorkout=5db11796e381087e597320dd",
           "hasPlus": true,
           "duration": 18,
           "equipments": [],
           "canBeReplaced": false,
           "category": null
          }
         ]
        }
       ],
       "addition": null,
       "suitTip": {
        "subTitle": "每日训练课堂",
        "title": "跳跃动作这么多，会不会伤膝盖?",
        "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551670112325_MiUyMCUyMCVFOCVC.mp4",
        "duration": 75,
        "playMode": "across",
        "cover": "https://static1.keepcdn.com/cms_static/picture/跳跃动作这么多，会伤膝盖吗？_1545364063726.png"
       },
       "dbDayIndex": 80,
       "adjustEntrance": null,
       "coachGuideInfo": null,
       "dietInfo": null
      },
      {
       "leave": false,
       "leaveEndDayIndex": null,
       "dayIndex": 1,
       "tasks": [
        {
         "title": "完成 2 个训练",
         "coachGuide": null,
         "todoList": [
          {
           "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
           "id": "5b88baf8d734a219f8de0bda",
           "type": "workout",
           "name": "下肢关节热身",
           "completed": false,
           "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=1&suitId=5e7de69eb1136f5caf326441",
           "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
           "hasPlus": false,
           "duration": 2,
           "equipments": [],
           "canBeReplaced": false,
           "category": null
          },
          {
           "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
           "id": "5db116dee381087e5972e7d1",
           "type": "workout",
           "name": "下肢综合塑形训练 5级",
           "completed": false,
           "schema": "keep://plans/5db116dee381087e5972e7d1?selectWorkout=5db116dee381087e5972e7d1&source=suit&suitDayIndex=1&suitId=5e7de69eb1136f5caf326441",
           "previewSchema": "keep://training/step/list?planId=5db116dee381087e5972e7d1&selectWorkout=5db116dee381087e5972e7d1",
           "hasPlus": true,
           "duration": 19,
           "equipments": [],
           "canBeReplaced": false,
           "category": null
          }
         ]
        }
       ],
       "addition": null,
       "suitTip": {
        "subTitle": "每日训练课堂",
        "title": "做动作时，做得快好还是做得慢好？",
        "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551670352459_MyUyMCUyMCVFNSU4.mp4",
        "duration": 77,
        "playMode": "across",
        "cover": "https://static1.keepcdn.com/cms_static/picture/做动作时，做得快好还是做得慢好？-2_1545364158629.png"
       },
       "dbDayIndex": 80,
       "adjustEntrance": null,
       "coachGuideInfo": null,
       "dietInfo": null
      },
      {
       "leave": false,
       "leaveEndDayIndex": null,
       "dayIndex": 2,
       "tasks": [
        {
         "title": "完成 2 个训练",
         "coachGuide": null,
         "todoList": [
          {
           "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
           "id": "5b86005ad734a2093f9043b4",
           "type": "workout",
           "name": "上肢关节热身",
           "completed": false,
           "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=2&suitId=5e7de69eb1136f5caf326441",
           "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
           "hasPlus": false,
           "duration": 2,
           "equipments": [],
           "canBeReplaced": false,
           "category": null
          },
          {
           "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
           "id": "5db11a4ce381087e597352f7",
           "type": "workout",
           "name": "肩部塑形训练 5级",
           "completed": false,
           "schema": "keep://plans/5db11a4ce381087e597352f7?selectWorkout=5db11a4ce381087e597352f7&source=suit&suitDayIndex=2&suitId=5e7de69eb1136f5caf326441",
           "previewSchema": "keep://training/step/list?planId=5db11a4ce381087e597352f7&selectWorkout=5db11a4ce381087e597352f7",
           "hasPlus": true,
           "duration": 18,
           "equipments": [],
           "canBeReplaced": false,
           "category": null
          }
         ]
        }
       ],
       "addition": null,
       "suitTip": {
        "subTitle": "每日训练课堂",
        "title": "收紧腹部应该怎么做？",
        "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551670438553_NCUyMCUyMCVFNiU5.mp4",
        "duration": 57,
        "playMode": "across",
        "cover": "https://static1.keepcdn.com/cms_static/picture/收紧腹部_1545364736584.png"
       },
       "dbDayIndex": 80,
       "adjustEntrance": null,
       "coachGuideInfo": null,
       "dietInfo": null
      },
      {
       "leave": false,
       "leaveEndDayIndex": null,
       "dayIndex": 3,
       "tasks": [
        {
         "title": "完成 2 个训练",
         "coachGuide": null,
         "todoList": [
          {
           "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
           "id": "5b88baf8d734a219f8de0bda",
           "type": "workout",
           "name": "下肢关节热身",
           "completed": false,
           "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=3&suitId=5e7de69eb1136f5caf326441",
           "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
           "hasPlus": false,
           "duration": 2,
           "equipments": [],
           "canBeReplaced": false,
           "category": null
          },
          {
           "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
           "id": "5db116dee381087e5972e7d1",
           "type": "workout",
           "name": "下肢综合塑形训练 5级",
           "completed": false,
           "schema": "keep://plans/5db116dee381087e5972e7d1?selectWorkout=5db116dee381087e5972e7d1&source=suit&suitDayIndex=3&suitId=5e7de69eb1136f5caf326441",
           "previewSchema": "keep://training/step/list?planId=5db116dee381087e5972e7d1&selectWorkout=5db116dee381087e5972e7d1",
           "hasPlus": true,
           "duration": 19,
           "equipments": [],
           "canBeReplaced": false,
           "category": null
          }
         ]
        }
       ],
       "addition": null,
       "suitTip": {
        "subTitle": "每日训练课堂",
        "title": "没有食物秤，怎么确定每顿吃多少",
        "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551671055666_NSUyMCUyMCVFNiVC.mp4",
        "duration": 69,
        "playMode": "across",
        "cover": "https://static1.keepcdn.com/cms_static/picture/没有食物秤，怎么确定每顿吃多少？2_1545364817795.png"
       },
       "dbDayIndex": 80,
       "adjustEntrance": null,
       "coachGuideInfo": null,
       "dietInfo": null
      },
      {
       "leave": false,
       "leaveEndDayIndex": null,
       "dayIndex": 4,
       "tasks": [
        {
         "title": "完成 2 个训练",
         "coachGuide": null,
         "todoList": [
          {
           "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
           "id": "5b86005ad734a2093f9043b4",
           "type": "workout",
           "name": "上肢关节热身",
           "completed": false,
           "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=4&suitId=5e7de69eb1136f5caf326441",
           "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
           "hasPlus": false,
           "duration": 2,
           "equipments": [],
           "canBeReplaced": false,
           "category": null
          },
          {
           "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
           "id": "5db11402e381087e5972a38c",
           "type": "workout",
           "name": "上肢胸背塑形 5级",
           "completed": false,
           "schema": "keep://plans/5db11402e381087e5972a38c?selectWorkout=5db11402e381087e5972a38c&source=suit&suitDayIndex=4&suitId=5e7de69eb1136f5caf326441",
           "previewSchema": "keep://training/step/list?planId=5db11402e381087e5972a38c&selectWorkout=5db11402e381087e5972a38c",
           "hasPlus": true,
           "duration": 19,
           "equipments": [],
           "canBeReplaced": false,
           "category": null
          }
         ]
        }
       ],
       "addition": null,
       "suitTip": {
        "subTitle": "每日训练课堂",
        "title": "除了米饭，健身还能吃哪些主食？",
        "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551671223552_NyUyMCUyMCVFOSU5.mp4",
        "duration": 81,
        "playMode": "across",
        "cover": "https://static1.keepcdn.com/cms_static/picture/除了米饭，健身还能吃哪些主食？1_1545365288811.png"
       },
       "dbDayIndex": 80,
       "adjustEntrance": null,
       "coachGuideInfo": null,
       "dietInfo": null
      },
      {
       "leave": false,
       "leaveEndDayIndex": null,
       "dayIndex": 5,
       "tasks": [
        {
         "title": "完成 2 个训练",
         "coachGuide": null,
         "todoList": [
          {
           "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
           "id": "5b88bc3ba29e3409b394eb89",
           "type": "workout",
           "name": "整体热身",
           "completed": false,
           "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=5&suitId=5e7de69eb1136f5caf326441",
           "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
           "hasPlus": true,
           "duration": 2,
           "equipments": [],
           "canBeReplaced": false,
           "category": null
          },
          {
           "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
           "id": "5db11cd2e381087e5973885e",
           "type": "workout",
           "name": "核心力量强化 5级",
           "completed": false,
           "schema": "keep://plans/5db11cd2e381087e5973885e?selectWorkout=5db11cd2e381087e5973885e&source=suit&suitDayIndex=5&suitId=5e7de69eb1136f5caf326441",
           "previewSchema": "keep://training/step/list?planId=5db11cd2e381087e5973885e&selectWorkout=5db11cd2e381087e5973885e",
           "hasPlus": true,
           "duration": 28,
           "equipments": [],
           "canBeReplaced": false,
           "category": null
          }
         ]
        }
       ],
       "addition": null,
       "suitTip": {
        "subTitle": "每日训练课堂",
        "title": "豆浆和牛奶，到底选哪个？",
        "videoUrl": "https://v1.keepcdn.com/cms_static/video/10  豆浆和牛奶，到底选哪个？_1545722348512.mp4",
        "duration": 67,
        "playMode": "across",
        "cover": "https://static1.keepcdn.com/cms_static/picture/豆浆和牛奶，到底选哪个？3_1545722367622.png"
       },
       "dbDayIndex": 80,
       "adjustEntrance": null,
       "coachGuideInfo": null,
       "dietInfo": null
      },
      {
       "leave": false,
       "leaveEndDayIndex": null,
       "dayIndex": 6,
       "tasks": [
        {
         "title": "完成 2 个训练",
         "coachGuide": null,
         "todoList": [
          {
           "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
           "id": "5b86005ad734a2093f9043b4",
           "type": "workout",
           "name": "上肢关节热身",
           "completed": false,
           "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=6&suitId=5e7de69eb1136f5caf326441",
           "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
           "hasPlus": false,
           "duration": 2,
           "equipments": [],
           "canBeReplaced": false,
           "category": null
          },
          {
           "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
           "id": "5db113fae381087e59729bbc",
           "type": "workout",
           "name": "上肢力量综合提升 5级",
           "completed": false,
           "schema": "keep://plans/5db113fae381087e59729bbc?selectWorkout=5db113fae381087e59729bbc&source=suit&suitDayIndex=6&suitId=5e7de69eb1136f5caf326441",
           "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bbc&selectWorkout=5db113fae381087e59729bbc",
           "hasPlus": true,
           "duration": 20,
           "equipments": [],
           "canBeReplaced": false,
           "category": null
          }
         ]
        }
       ],
       "addition": null,
       "suitTip": {
        "subTitle": "每日训练课堂",
        "title": "为什么健身人士都爱鸡胸肉？",
        "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551671271540_OCUyMCUyMCVFNCVC.mp4",
        "duration": 72,
        "playMode": "across",
        "cover": "https://static1.keepcdn.com/cms_static/picture/为什么健身人士都爱鸡胸肉？1_1545722277940.png"
       },
       "dbDayIndex": 80,
       "adjustEntrance": null,
       "coachGuideInfo": null,
       "dietInfo": null
      }
     ],
     "introduction": null,
     "suitCalendar": [
      {
       "dayIndex": 0,
       "completed": false
      },
      {
       "dayIndex": 1,
       "completed": false
      },
      {
       "dayIndex": 2,
       "completed": false
      },
      {
       "dayIndex": 3,
       "completed": false
      },
      {
       "dayIndex": 4,
       "completed": false
      },
      {
       "dayIndex": 5,
       "completed": false
      },
      {
       "dayIndex": 6,
       "completed": false
      },
      {
       "dayIndex": 7,
       "completed": false
      },
      {
       "dayIndex": 8,
       "completed": false
      },
      {
       "dayIndex": 9,
       "completed": false
      },
      {
       "dayIndex": 10,
       "completed": false
      },
      {
       "dayIndex": 11,
       "completed": false
      },
      {
       "dayIndex": 12,
       "completed": false
      },
      {
       "dayIndex": 13,
       "completed": false
      },
      {
       "dayIndex": 14,
       "completed": false
      },
      {
       "dayIndex": 15,
       "completed": false
      },
      {
       "dayIndex": 16,
       "completed": false
      },
      {
       "dayIndex": 17,
       "completed": false
      },
      {
       "dayIndex": 18,
       "completed": false
      },
      {
       "dayIndex": 19,
       "completed": false
      },
      {
       "dayIndex": 20,
       "completed": false
      },
      {
       "dayIndex": 21,
       "completed": false
      },
      {
       "dayIndex": 22,
       "completed": false
      },
      {
       "dayIndex": 23,
       "completed": false
      },
      {
       "dayIndex": 24,
       "completed": false
      },
      {
       "dayIndex": 25,
       "completed": false
      },
      {
       "dayIndex": 26,
       "completed": false
      },
      {
       "dayIndex": 27,
       "completed": false
      },
      {
       "dayIndex": 28,
       "completed": false
      },
      {
       "dayIndex": 29,
       "completed": false
      },
      {
       "dayIndex": 30,
       "completed": false
      },
      {
       "dayIndex": 31,
       "completed": false
      },
      {
       "dayIndex": 32,
       "completed": false
      },
      {
       "dayIndex": 33,
       "completed": false
      },
      {
       "dayIndex": 34,
       "completed": false
      },
      {
       "dayIndex": 35,
       "completed": false
      },
      {
       "dayIndex": 36,
       "completed": false
      },
      {
       "dayIndex": 37,
       "completed": false
      },
      {
       "dayIndex": 38,
       "completed": false
      },
      {
       "dayIndex": 39,
       "completed": false
      },
      {
       "dayIndex": 40,
       "completed": false
      },
      {
       "dayIndex": 41,
       "completed": false
      },
      {
       "dayIndex": 42,
       "completed": false
      },
      {
       "dayIndex": 43,
       "completed": false
      },
      {
       "dayIndex": 44,
       "completed": false
      },
      {
       "dayIndex": 45,
       "completed": false
      },
      {
       "dayIndex": 46,
       "completed": false
      },
      {
       "dayIndex": 47,
       "completed": false
      },
      {
       "dayIndex": 48,
       "completed": false
      },
      {
       "dayIndex": 49,
       "completed": false
      },
      {
       "dayIndex": 50,
       "completed": false
      },
      {
       "dayIndex": 51,
       "completed": false
      },
      {
       "dayIndex": 52,
       "completed": false
      },
      {
       "dayIndex": 53,
       "completed": false
      },
      {
       "dayIndex": 54,
       "completed": false
      },
      {
       "dayIndex": 55,
       "completed": false
      },
      {
       "dayIndex": 56,
       "completed": false
      },
      {
       "dayIndex": 57,
       "completed": false
      },
      {
       "dayIndex": 58,
       "completed": false
      },
      {
       "dayIndex": 59,
       "completed": false
      },
      {
       "dayIndex": 60,
       "completed": false
      },
      {
       "dayIndex": 61,
       "completed": false
      },
      {
       "dayIndex": 62,
       "completed": false
      },
      {
       "dayIndex": 63,
       "completed": false
      },
      {
       "dayIndex": 64,
       "completed": false
      },
      {
       "dayIndex": 65,
       "completed": false
      },
      {
       "dayIndex": 66,
       "completed": false
      },
      {
       "dayIndex": 67,
       "completed": false
      },
      {
       "dayIndex": 68,
       "completed": false
      },
      {
       "dayIndex": 69,
       "completed": false
      },
      {
       "dayIndex": 70,
       "completed": false
      },
      {
       "dayIndex": 71,
       "completed": false
      },
      {
       "dayIndex": 72,
       "completed": false
      },
      {
       "dayIndex": 73,
       "completed": false
      },
      {
       "dayIndex": 74,
       "completed": false
      },
      {
       "dayIndex": 75,
       "completed": false
      },
      {
       "dayIndex": 76,
       "completed": false
      },
      {
       "dayIndex": 77,
       "completed": false
      },
      {
       "dayIndex": 78,
       "completed": false
      },
      {
       "dayIndex": 79,
       "completed": false
      },
      {
       "dayIndex": 80,
       "completed": false
      },
      {
       "dayIndex": 81,
       "completed": false
      },
      {
       "dayIndex": 82,
       "completed": false
      },
      {
       "dayIndex": 83,
       "completed": false
      }
     ],
     "nextSuit": null,
     "enableAdjust": true
    },
    "userSuitGoals": null,
    "equipmentRecommend": null,
    "suitTeamInfo": null,
    "modifiedCard": null,
    "memberSalesGuideCard": null,
    "recommendTemplateSuits": {
     "suits": [
      {
       "suitTemplateId": "5e0d5d3542e9b12e59d73963",
       "name": "告别肚腩计划",
       "picture": "https://static1.keepcdn.com/ark_prime-cms/2020/03/19/10/03/1584583424353_750x562.png",
       "hasPlus": true,
       "suitGenerateType": "specialTemplate",
       "desc": "4 周 · 零基础 · 减脂",
       "schema": "https://m.gotokeep.com/krime-fe/suit/template/detail/5e0d5d3542e9b12e59d73963?fullscreen=true",
       "trainingDaysPerWeek": 5,
       "workoutMinutes": 20,
       "workoutMinutesMin": 0,
       "workoutMinutesMax": 0,
       "weekPeriod": 4,
       "paidType": 0,
       "suitTags": [
        {
         "type": "prime",
         "content": "会员"
        }
       ],
       "newSuit": false
      },
      {
       "suitTemplateId": "5e0aeb8fa2dea40d52f47d3f",
       "name": "腹肌撕裂计划",
       "picture": "https://static1.keepcdn.com/ark_prime-cms/2020/03/19/10/38/1584585481536_750x562.png",
       "hasPlus": true,
       "suitGenerateType": "specialTemplate",
       "desc": "4 周 · 初级 · 增肌",
       "schema": "https://m.gotokeep.com/krime-fe/suit/template/detail/5e0aeb8fa2dea40d52f47d3f?fullscreen=true",
       "trainingDaysPerWeek": 5,
       "workoutMinutes": 20,
       "workoutMinutesMin": 0,
       "workoutMinutesMax": 0,
       "weekPeriod": 4,
       "paidType": 0,
       "suitTags": [
        {
         "type": "prime",
         "content": "会员"
        }
       ],
       "newSuit": false
      },
      {
       "suitTemplateId": "5e4f97966da3b30cfe3a8234",
       "name": "开学突击瘦身计划",
       "picture": "https://static1.keepcdn.com/ark_prime-cms/2020/03/19/10/06/1584583577389_750x562.png",
       "hasPlus": true,
       "suitGenerateType": "specialTemplate",
       "desc": "1 周 · 进阶 · 减脂",
       "schema": "https://m.gotokeep.com/krime-fe/suit/template/detail/5e4f97966da3b30cfe3a8234?fullscreen=true",
       "trainingDaysPerWeek": 7,
       "workoutMinutes": 30,
       "workoutMinutesMin": 0,
       "workoutMinutesMax": 0,
       "weekPeriod": 1,
       "paidType": 0,
       "suitTags": [
        {
         "type": "prime",
         "content": "会员"
        }
       ],
       "newSuit": false
      }
     ],
     "schema": "keep://krime/recommend",
     "title": "更多训练计划"
    }
   },
   {
    "type": "memberRecommend",
    "index": 0,
    "sectionName": "会员推荐",
    "more": null,
    "moreText": null,
    "data": null,
    "picture": null,
    "needCache": false,
    "fallback": false,
    "memberRecommendList": [
     {
      "id": 2472,
      "resourceId": "",
      "resourceName": "用你的好身材来免单！",
      "resourceDesc": "",
      "eventUrl": "https://mo.gotokeep.com/topic/311895365525716992",
      "imgUrl": "https://static1.keepcdn.com/2020/03/10/1583828853409_750x340.png",
      "imgPadUrl": "https://static1.keepcdn.com/2020/03/10/1583828857519_1140x400.png",
      "contentTag": null
     },
     {
      "id": 2478,
      "resourceId": "",
      "resourceName": "现在续费享寺库+优酷年卡 省416元👆",
      "resourceDesc": "",
      "eventUrl": "https://m.secoo.com/appActivity/vip-keep-youkuTv.shtml?pageid=keep_keep-kumiao",
      "imgUrl": "https://static1.keepcdn.com/2020/03/11/1583923060288_750x340.jpg",
      "imgPadUrl": "https://static1.keepcdn.com/2020/03/11/1583923064807_1140x400.jpg",
      "contentTag": null
     },
     {
      "id": 2445,
      "resourceId": "",
      "resourceName": "适合在家跳的燃脂塑形操！",
      "resourceDesc": "",
      "eventUrl": "https://mo.gotokeep.com/topic/302833709776650240",
      "imgUrl": "https://static1.keepcdn.com/2020/02/21/1582258064059_750x340.jpg",
      "imgPadUrl": "https://static1.keepcdn.com/2020/02/21/1582258069336_1140x400.jpg",
      "contentTag": null
     },
     {
      "id": 2370,
      "resourceId": "",
      "resourceName": "买会员年卡，0元享手环",
      "resourceDesc": "",
      "eventUrl": "http://mo.gotokeep.com/topic/1877",
      "imgUrl": "https://static1.keepcdn.com/2019/10/31/1572506094933_750x340.png",
      "imgPadUrl": "https://static1.keepcdn.com/2019/10/31/1572506098991_1140x400.png",
      "contentTag": null
     }
    ]
   }
  ],
  "memberFunctionSalesDetail": "https://m.gotokeep.com/krime-fe/prime/selling/feature?fullscreen=true"
 },
 "errorCode": 0,
 "text": ""
}
}
if (url.indexOf(path13) != -1) {
obj = {
 "ok": true,
 "data": {
  "days": [
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 0,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=0&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11796e381087e597320dd",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11796e381087e597320dd?selectWorkout=5db11796e381087e597320dd&source=suit&suitDayIndex=0&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11796e381087e597320dd&selectWorkout=5db11796e381087e597320dd",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "跳跃动作这么多，会不会伤膝盖?",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551670112325_MiUyMCUyMCVFOCVC.mp4",
     "duration": 75,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/跳跃动作这么多，会伤膝盖吗？_1545364063726.png"
    },
    "dbDayIndex": 0,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 1,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=1&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db116dee381087e5972e7d1",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db116dee381087e5972e7d1?selectWorkout=5db116dee381087e5972e7d1&source=suit&suitDayIndex=1&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db116dee381087e5972e7d1&selectWorkout=5db116dee381087e5972e7d1",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "做动作时，做得快好还是做得慢好？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551670352459_MyUyMCUyMCVFNSU4.mp4",
     "duration": 77,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/做动作时，做得快好还是做得慢好？-2_1545364158629.png"
    },
    "dbDayIndex": 1,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 2,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=2&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db11a4ce381087e597352f7",
        "type": "workout",
        "name": "肩部塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db11a4ce381087e597352f7?selectWorkout=5db11a4ce381087e597352f7&source=suit&suitDayIndex=2&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11a4ce381087e597352f7&selectWorkout=5db11a4ce381087e597352f7",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "收紧腹部应该怎么做？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551670438553_NCUyMCUyMCVFNiU5.mp4",
     "duration": 57,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/收紧腹部_1545364736584.png"
    },
    "dbDayIndex": 2,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 3,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=3&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db116dee381087e5972e7d1",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db116dee381087e5972e7d1?selectWorkout=5db116dee381087e5972e7d1&source=suit&suitDayIndex=3&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db116dee381087e5972e7d1&selectWorkout=5db116dee381087e5972e7d1",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "没有食物秤，怎么确定每顿吃多少",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551671055666_NSUyMCUyMCVFNiVC.mp4",
     "duration": 69,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/没有食物秤，怎么确定每顿吃多少？2_1545364817795.png"
    },
    "dbDayIndex": 3,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 4,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=4&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db11402e381087e5972a38c",
        "type": "workout",
        "name": "上肢胸背塑形 5级",
        "completed": false,
        "schema": "keep://plans/5db11402e381087e5972a38c?selectWorkout=5db11402e381087e5972a38c&source=suit&suitDayIndex=4&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11402e381087e5972a38c&selectWorkout=5db11402e381087e5972a38c",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "除了米饭，健身还能吃哪些主食？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551671223552_NyUyMCUyMCVFOSU5.mp4",
     "duration": 81,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/除了米饭，健身还能吃哪些主食？1_1545365288811.png"
    },
    "dbDayIndex": 4,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 5,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=5&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11cd2e381087e5973885e",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11cd2e381087e5973885e?selectWorkout=5db11cd2e381087e5973885e&source=suit&suitDayIndex=5&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11cd2e381087e5973885e&selectWorkout=5db11cd2e381087e5973885e",
        "hasPlus": true,
        "duration": 28,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "豆浆和牛奶，到底选哪个？",
     "videoUrl": "https://v1.keepcdn.com/cms_static/video/10  豆浆和牛奶，到底选哪个？_1545722348512.mp4",
     "duration": 67,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/豆浆和牛奶，到底选哪个？3_1545722367622.png"
    },
    "dbDayIndex": 5,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 6,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=6&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bbc",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bbc?selectWorkout=5db113fae381087e59729bbc&source=suit&suitDayIndex=6&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bbc&selectWorkout=5db113fae381087e59729bbc",
        "hasPlus": true,
        "duration": 20,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "为什么健身人士都爱鸡胸肉？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551671271540_OCUyMCUyMCVFNCVC.mp4",
     "duration": 72,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/为什么健身人士都爱鸡胸肉？1_1545722277940.png"
    },
    "dbDayIndex": 6,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
      {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 7,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=7&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db116dee381087e5972e821",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db116dee381087e5972e821?selectWorkout=5db116dee381087e5972e821&source=suit&suitDayIndex=7&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db116dee381087e5972e821&selectWorkout=5db116dee381087e5972e821",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "吃素怎么补蛋白？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551671424966_OSUyMCUyMCVFNSU5.mp4",
     "duration": 79,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/吃素怎么补蛋白？2_1545722315312.png"
    },
    "dbDayIndex": 7,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 8,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=8&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bfd",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bfd?selectWorkout=5db113fae381087e59729bfd&source=suit&suitDayIndex=8&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bfd&selectWorkout=5db113fae381087e59729bfd",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "土鸡蛋比普通鸡蛋更有营养吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551673473746_MjclMjAlMjAlRTUl.mp4",
     "duration": 67,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/土鸡蛋比普通鸡蛋更有营养吗？3_1545724477487.jpg"
    },
    "dbDayIndex": 8,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 9,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=9&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11796e381087e597320da",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11796e381087e597320da?selectWorkout=5db11796e381087e597320da&source=suit&suitDayIndex=9&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11796e381087e597320da&selectWorkout=5db11796e381087e597320da",
        "hasPlus": true,
        "duration": 21,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "哪种食用油更健康？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/MTElMjAlMjAlRTUlOTMlQUElRTclQTclOEQlRTklQTMlOUYlRTclOTQlQTglRTYlQjIlQjklRTYlOUIlQjQlRTUlODElQTUlRTUlQkElQjclRUYlQkMlOUZfMTU0NTcyMjM4MzAxNA==_1547463310426.mp4",
     "duration": 85,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/哪种食用油更健康？2_1545722422183.png"
    },
    "dbDayIndex": 9,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 10,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=10&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bf9",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bf9?selectWorkout=5db113fae381087e59729bf9&source=suit&suitDayIndex=10&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bf9&selectWorkout=5db113fae381087e59729bf9",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "水果什么时候吃有讲究吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551671950282_MTIlMjAlMjAlRTYl.mp4",
     "duration": 74,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/水果什么时候吃有讲究吗？3_1545722468772.png"
    },
    "dbDayIndex": 10,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 11,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=11&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db11730e381087e5972f7ab",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db11730e381087e5972f7ab?selectWorkout=5db11730e381087e5972f7ab&source=suit&suitDayIndex=11&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11730e381087e5972f7ab&selectWorkout=5db11730e381087e5972f7ab",
        "hasPlus": true,
        "duration": 30,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "水果榨成汁，营养还剩多少？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551672004309_MTIlMjAxMyVFNiVC.mp4",
     "duration": 83,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/水果榨成汁，营养还剩多少？1_1545719757306.png"
    },
    "dbDayIndex": 11,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 12,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=12&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bf2",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bf2?selectWorkout=5db113fae381087e59729bf2&source=suit&suitDayIndex=12&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bf2&selectWorkout=5db113fae381087e59729bf2",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "是不是吃什么蔬菜都一样？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551672160504_MTQlMjAlMjAlRTYl.mp4",
     "duration": 65,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/是不是吃什么蔬菜都一样？2_1545723028661.png"
    },
    "dbDayIndex": 12,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 13,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=13&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11799e381087e5973289c",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11799e381087e5973289c?selectWorkout=5db11799e381087e5973289c&source=suit&suitDayIndex=13&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11799e381087e5973289c&selectWorkout=5db11799e381087e5973289c",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "酸奶中的益生菌可以改善肠道健康吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551165988150_JUU5JTg1JUI4JUU1.mp4",
     "duration": 59,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551166019926_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 13,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
      {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 14,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=14&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bbf",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bbf?selectWorkout=5db113fae381087e59729bbf&source=suit&suitDayIndex=14&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bbf&selectWorkout=5db113fae381087e59729bbf",
        "hasPlus": true,
        "duration": 20,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "大骨汤能补钙吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551166144265_JUU1JUE0JUE3JUU5.mp4",
     "duration": 76,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551166166012_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 14,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 15,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=15&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db116b3e381087e5972e002",
        "type": "workout",
        "name": "下肢力量提升 5级",
        "completed": false,
        "schema": "keep://plans/5db116b3e381087e5972e002?selectWorkout=5db116b3e381087e5972e002&source=suit&suitDayIndex=15&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db116b3e381087e5972e002&selectWorkout=5db116b3e381087e5972e002",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "有机食品更有营养吗?",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551166251945_JUU2JTlDJTg5JUU2.mp4",
     "duration": 77,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551166331380_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 15,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 16,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=16&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bf8",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bf8?selectWorkout=5db113fae381087e59729bf8&source=suit&suitDayIndex=16&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bf8&selectWorkout=5db113fae381087e59729bf8",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "如何选择哑铃的重量？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551162563252_JUU1JUE2JTgyJUU0.mp4",
     "duration": 60,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551162600491_JUU1JUE2JTgyJUU0.jpg"
    },
    "dbDayIndex": 16,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 17,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=17&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11799e381087e59732869",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11799e381087e59732869?selectWorkout=5db11799e381087e59732869&source=suit&suitDayIndex=17&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11799e381087e59732869&selectWorkout=5db11799e381087e59732869",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "为什么练了这么久，体型还是没变化？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551672418260_MTclMjAlMjAlRTQl.mp4",
     "duration": 66,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/为什么练了这么久，体型还是没变化？（2）_1545723230167.png"
    },
    "dbDayIndex": 17,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 18,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=18&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bb3",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bb3?selectWorkout=5db113fae381087e59729bb3&source=suit&suitDayIndex=18&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bb3&selectWorkout=5db113fae381087e59729bb3",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "为什么训练时，最后的动作总是坚持不下来？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551672544915_MTglMjAlMjAlRTQl.mp4",
     "duration": 68,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/为什么训练时，最后的动作总是坚持不下来？3_1545723275550.png"
    },
    "dbDayIndex": 18,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 19,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=19&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db11730e381087e5972f785",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db11730e381087e5972f785?selectWorkout=5db11730e381087e5972f785&source=suit&suitDayIndex=19&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11730e381087e5972f785&selectWorkout=5db11730e381087e5972f785",
        "hasPlus": true,
        "duration": 29,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "泡沫轴有什么用？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551672652273_MTklMjAlMjAlRTYl.mp4",
     "duration": 78,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/泡沫轴有什么用？2-_1545723458077.png"
    },
    "dbDayIndex": 19,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 20,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=20&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db11b2fe381087e5973629a",
        "type": "workout",
        "name": "肩臂线条塑造 5级",
        "completed": false,
        "schema": "keep://plans/5db11b2fe381087e5973629a?selectWorkout=5db11b2fe381087e5973629a&source=suit&suitDayIndex=20&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11b2fe381087e5973629a&selectWorkout=5db11b2fe381087e5973629a",
        "hasPlus": true,
        "duration": 29,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "运动中岔气是怎么回事？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/MjAlMjAlMjAlRTglQkYlOTAlRTUlOEElQTglRTQlQjglQUQlRTUlQjIlOTQlRTYlQjAlOTQlRTYlOTglQUYlRTYlODAlOEUlRTQlQjklODglRTUlOUIlOUUlRTQlQkElOEIlRUYlQkMlOUZfMTU0NTcyMzQ3MzEzNw==_1547462688729.mp4",
     "duration": 73,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/运动中岔气是怎么回事？1_1545723492460.png"
    },
    "dbDayIndex": 20,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
      {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 21,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=21&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11796e381087e597320c5",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11796e381087e597320c5?selectWorkout=5db11796e381087e597320c5&source=suit&suitDayIndex=21&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11796e381087e597320c5&selectWorkout=5db11796e381087e597320c5",
        "hasPlus": true,
        "duration": 21,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "身体左右力量不一样大怎么办？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/MjElMjAlMjAlRTglQkElQUIlRTQlQkQlOTMlRTUlQjclQTYlRTUlOEYlQjMlRTUlOEElOUIlRTklODclOEYlRTQlQjglOEQlRTQlQjglODAlRTYlQTAlQjclRTUlQTQlQTclRTYlODAlOEUlRTQlQjklODglRTUlOEElOUUlRUYlQkMlOUZfMTU0NTcyNDEzMDEwNQ==_1547462403822.mp4",
     "duration": 82,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/身体左右力量不一样大怎么办2_1545724177529.jpg"
    },
    "dbDayIndex": 21,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 22,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=22&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db11a4ce381087e597352f7",
        "type": "workout",
        "name": "肩部塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db11a4ce381087e597352f7?selectWorkout=5db11a4ce381087e597352f7&source=suit&suitDayIndex=22&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11a4ce381087e597352f7&selectWorkout=5db11a4ce381087e597352f7",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "什么样的饮料是运动饮料？",
     "videoUrl": "https://v1.keepcdn.com/cms_static/video/22  什么样的饮料是运动饮料？_1545721447745.mp4",
     "duration": 77,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/什么样的饮料是运动饮料？（2）_1545721483322.png"
    },
    "dbDayIndex": 22,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 23,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=23&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db116dee381087e5972e7d1",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db116dee381087e5972e7d1?selectWorkout=5db116dee381087e5972e7d1&source=suit&suitDayIndex=23&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db116dee381087e5972e7d1&selectWorkout=5db116dee381087e5972e7d1",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "运动后吃什么，能提高训练效果？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551672316783_MTYlMjAlMjAlRTgl.mp4",
     "duration": 83,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/运动后吃什么，能提高训练效果？2_1545723066843.png"
    },
    "dbDayIndex": 23,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 24,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=24&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db11402e381087e5972a38c",
        "type": "workout",
        "name": "上肢胸背塑形 5级",
        "completed": false,
        "schema": "keep://plans/5db11402e381087e5972a38c?selectWorkout=5db11402e381087e5972a38c&source=suit&suitDayIndex=24&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11402e381087e5972a38c&selectWorkout=5db11402e381087e5972a38c",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "「零脂肪」、「不含糖」的食品真的可以吃吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551673140276_MjMlRTMlODAlOEMl.mp4",
     "duration": 103,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/「零脂肪」、「不含糖」的食品真的可以吃吗？3_1545721560049.png"
    },
    "dbDayIndex": 24,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 25,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=25&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11cd2e381087e5973885e",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11cd2e381087e5973885e?selectWorkout=5db11cd2e381087e5973885e&source=suit&suitDayIndex=25&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11cd2e381087e5973885e&selectWorkout=5db11cd2e381087e5973885e",
        "hasPlus": true,
        "duration": 28,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "能通过训练将腹肌变得对称好看吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/MjUlMjAlMjAlRTglODMlQkQlRTklODAlOUElRTglQkYlODclRTglQUUlQUQlRTclQkIlODMlRTUlQjAlODYlRTglODUlQjklRTglODIlOEMlRTUlOEYlOTglRTUlQkUlOTclRTUlQUYlQjklRTclQTclQjAlRTUlQTUlQkQlRTclOUMlOEIlRTUlOTAlOTclRUYlQkMlOUZfMTU0NTcyNDMzODEwNw==_1547461991168.mp4",
     "duration": 91,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/能通过训练将腹肌变得对称吗？4_1545724385686.jpg"
    },
    "dbDayIndex": 25,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 26,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=26&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bbc",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bbc?selectWorkout=5db113fae381087e59729bbc&source=suit&suitDayIndex=26&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bbc&selectWorkout=5db113fae381087e59729bbc",
        "hasPlus": true,
        "duration": 20,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "如果不运动，身材线条会不会消失？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551673354377_MjYlMjAlMjAlRTUl.mp4",
     "duration": 78,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/如果不运动 身体线条会不会消失1 _1545724437572.jpg"
    },
    "dbDayIndex": 26,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 27,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=27&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db116dee381087e5972e821",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db116dee381087e5972e821?selectWorkout=5db116dee381087e5972e821&source=suit&suitDayIndex=27&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db116dee381087e5972e821&selectWorkout=5db116dee381087e5972e821",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "想长壮，要先吃胖？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551161569386_JUU2JTgzJUIzJUU5.mp4",
     "duration": 73,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551161619494_JUU2JTgzJUIzJUU1.jpg"
    },
    "dbDayIndex": 27,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
      {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 28,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=28&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bfd",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bfd?selectWorkout=5db113fae381087e59729bfd&source=suit&suitDayIndex=28&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bfd&selectWorkout=5db113fae381087e59729bfd",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "每天需要多少热量才能长肌肉？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551161693135_JUU2JUFGJThGJUU1.mp4",
     "duration": 49,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551161816321_JUU2JUFGJThGJUU1.jpg"
    },
    "dbDayIndex": 28,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 29,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=29&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11796e381087e597320da",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11796e381087e597320da?selectWorkout=5db11796e381087e597320da&source=suit&suitDayIndex=29&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11796e381087e597320da&selectWorkout=5db11796e381087e597320da",
        "hasPlus": true,
        "duration": 21,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "用器械训练有必要吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551162252608_JUU1JThBJUEwJUU1.mp4",
     "duration": 61,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551162400904_JUU3JTk0JUE4JUU1.jpg"
    },
    "dbDayIndex": 29,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 30,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=30&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bf9",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bf9?selectWorkout=5db113fae381087e59729bf9&source=suit&suitDayIndex=30&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bf9&selectWorkout=5db113fae381087e59729bf9",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "想增肌，又吃不多怎么办？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551671200665_NyUyMCUyMCVFNiU4.mp4",
     "duration": 88,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/JUU2JTgzJUIzJUU1JUEyJTlFJUU4JTgyJThDJUVGJUJDJThDJUU1JThGJTg4JUU1JTkwJTgzJUU0JUI4JThEJUU1JUE0JTlBJUU2JTgwJThFJUU0JUI5JTg4JUU1JThBJTlFJUVGJUJDJTlGMQ==_1548390719755.jpg"
    },
    "dbDayIndex": 30,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 31,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=31&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db11730e381087e5972f7ab",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db11730e381087e5972f7ab?selectWorkout=5db11730e381087e5972f7ab&source=suit&suitDayIndex=31&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11730e381087e5972f7ab&selectWorkout=5db11730e381087e5972f7ab",
        "hasPlus": true,
        "duration": 30,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "酸奶应该怎么选？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551672497782_MTclRTklODUlQjgl.mp4",
     "duration": 92,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/JUU5JTg1JUI4JUU1JUE1JUI2JUU1JUJBJTk0JUU4JUFGJUE1JUU2JTgwJThFJUU0JUI5JTg4JUU5JTgwJTg5JUVGJUJDJTlGMmpwZw==_1548387046090.jpg"
    },
    "dbDayIndex": 31,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 32,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=32&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bf2",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bf2?selectWorkout=5db113fae381087e59729bf2&source=suit&suitDayIndex=32&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bf2&selectWorkout=5db113fae381087e59729bf2",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "蛋白质吃得越多，增肌效果越好吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551162830590_JUU4JTlCJThCJUU3.mp4",
     "duration": 72,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551162835092_JUU4JTlCJThCJUU3.jpg"
    },
    "dbDayIndex": 32,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 33,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=33&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11799e381087e5973289c",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11799e381087e5973289c?selectWorkout=5db11799e381087e5973289c&source=suit&suitDayIndex=33&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11799e381087e5973289c&selectWorkout=5db11799e381087e5973289c",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "「打了激素」的鸡，还能吃吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551162912468_JUUzJTgwJThDJUU2.mp4",
     "duration": 64,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551162949690_JUU2JTg5JTkzJUU0.jpg"
    },
    "dbDayIndex": 33,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 34,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=34&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bbf",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bbf?selectWorkout=5db113fae381087e59729bbf&source=suit&suitDayIndex=34&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bbf&selectWorkout=5db113fae381087e59729bbf",
        "hasPlus": true,
        "duration": 20,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "健身吃沙拉好还是炒菜好？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551671122224_NiUyMCUyMCVFNSU4.mp4",
     "duration": 70,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/健身吃沙拉好还是炒菜好？2_1545364992634.png"
    },
    "dbDayIndex": 34,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
      {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 35,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=35&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db116b3e381087e5972e002",
        "type": "workout",
        "name": "下肢力量提升 5级",
        "completed": false,
        "schema": "keep://plans/5db116b3e381087e5972e002?selectWorkout=5db116b3e381087e5972e002&source=suit&suitDayIndex=35&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db116b3e381087e5972e002&selectWorkout=5db116b3e381087e5972e002",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "不喜欢喝白水怎么办",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551672259327_MTUlRTQlQjglOEQl.mp4",
     "duration": 75,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/不喜欢喝白水怎么办？（3）_1545720450289.png"
    },
    "dbDayIndex": 35,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 36,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=36&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bf8",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bf8?selectWorkout=5db113fae381087e59729bf8&source=suit&suitDayIndex=36&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bf8&selectWorkout=5db113fae381087e59729bf8",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "为什么训练时肌肉会有泵感？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551163011250_JUU2JUIzJUI1JUU2.mp4",
     "duration": 61,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551163026673_JUUyJTlDJTg1JUU0.jpg"
    },
    "dbDayIndex": 36,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 37,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=37&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11799e381087e59732869",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11799e381087e59732869?selectWorkout=5db11799e381087e59732869&source=suit&suitDayIndex=37&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11799e381087e59732869&selectWorkout=5db11799e381087e59732869",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "没有泵感就没有效果吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551163115120_JUU2JUIyJUExJUU2.mp4",
     "duration": 57,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551163120533_JUU2JUIyJUExJUU2.jpg"
    },
    "dbDayIndex": 37,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 38,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=38&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bb3",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bb3?selectWorkout=5db113fae381087e59729bb3&source=suit&suitDayIndex=38&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bb3&selectWorkout=5db113fae381087e59729bb3",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "为什么不能只练想练的部位？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551163209463_JUU3JUJCJTgzJUU0.mp4",
     "duration": 79,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551163216169_JUUyJTlDJTg1JUU0.jpg"
    },
    "dbDayIndex": 38,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 39,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=39&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db11730e381087e5972f785",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db11730e381087e5972f785?selectWorkout=5db11730e381087e5972f785&source=suit&suitDayIndex=39&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11730e381087e5972f785&selectWorkout=5db11730e381087e5972f785",
        "hasPlus": true,
        "duration": 29,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "运动时有必要佩戴护具吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551163852785_JUU2JTk4JUFGJUU1.mp4",
     "duration": 80,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551163863825_JUU4JUJGJTkwJUU1.jpg"
    },
    "dbDayIndex": 39,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 40,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=40&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db11b2fe381087e5973629a",
        "type": "workout",
        "name": "肩臂线条塑造 5级",
        "completed": false,
        "schema": "keep://plans/5db11b2fe381087e5973629a?selectWorkout=5db11b2fe381087e5973629a&source=suit&suitDayIndex=40&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11b2fe381087e5973629a&selectWorkout=5db11b2fe381087e5973629a",
        "hasPlus": true,
        "duration": 29,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "怎么选择最合适的蛋白粉？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551672101123_MTQlMjAlMjAlRTYl.mp4",
     "duration": 70,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/JUU2JTgwJThFJUU0JUI5JTg4JUU5JTgwJTg5JUU2JThCJUE5JUU2JTlDJTgwJUU1JTkwJTg4JUU5JTgwJTgyJUU3JTlBJTg0JUU4JTlCJThCJUU3JTk5JUJEJUU3JUIyJTg5JUVGJUJDJTlG_1548391351260.jpg"
    },
    "dbDayIndex": 40,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 41,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=41&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11796e381087e597320c5",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11796e381087e597320c5?selectWorkout=5db11796e381087e597320c5&source=suit&suitDayIndex=41&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11796e381087e597320c5&selectWorkout=5db11796e381087e597320c5",
        "hasPlus": true,
        "duration": 21,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "蛋白粉真的不能用热水冲吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551163306467_JUU4JTlCJThCJUU3.mp4",
     "duration": 74,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551163339621_JUU4JTlCJThCJUU3.jpg"
    },
    "dbDayIndex": 41,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
      {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 42,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=42&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db11a4ce381087e597352f7",
        "type": "workout",
        "name": "肩部塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db11a4ce381087e597352f7?selectWorkout=5db11a4ce381087e597352f7&source=suit&suitDayIndex=42&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11a4ce381087e597352f7&selectWorkout=5db11a4ce381087e597352f7",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "健身需要了解的运动补剂「肌酸」",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551170777219_JUU1JTgxJUE1JUU4.mp4",
     "duration": 92,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551174553612_JUU1JTgxJUE1JUU4.jpg"
    },
    "dbDayIndex": 42,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 43,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=43&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db116dee381087e5972e7d1",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db116dee381087e5972e7d1?selectWorkout=5db116dee381087e5972e7d1&source=suit&suitDayIndex=43&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db116dee381087e5972e7d1&selectWorkout=5db116dee381087e5972e7d1",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "健身需要了解的运动补剂「咖啡因」",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551170973383_JUU1JTgxJUE1JUU4.mp4",
     "duration": 62,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551170982360_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 43,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 44,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=44&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db11402e381087e5972a38c",
        "type": "workout",
        "name": "上肢胸背塑形 5级",
        "completed": false,
        "schema": "keep://plans/5db11402e381087e5972a38c?selectWorkout=5db11402e381087e5972a38c&source=suit&suitDayIndex=44&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11402e381087e5972a38c&selectWorkout=5db11402e381087e5972a38c",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "健身网红食物「橄榄油」",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551172387588_JUU1JTgxJUE1JUU4.mp4",
     "duration": 69,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551172395914_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 44,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 45,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=45&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11cd2e381087e5973885e",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11cd2e381087e5973885e?selectWorkout=5db11cd2e381087e5973885e&source=suit&suitDayIndex=45&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11cd2e381087e5973885e&selectWorkout=5db11cd2e381087e5973885e",
        "hasPlus": true,
        "duration": 28,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "健身网红食物「藜麦」",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551163523402_JUU1JTgxJUE1JUU4.mp4",
     "duration": 63,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551163553492_JUU1JTgxJUE1JUU4.jpg"
    },
    "dbDayIndex": 45,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 46,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=46&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bbc",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bbc?selectWorkout=5db113fae381087e59729bbc&source=suit&suitDayIndex=46&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bbc&selectWorkout=5db113fae381087e59729bbc",
        "hasPlus": true,
        "duration": 20,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "健身网红食物「羽衣甘蓝」",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551163681943_JUU1JTgxJUE1JUU4.mp4",
     "duration": 76,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551163707160_JUU1JTgxJUE1JUU4.jpg"
    },
    "dbDayIndex": 46,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 47,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=47&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db116dee381087e5972e821",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db116dee381087e5972e821?selectWorkout=5db116dee381087e5972e821&source=suit&suitDayIndex=47&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db116dee381087e5972e821&selectWorkout=5db116dee381087e5972e821",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "健身网红食物「牛油果」",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551672617979_MTklMjAlMjAlRTUl.mp4",
     "duration": 75,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/JUU1JTgxJUE1JUU4JUJBJUFCJUU3JUJEJTkxJUU3JUJBJUEyJUU5JUEzJTlGJUU3JTg5JUE5JUUyJTgwJTk0JUUyJTgwJTk0JUU3JTg5JTlCJUU2JUIyJUI5JUU2JTlFJTlDMw==_1548396338262.jpg"
    },
    "dbDayIndex": 47,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 48,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=48&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bfd",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bfd?selectWorkout=5db113fae381087e59729bfd&source=suit&suitDayIndex=48&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bfd&selectWorkout=5db113fae381087e59729bfd",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "蛋白质一次吃太多，会不会吸收不了？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551170528792_JUU4JTlCJThCJUU3.mp4",
     "duration": 71,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551170556801_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 48,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
      {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 49,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=49&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11796e381087e597320da",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11796e381087e597320da?selectWorkout=5db11796e381087e597320da&source=suit&suitDayIndex=49&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11796e381087e597320da&selectWorkout=5db11796e381087e597320da",
        "hasPlus": true,
        "duration": 21,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "吃有添加剂的食品对身体有害吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551672746691_MTklRTUlOTAlODMl.mp4",
     "duration": 76,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/JUU1JTkwJTgzJUU2JTlDJTg5JUU2JUI3JUJCJUU1JThBJUEwJUU1JTg5JTgyJUU3JTlBJTg0JUU5JUEzJTlGJUU1JTkzJTgxJUU1JUFGJUI5JUU4JUJBJUFCJUU0JUJEJTkzJUU2JTlDJTg5JUU1JUFFJUIzJUU1JTkwJTk3JUVGJUJDJTlGMg==_1548387184985.jpg"
    },
    "dbDayIndex": 49,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 50,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=50&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bf9",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bf9?selectWorkout=5db113fae381087e59729bf9&source=suit&suitDayIndex=50&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bf9&selectWorkout=5db113fae381087e59729bf9",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "吃起来不咸，吃的盐就少吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551672593835_MTglRTUlOTAlODMl.mp4",
     "duration": 69,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/JUU1JTkwJTgzJUU3JTlBJTg0JUU0JUI4JThEJUU1JTkyJUI4JUVGJUJDJThDJUU1JUIwJUIxJUU2JTk4JUFGJUU1JTkwJTgzJUU3JTlBJTg0JUU3JTlCJTkwJUU1JUIwJTkxJUU1JTkwJTk3JUVGJUJDJTlGMg==_1548387132833.jpg"
    },
    "dbDayIndex": 50,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 51,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=51&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db11730e381087e5972f7ab",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db11730e381087e5972f7ab?selectWorkout=5db11730e381087e5972f7ab&source=suit&suitDayIndex=51&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11730e381087e5972f7ab&selectWorkout=5db11730e381087e5972f7ab",
        "hasPlus": true,
        "duration": 30,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "健身可以喝酒吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551163754491_JUU1JTgxJUE1JUU4.mp4",
     "duration": 70,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551163779210_JUU1JUEyJTlFJUU4.jpg"
    },
    "dbDayIndex": 51,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 52,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=52&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bf2",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bf2?selectWorkout=5db113fae381087e59729bf2&source=suit&suitDayIndex=52&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bf2&selectWorkout=5db113fae381087e59729bf2",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "黑芝麻能防脱发吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551167124599_JUU5JUJCJTkxJUU4.mp4",
     "duration": 70,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551167162807_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 52,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 53,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=53&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11799e381087e5973289c",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11799e381087e5973289c?selectWorkout=5db11799e381087e5973289c&source=suit&suitDayIndex=53&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11799e381087e5973289c&selectWorkout=5db11799e381087e5973289c",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "睡眠不好影响训练效果吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551673538126_MjglMjAlMjAlRTcl.mp4",
     "duration": 73,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/睡眠不好影响训练效果吗？3jpg_1545724534238.jpg"
    },
    "dbDayIndex": 53,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 54,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=54&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bbf",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bbf?selectWorkout=5db113fae381087e59729bbf&source=suit&suitDayIndex=54&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bbf&selectWorkout=5db113fae381087e59729bbf",
        "hasPlus": true,
        "duration": 20,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "越练越没精神，我是怎么了？",
     "videoUrl": "https://v1.keepcdn.com/cms_static/video/D7_converted_1541320634796.mp4",
     "duration": 67,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/越练越没精神，我是怎么了3 _1542355065121.png"
    },
    "dbDayIndex": 54,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 55,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=55&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db116b3e381087e5972e002",
        "type": "workout",
        "name": "下肢力量提升 5级",
        "completed": false,
        "schema": "keep://plans/5db116b3e381087e5972e002?selectWorkout=5db116b3e381087e5972e002&source=suit&suitDayIndex=55&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db116b3e381087e5972e002&selectWorkout=5db116b3e381087e5972e002",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "重量越大，训练效果越好吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551169773690_JUU5JTg3JThEJUU5.mp4",
     "duration": 62,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551169785535_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 55,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
      {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 56,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=56&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bf8",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bf8?selectWorkout=5db113fae381087e59729bf8&source=suit&suitDayIndex=56&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bf8&selectWorkout=5db113fae381087e59729bf8",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "每组训练间多歇一会，会影响增肌效果吗？",
     "videoUrl": "https://v1.keepcdn.com/cms_static/video/2019/9/11/1568174151262_MTU2MDkyNzU4NTk5.mp4",
     "duration": 55,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/6/19/1560928175022_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 56,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 57,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=57&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11799e381087e59732869",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11799e381087e59732869?selectWorkout=5db11799e381087e59732869&source=suit&suitDayIndex=57&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11799e381087e59732869&selectWorkout=5db11799e381087e59732869",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "为什么塑形增肌也要练习心肺？",
     "videoUrl": "https://v1.keepcdn.com/cms_static/video/2019/9/11/1568174264151_MTU2MDkyODI5MzM1.mp4",
     "duration": 58,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/6/19/1560928340200_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 57,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 58,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=58&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bb3",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bb3?selectWorkout=5db113fae381087e59729bb3&source=suit&suitDayIndex=58&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bb3&selectWorkout=5db113fae381087e59729bb3",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "为什么训练计划里，不同部位的训练强度不同？",
     "videoUrl": "https://v1.keepcdn.com/cms_static/video/2019/9/11/1568174374695_MTU2MDkyODM2OTI1.mp4",
     "duration": 63,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/6/19/1560928401604_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 58,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 59,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=59&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db11730e381087e5972f785",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db11730e381087e5972f785?selectWorkout=5db11730e381087e5972f785&source=suit&suitDayIndex=59&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11730e381087e5972f785&selectWorkout=5db11730e381087e5972f785",
        "hasPlus": true,
        "duration": 29,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "能不能只练上半身？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/6/19/1560928530355_JUU4JTgzJUJEJUU0.mp4",
     "duration": 67,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/6/19/1560928552044_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 59,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 60,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=60&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db11b2fe381087e5973629a",
        "type": "workout",
        "name": "肩臂线条塑造 5级",
        "completed": false,
        "schema": "keep://plans/5db11b2fe381087e5973629a?selectWorkout=5db11b2fe381087e5973629a&source=suit&suitDayIndex=60&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11b2fe381087e5973629a&selectWorkout=5db11b2fe381087e5973629a",
        "hasPlus": true,
        "duration": 29,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "促睾酮补剂能帮助增肌吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551170174328_JUU0JUJGJTgzJUU3.mp4",
     "duration": 65,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551170198924_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 60,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 61,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=61&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11796e381087e597320c5",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11796e381087e597320c5?selectWorkout=5db11796e381087e597320c5&source=suit&suitDayIndex=61&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11796e381087e597320c5&selectWorkout=5db11796e381087e597320c5",
        "hasPlus": true,
        "duration": 21,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "增肌时，加餐吃什么食物好？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551162731393_JUU1JUEyJTlFJUU4.mp4",
     "duration": 69,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551162761273_JUU1JUEyJTlFJUU4.jpg"
    },
    "dbDayIndex": 61,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 62,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=62&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db11a4ce381087e597352f7",
        "type": "workout",
        "name": "肩部塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db11a4ce381087e597352f7?selectWorkout=5db11a4ce381087e597352f7&source=suit&suitDayIndex=62&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11a4ce381087e597352f7&selectWorkout=5db11a4ce381087e597352f7",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "为什么健身人士很少吃猪肉？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551170381147_JUU0JUI4JUJBJUU0.mp4",
     "duration": 77,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551170473721_JUU0JUI4JUJBJUU0.png"
    },
    "dbDayIndex": 62,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
      {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 63,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=63&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db116dee381087e5972e7d1",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db116dee381087e5972e7d1?selectWorkout=5db116dee381087e5972e7d1&source=suit&suitDayIndex=63&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db116dee381087e5972e7d1&selectWorkout=5db116dee381087e5972e7d1",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "香肠、火腿肠等肉类，适合经常吃吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551165527801_JUU5JUE2JTk5JUU4.mp4",
     "duration": 68,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551165554121_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 63,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 64,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=64&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db11402e381087e5972a38c",
        "type": "workout",
        "name": "上肢胸背塑形 5级",
        "completed": false,
        "schema": "keep://plans/5db11402e381087e5972a38c?selectWorkout=5db11402e381087e5972a38c&source=suit&suitDayIndex=64&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11402e381087e5972a38c&selectWorkout=5db11402e381087e5972a38c",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "海鱼比淡水鱼更有营养吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551165648290_JUU2JUI1JUI3JUU5.mp4",
     "duration": 82,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551165679119_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 64,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 65,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=65&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11cd2e381087e5973885e",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11cd2e381087e5973885e?selectWorkout=5db11cd2e381087e5973885e&source=suit&suitDayIndex=65&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11cd2e381087e5973885e&selectWorkout=5db11cd2e381087e5973885e",
        "hasPlus": true,
        "duration": 28,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "微波加热食物时，需要注意什么？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551166430842_JUU1JUJFJUFFJUU2.mp4",
     "duration": 88,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551166444156_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 65,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 66,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=66&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bbc",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bbc?selectWorkout=5db113fae381087e59729bbc&source=suit&suitDayIndex=66&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bbc&selectWorkout=5db113fae381087e59729bbc",
        "hasPlus": true,
        "duration": 20,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "蛋白质吃多了会伤肾吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551170591292_JUU4JTlCJThCJUU3.mp4",
     "duration": 83,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551175072188_JUU4JTlCJThCJUU3.png"
    },
    "dbDayIndex": 66,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 67,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=67&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db116dee381087e5972e821",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db116dee381087e5972e821?selectWorkout=5db116dee381087e5972e821&source=suit&suitDayIndex=67&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db116dee381087e5972e821&selectWorkout=5db116dee381087e5972e821",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "喝蛋白粉长痘怎么办？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551163366227_JUU1JTk2JTlEJUU4.mp4",
     "duration": 71,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551163449773_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 67,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 68,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=68&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bfd",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bfd?selectWorkout=5db113fae381087e59729bfd&source=suit&suitDayIndex=68&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bfd&selectWorkout=5db113fae381087e59729bfd",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "健身需要了解的运动补剂「氮泵」",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551171285916_JUU1JTgxJUE1JUU4.mp4",
     "duration": 77,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551171292219_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 68,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 69,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=69&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11796e381087e597320da",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11796e381087e597320da?selectWorkout=5db11796e381087e597320da&source=suit&suitDayIndex=69&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11796e381087e597320da&selectWorkout=5db11796e381087e597320da",
        "hasPlus": true,
        "duration": 21,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "健身需要了解的运动补剂「增肌粉」",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551171746898_JUU1JTgxJUE1JUU4.mp4",
     "duration": 67,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551171752233_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 69,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
      {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 70,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=70&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bf9",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bf9?selectWorkout=5db113fae381087e59729bf9&source=suit&suitDayIndex=70&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bf9&selectWorkout=5db113fae381087e59729bf9",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "可乐真的对男性不友好吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551171352949_JUU1JThGJUFGJUU0.mp4",
     "duration": 62,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551171364592_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 70,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 71,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=71&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db11730e381087e5972f7ab",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db11730e381087e5972f7ab?selectWorkout=5db11730e381087e5972f7ab&source=suit&suitDayIndex=71&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11730e381087e5972f7ab&selectWorkout=5db11730e381087e5972f7ab",
        "hasPlus": true,
        "duration": 30,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "为什么这周开始，训练强度明显增加了？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/6/19/1560929794213_JUU0JUI4JUJBJUU0.mp4",
     "duration": 66,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/6/19/1560929805315_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 71,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 72,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=72&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bf2",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bf2?selectWorkout=5db113fae381087e59729bf2&source=suit&suitDayIndex=72&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bf2&selectWorkout=5db113fae381087e59729bf2",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "今天没空练，明天需要补练吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/6/19/1560929966022_JUU0JUJCJThBJUU1.mp4",
     "duration": 52,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/6/19/1560929980875_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 72,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 73,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=73&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11799e381087e5973289c",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11799e381087e5973289c?selectWorkout=5db11799e381087e5973289c&source=suit&suitDayIndex=73&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11799e381087e5973289c&selectWorkout=5db11799e381087e5973289c",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "体重和围度很久都不变，应该怎么办？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/6/19/1560930193033_JUU0JUJEJTkzJUU5.mp4",
     "duration": 62,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/6/19/1560930214369_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 73,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 74,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=74&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bbf",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bbf?selectWorkout=5db113fae381087e59729bbf&source=suit&suitDayIndex=74&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bbf&selectWorkout=5db113fae381087e59729bbf",
        "hasPlus": true,
        "duration": 20,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "健身需要了解的运动补剂「支链氨基酸」",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551172013378_JUU1JTgxJUE1JUU4.mp4",
     "duration": 76,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551172030670_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 74,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 75,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=75&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db116b3e381087e5972e002",
        "type": "workout",
        "name": "下肢力量提升 5级",
        "completed": false,
        "schema": "keep://plans/5db116b3e381087e5972e002?selectWorkout=5db116b3e381087e5972e002&source=suit&suitDayIndex=75&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db116b3e381087e5972e002&selectWorkout=5db116b3e381087e5972e002",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "健身需要了解的运动补剂「谷氨酰胺」",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/2/26/1551172078441_JUU1JTgxJUE1JUU4.mp4",
     "duration": 84,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/2/26/1551172086757_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 75,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 76,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=76&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bf8",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bf8?selectWorkout=5db113fae381087e59729bf8&source=suit&suitDayIndex=76&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bf8&selectWorkout=5db113fae381087e59729bf8",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "训练后补充蛋白，吸收效率最好？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/3/4/1551673113409_MjMlMjAlMjAlRTgl.mp4",
     "duration": 75,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/训练后补充蛋白，吸收效率最好？2_1545724308171.jpg"
    },
    "dbDayIndex": 76,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
      {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 77,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=77&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11799e381087e59732869",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11799e381087e59732869?selectWorkout=5db11799e381087e59732869&source=suit&suitDayIndex=77&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11799e381087e59732869&selectWorkout=5db11799e381087e59732869",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "运动会导致脱发吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/6/19/1560930427836_JUU4JUJGJTkwJUU1.mp4",
     "duration": 61,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/6/19/1560930431998_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 77,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 78,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=78&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db113fae381087e59729bb3",
        "type": "workout",
        "name": "上肢力量综合提升 5级",
        "completed": false,
        "schema": "keep://plans/5db113fae381087e59729bb3?selectWorkout=5db113fae381087e59729bb3&source=suit&suitDayIndex=78&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db113fae381087e59729bb3&selectWorkout=5db113fae381087e59729bb3",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "每次只训练不到 1 小时，能有效果吗？",
     "videoUrl": "https://v1.keepcdn.com/cms_static/video/2019/9/11/1568174695644_MTU2MDkzMDQ5Nzc4.mp4",
     "duration": 60,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/6/19/1560930513101_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 78,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 79,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=79&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db11730e381087e5972f785",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db11730e381087e5972f785?selectWorkout=5db11730e381087e5972f785&source=suit&suitDayIndex=79&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11730e381087e5972f785&selectWorkout=5db11730e381087e5972f785",
        "hasPlus": true,
        "duration": 29,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "已经训练几个月，为什么还是不能轻松完成训练？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/6/19/1560930776071_JUU1JUI3JUIyJUU3.mp4",
     "duration": 68,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/6/19/1560930783655_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 79,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 80,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=80&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db11b2fe381087e5973629a",
        "type": "workout",
        "name": "肩臂线条塑造 5级",
        "completed": false,
        "schema": "keep://plans/5db11b2fe381087e5973629a?selectWorkout=5db11b2fe381087e5973629a&source=suit&suitDayIndex=80&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11b2fe381087e5973629a&selectWorkout=5db11b2fe381087e5973629a",
        "hasPlus": true,
        "duration": 29,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "想要穿衣更好看，要注重哪些部位的训练？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/6/19/1560931439499_JUU2JTgzJUIzJUU4.mp4",
     "duration": 58,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/6/19/1560931462956_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 80,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 81,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576230425_750x700.jpg",
        "id": "5b88bc3ba29e3409b394eb89",
        "type": "workout",
        "name": "整体热身",
        "completed": false,
        "schema": "keep://plans/5be2962aa29e347112ee4440?selectWorkout=5b88bc3ba29e3409b394eb89&source=suit&suitDayIndex=81&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be2962aa29e347112ee4440&selectWorkout=5b88bc3ba29e3409b394eb89",
        "hasPlus": true,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103658684_750x700.jpg",
        "id": "5db11796e381087e597320c5",
        "type": "workout",
        "name": "核心力量强化 5级",
        "completed": false,
        "schema": "keep://plans/5db11796e381087e597320c5?selectWorkout=5db11796e381087e597320c5&source=suit&suitDayIndex=81&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11796e381087e597320c5&selectWorkout=5db11796e381087e597320c5",
        "hasPlus": true,
        "duration": 21,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "运动出汗能治感冒吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/6/19/1560932361300_JUU4JUJGJTkwJUU1.mp4",
     "duration": 86,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/6/19/1560932366979_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 81,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 82,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576034304_750x700.jpg",
        "id": "5b86005ad734a2093f9043b4",
        "type": "workout",
        "name": "上肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be29589d734a26a885ac67c?selectWorkout=5b86005ad734a2093f9043b4&source=suit&suitDayIndex=82&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be29589d734a26a885ac67c&selectWorkout=5b86005ad734a2093f9043b4",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103705715_750x700.png",
        "id": "5db11a4ce381087e597352f7",
        "type": "workout",
        "name": "肩部塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db11a4ce381087e597352f7?selectWorkout=5db11a4ce381087e597352f7&source=suit&suitDayIndex=82&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db11a4ce381087e597352f7&selectWorkout=5db11a4ce381087e597352f7",
        "hasPlus": true,
        "duration": 18,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "运动会让寿命变短吗？",
     "videoUrl": "https://static1.keepcdn.com/cms_static/video/2019/6/19/1560932754011_JUU4JUJGJTkwJUU1.mp4",
     "duration": 78,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/6/19/1560932758167_JUUyJTlDJTk0JUVG.png"
    },
    "dbDayIndex": 82,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   },
   {
    "leave": false,
    "leaveEndDayIndex": null,
    "dayIndex": 83,
    "tasks": [
     {
      "title": "完成 2 个训练",
      "coachGuide": null,
      "todoList": [
       {
        "picture": "https://static1.keepcdn.com/2018/11/07/15/1541576128927_750x700.jpg",
        "id": "5b88baf8d734a219f8de0bda",
        "type": "workout",
        "name": "下肢关节热身",
        "completed": false,
        "schema": "keep://plans/5be295cdd734a26a885ac68a?selectWorkout=5b88baf8d734a219f8de0bda&source=suit&suitDayIndex=83&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5be295cdd734a26a885ac68a&selectWorkout=5b88baf8d734a219f8de0bda",
        "hasPlus": false,
        "duration": 2,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       },
       {
        "picture": "https://static1.keepcdn.com/2018/12/18/11/1545103775217_750x700.png",
        "id": "5db116dee381087e5972e7d1",
        "type": "workout",
        "name": "下肢综合塑形训练 5级",
        "completed": false,
        "schema": "keep://plans/5db116dee381087e5972e7d1?selectWorkout=5db116dee381087e5972e7d1&source=suit&suitDayIndex=83&suitId=5e7de69eb1136f5caf326441",
        "previewSchema": "keep://training/step/list?planId=5db116dee381087e5972e7d1&selectWorkout=5db116dee381087e5972e7d1",
        "hasPlus": true,
        "duration": 19,
        "equipments": [],
        "canBeReplaced": false,
        "category": null
       }
      ]
     }
    ],
    "addition": null,
    "suitTip": {
     "subTitle": "每日训练课堂",
     "title": "为什么我不重，但看起来也不瘦？",
     "videoUrl": "https://v1.keepcdn.com/cms_static/video/FDAY_1_converted_1541414661788.mp4",
     "duration": 74,
     "playMode": "across",
     "cover": "https://static1.keepcdn.com/cms_static/picture/2019/3/22/1553226842778_JUU0JUI4JUJBJUU0.png"
    },
    "dbDayIndex": 83,
    "adjustEntrance": null,
    "coachGuideInfo": null,
    "dietInfo": null
   }
  ],
  "lockFollowTraining": true
 },
 "errorCode": 0,
 "text": ""
}
}
body = JSON.stringify(obj);
$done({body});
