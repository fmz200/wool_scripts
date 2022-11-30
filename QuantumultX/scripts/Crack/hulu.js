/*
Unlocks by Cuttlefish 公众号：墨鱼手记
*/

var body = $response.body.replace(/"IsVip":0/g, "IsVip":0);
$done({ body });
var body = $response.body;
var url = $request.url;
const path1 = "api";
if (url.indexOf(path1) != -1) 
{
	let obj = JSON.parse(body);
	if(obj.hasOwnProperty("result"))
	{
		if(obj.result.hasOwnProperty("resource"))
		{
			for (i in obj.result.resource.items) 
			{
				if(obj.result.resource.items[i].hasOwnProperty("articles"))
				{
					for (j in obj.result.resource.items[i].articles)
					{
						obj.result.resource.items[i].articles[j].isFree = "1";
					}
				}
			}
		}
		obj.result.isFree = "1";
		obj.result.isBuy = "1";
		obj.result.userRight = "1";
		if(obj.result.hasOwnProperty("user"))
		{
		obj.result.user.isBuy = "1";
		obj.result.user.userRight = "1";
		}
	}
	body = JSON.stringify(obj);
 }
$done({body});
