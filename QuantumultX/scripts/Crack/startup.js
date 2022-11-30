




if (/^https?:\/\/api\.m\.jd\.com\/api\?functionId=delivery_show/.test($request.url)) {
    let obj=JSON.parse($response.body);
    obj.data.materialList.startTime=3667476800000;
    obj.data.materialList.endTime  =3667908800000;
    $done({body:JSON.stringify(obj)});
}
