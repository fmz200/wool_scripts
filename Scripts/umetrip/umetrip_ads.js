/**
 * 航旅纵横
 */
const version = 'V1.0.1';
const ua = $request.headers.rpid || $request.headers.Rpid;
ua.includes("1000002") || ua.includes("1000019") ? $done({status: "HTTP/1.1 404 Not Found"}) : $done({});
