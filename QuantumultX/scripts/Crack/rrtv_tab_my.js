let body = $response.body                                                                                                            
body = JSON.parse(body)                                                                                                              
body['data']['sections'] = [                                                                                                         
            {                                                                                                                        
              "id" : 2541,                                                                                                           
              "sectionType" : "MAGIC_CUBE",                                                                                          
              "displayTitle" : "1",                                                                                                  
              "startTime" : null,                                                                                                    
              "position" : 23,                                                                                                       
              "display" : "SCROLL",                                                                                                  
              "moreText" : "",                                                                                                       
              "sectionContents" : [                                                                                                  
                {                                                                                                                    
                  "feeMode" : null,                                                                                                  
                  "pictureHeight" : null,                                                                                            
                  "targetId" : "rrspjump://webview?url=http%3A%2F%2Fmobile.rr.tv%2FappWeb%2F%23%2FbugList",                          
                  "id" : 34,                                                                                                         
                  "pictureWidth" : null,                                                                                             
                  "title" : "公眾號",                                                                                              
                  "targetType" : "H5",                                                                                               
                  "sectionId" : 2541,                                                                                                
                  "orderNum" : 1,                                                                                                    
                  "subTitle" : null,                                                                                                 
                  "icon" : "http://img.rr.tv/cover/20210201/o_1612169512400.png"                                                     
                },                                                                                                                   
                {                                                                                                                    
                  "feeMode" : null,                                                                                                  
                  "pictureHeight" : null,                                                                                            
                  "targetId" : "rrspjump://webview?url=http%3A%2F%2Fmobile.rr.tv%2Fmission%2F%23%2Fachievement%2Fcenter",            
                  "id" : 35,                                                                                                         
                  "pictureWidth" : null,                                                                                             
                  "title" : "墨魚手記",                                                                                              
                  "targetType" : "H5",                                                                                               
                  "sectionId" : 2541,                                                                                                
                  "orderNum" : 2,                                                                                                    
                  "subTitle" : null,                                                                                                 
                  "icon" : "http://img.rr.tv/cover/20210201/o_1612169790308.png"                                                     
                },                                                                                                                   
              ],                                                                                                                     
              "endTime" : null,                                                                                                      
              "targetType" : null,                                                                                                   
              "sequence" : 3,                                                                                                        
              "name" : "其他",                                                                                                       
              "targetId" : "rrspjump://empty"                                                                                        
            }                                                                                                                                                                                                                                            
]                                                                                                                                    
body = JSON.stringify(body)                                                                                                          
$done({ body })