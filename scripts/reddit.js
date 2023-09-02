/**
 * Reddit 过滤推广, 关 subreddit 的 NSFW 提示
 *
 * date=2023.07.22 18:50
 */

const body = JSON.parse($response.body);
let modified
if (body.data) {
  modified = true
  if (body.data.subredditInfoByName && body.data.subredditInfoByName.elements && body.data.subredditInfoByName.elements.edges) {
    body.data.subredditInfoByName.elements.edges = body.data.subredditInfoByName.elements.edges.filter(i => i && i.node && (i.node.__typename !== "AdPost"))
  } else if (body.data.home && body.data.home.elements && body.data.home.elements.edges) {
    body.data.home.elements.edges = body.data.home.elements.edges.filter(i => i && i.node && (i.node.__typename !== "AdPost"))
  } else if (body.data.subredditsInfoByNames) {
    body.data.subredditsInfoByNames = body.data.subredditsInfoByNames.map(i => ({...i, isNsfw: false}))
  } else {
    modified = false
  }
}
$done(modified ? {body: JSON.stringify(body)} : {})