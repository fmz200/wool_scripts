/**
 * @author fmz200
 * @function Reddit过滤推广，关NSFW提示
 * @date 2024-01-2 17:01:00
 * @quote xream
 */

let body;
try {
  body = JSON.parse($response.body.replace(/"isNsfw":true/g, '"isNsfw":false'))
  if (body.data?.children?.commentsPageAds) {
    body.data.children.commentsPageAds = []
  }
  for (const [k, v] of Object.entries(body.data)) {
    if (v?.elements?.edges) {
      body.data[k].elements.edges = v.elements.edges.filter(
        i =>
          !['AdPost'].includes(i?.node?.__typename) &&
          !i?.node?.cells?.some(j => j?.__typename === 'AdMetadataCell') &&
          !i?.node?.adPayload
      );
    }
  }

} catch (e) {
  console.log(e);
} finally {
  $done(body ? {body: JSON.stringify(body)} : {});
}