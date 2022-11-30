/*
Unlocks by Cuttlefish 公众号：墨鱼手记
*/
var obj = JSON.parse($response.body);

obj= {
 "error": 0,
 "data": {
  "is_valid": true,
  "may_expire": false,
  "is_offer_eligible": true,
  "in_app": {
   "com.beHappy.Productive.1y_7dt_sub00031.": {
    "is_valid": true,
    "cancelled": false,
    "may_expire": true,
    "is_trial": true,
    "is_intro": false,
    "transaction_id": "20000618719284",
    "cancel_reason": "user",
    "purchase_date_ms": "1572250822000",
    "expired": false,
    "expires_date_ms": "4096862781000",
    "remaining_time_ms": "2522880000000"
   }
  },
  "consumable_inapp": [],
  "hash": "1a14a9df5944c5aa00a02783a8c5d2a4"
 }
};

$done({body: JSON.stringify(obj)});

//
