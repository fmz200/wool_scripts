/**
 * @author fmz200
 * @date 2024-01-22 21:03:00
 * @function 部分APP收集用户信息，将上传的URL和body内容换成无效内容
 */
let req_path = $request.path;

if (req_path && req_path.includes("?")) {
  req_path = req_path.substring(0, req_path.index("?"));
}

// 还可以修改headers

$done({path: req_path});
