let obj = JSON.parse($response.body);

obj.mobileProfile.profileStatus = 'PROFILE_AVAILABLE';

$done({body: JSON.stringify(obj)});
