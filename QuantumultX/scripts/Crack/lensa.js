var obj = JSON.parse($response.body); 
obj['is_valid'] = true;
obj['is_trial'] = true;
obj['expiration_date'] = '2970-01-01T00:00:00Z';
$done({body: JSON.stringify(obj)});
