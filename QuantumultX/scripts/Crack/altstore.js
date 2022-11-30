let obj = JSON.parse($response.body);
obj ={
        "data": {
            "attributes": {
                "first_name": "Lang",
                "full_name": "Lang Khach"
            },
            "id": "30618536",
            "relationships": {
                "memberships": {
                    "data": [{
                        "id": "e3a5c718-d930-4b92-a8b9-677f4699c9a4",
                        "type": "tier"
                    }]
                }
            },
            "type": "member"
        },
        "included": [{
            "attributes": {
                "full_name": "Lang Khach",
                "patron_status": "active_patron"
            },
            "id": "e3a5c718-d930-4b92-a8b9-677f4699c9a4",
            "type": "member"
        }],
        "links": {
            "self":"https://www.patreon.com/api/oauth2/v2/user/30618536"
        }
    }
$done({body: JSON.stringify(obj)});