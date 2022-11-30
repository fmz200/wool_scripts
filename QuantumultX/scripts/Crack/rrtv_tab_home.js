let body = $response.body                                                                                                            
body = JSON.parse(body)

delete body.data.bannerTop;
for(i = 0;i<body.data.sections.length;i++)
{
if(body.data.sections[i].id==2717)
{
delete body.data.sections[i];
}

}

body = JSON.stringify(body)                                                                                                          
$done({ body })