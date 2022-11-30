let obj = JSON.parse($response.body);
obj = {
  "originalApplicationVersion": "2.2.4.2936",
  "dateReceiptCreation": 1582695984000,
  "inapps": [],
  "bundleIdentifier": "com.myscript.nebo",
  "bundleVersion": "2.5.0.5032"
};
$done({body: JSON.stringify(obj)});
