var body = $response.body
    .replace(/\"member_type\":0/, "\"member_type\":2")
    .replace(/\"status\":0/, "\"status\":2")
    .replace(/\"expired_at_str\":\"\"/, "\"expired_at_str\":\"2099-12-31\"");
$done({ body });