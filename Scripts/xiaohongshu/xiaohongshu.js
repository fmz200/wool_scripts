// 引用地址：https://raw.githubusercontent.com/fmz200/wool_scripts/refs/heads/main/Scripts/xiaohongshu/xiaohongshu.js

/**
 * @author fmz200
 * @function 小红书去广告、净化、解除下载限制、画质增强等
 * @date 2025-06-01
 * @quote @RuCu6
 */

const $ = new Env('小红书');
const url = $request.url;
let rsp_body = $response.body;

// 如果没有响应体，直接结束
if (!rsp_body) {
  $done({});
}

let obj;
try {
  obj = JSON.parse(rsp_body);
} catch (e) {
  console.log(`解析 JSON 失败：${e}. 返回原始 Body`);
  $done({ body: rsp_body });
}

// 1.—— 搜索相关：去除广告/热搜/提示/趋势/非“笔记”类型 —— 

if (url.includes("/search/banner_list")) {
  if (obj.data) obj.data = {};
}

if (url.includes("/search/hot_list")) {
  if (Array.isArray(obj.data?.items)) {
    obj.data.items = [];
  }
}

if (url.includes("/search/hint")) {
  if (Array.isArray(obj.data?.hint_words)) {
    obj.data.hint_words = [];
  }
}

if (url.includes("/search/trending?")) {
  if (obj.data) {
    obj.data.queries = [];
    obj.data.hint_word = {};
  }
}

if (url.includes("/search/notes?")) {
  if (Array.isArray(obj.data?.items)) {
    obj.data.items = obj.data.items.filter(i => i?.model_type === "note");
  }
}

// 2.—— 系统配置 & 启动页广告 —— 

if (url.includes("/system_service/config?")) {
  if (obj.data) {
    const removeKeys = ["app_theme", "loading_img", "splash", "store"];
    for (let key of removeKeys) {
      delete obj.data[key];
    }
  }
}

if (url.includes("/system_service/splash_config")) {
  if (Array.isArray(obj.data?.ads_groups)) {
    for (let grp of obj.data.ads_groups) {
      grp.start_time = 3818332800; // 2090-12-31 00:00:00
      grp.end_time = 3818419199;   // 2090-12-31 23:59:59
      if (Array.isArray(grp.ads)) {
        for (let ad of grp.ads) {
          ad.start_time = 3818332800;
          ad.end_time = 3818419199;
        }
      }
    }
  }
}

// 3.—— 在笔记详情页也缓存 images_list，以增加“在详情页直接保存”时的命中率 —— 

if (url.includes("/note/detail")) {
  try {
    // 详情页结构通常在 obj.data.images_list
    const detailImages = obj.data?.images_list;
    if (Array.isArray(detailImages) && detailImages.length > 0) {
      $.setdata(JSON.stringify(detailImages), "fmz200.xiaohongshu.feed.rsp");
      console.log(`详情页缓存：共 ${detailImages.length} 张图片/Live 图`);
    }
  } catch (e) {
    console.log(`在 note/detail 缓存时出错：${e}`);
  }
}

// 4.—— Feed 列表页缓存所有 note 的 images_list —— 

if (url.includes("/note/imagefeed?") || url.includes("/note/feed?")) {
  try {
    const firstPage = obj.data;
    if (Array.isArray(firstPage) && firstPage.length > 0) {
      const noteList = firstPage[0]?.note_list;
      if (Array.isArray(noteList) && noteList.length > 0) {
        // 4.1) 去水印 + 加下载按钮 + 画质增强
        for (let noteItem of noteList) {
          // 允许保存 & 去水印
          if (noteItem?.media_save_config) {
            noteItem.media_save_config.disable_save = false;
            noteItem.media_save_config.disable_watermark = true;
            noteItem.media_save_config.disable_weibo_cover = true;
          }
          // 强制插入“视频下载”按钮
          if (Array.isArray(noteItem.share_info?.function_entries)) {
            const firstEntry = noteItem.share_info.function_entries[0];
            if (firstEntry?.type !== "video_download") {
              noteItem.share_info.function_entries.unshift({ type: "video_download" });
            }
          }
        }
        // 4.2) 合并本页所有 note 的 images_list 到一个大数组
        let allImages = [];
        for (let noteItem of noteList) {
          const imagesArr = noteItem?.images_list;
          if (Array.isArray(imagesArr) && imagesArr.length > 0) {
            // 缓存前先强制画质增强
            try {
              noteItem.images_list = imageEnhance(JSON.stringify(imagesArr));
            } catch (e) {
              console.log(`imageEnhance 画质增强失败：${e}`);
            }
            // 合并原始列表
            allImages = allImages.concat(imagesArr);
          }
        }
        if (allImages.length > 0) {
          $.setdata(JSON.stringify(allImages), "fmz200.xiaohongshu.feed.rsp");
          console.log(`Feed 页缓存：共 ${allImages.length} 张图片/Live 图`);
        }
      }
    }
  } catch (e) {
    console.log(`在 note/imagefeed? 缓存时出错：${e}`);
  }
}

// 5.—— live_photo 保存：根据缓存结果替换 URL —— 

if (url.includes("/note/live_photo/save")) {
  console.log('触发 live_photo/save，原 body：' + rsp_body);
  const rawCache = $.getdata("fmz200.xiaohongshu.feed.rsp") || "";
  if (!rawCache) {
    console.log('保存失败：缓存为空');
    $done({ body: rsp_body });
  }
  let cacheArr;
  try {
    cacheArr = JSON.parse(rawCache);
  } catch (e) {
    console.log(`缓存 JSON 解析失败：${e}`);
    $done({ body: rsp_body });
  }
  // 5.1) 从缓存中提取所有带 live_photo_file_id 的记录
  const liveItems = [];
  for (let imgObj of cacheArr) {
    const fid = imgObj?.live_photo_file_id;
    const h265url = imgObj?.live_photo?.media?.stream?.h265?.[0]?.master_url;
    const vid = imgObj?.live_photo?.media?.video_id;
    if (fid && vid && h265url) {
      liveItems.push({ file_id: fid, video_id: vid, url: h265url });
    }
  }
  if (liveItems.length === 0) {
    console.log('live 图保存为静态照片：缓存中无 live_photo_file_id 或结构发生变化');
    $done({ body: rsp_body });
  }
  // 5.2) 若返回体里包含 data.datas，则针对每个 file_id 做替换；否则新建响应
  if (Array.isArray(obj.data?.datas) && obj.data.datas.length > 0) {
    let matched = false;
    for (let respItem of obj.data.datas) {
      const fid = respItem?.file_id;
      const match = liveItems.find(x => x.file_id === fid);
      if (match) {
        // 只替换有匹配的条目
        respItem.url = match.url;
        respItem.author = "@fmz200";
        matched = true;
      }
    }
    if (!matched) {
      console.log('保存失败：未找到与返回体中 file_id 对应的 live URL');
      $done({ body: rsp_body });
    }
  } else {
    // 5.3) 如果服务器根本没返回 datas，就自己构造一个成功体
    obj = { code: 0, success: true, msg: "成功", data: { datas: liveItems } };
    console.log('保存成功：自建响应体，返回所有 liveItems');
  }
  console.log('保存后新 body：' + JSON.stringify(obj));
}

// 6.—— 视频信息流 & 保存（v3/v4/v10）类似逻辑，可参照上面思路做健壮性检查 —— 

if (url.includes("/v3/note/videofeed?")) {
  try {
    if (Array.isArray(obj.data) && obj.data.length > 0) {
      for (let item of obj.data) {
        if (item?.media_save_config) {
          item.media_save_config.disable_save = false;
          item.media_save_config.disable_watermark = true;
          item.media_save_config.disable_weibo_cover = true;
        }
        if (Array.isArray(item.share_info?.function_entries)) {
          const firstEntry = item.share_info.function_entries[0];
          if (firstEntry?.type !== "video_download") {
            item.share_info.function_entries.unshift({ type: "video_download" });
          }
        }
      }
    }
  } catch (e) {
    console.log(`/v3/note/videofeed? 处理异常：${e}`);
  }
}

if (url.includes("/v4/note/videofeed")) {
  try {
    let normalCache = [];
    let unlockCache = [];
    if (Array.isArray(obj.data) && obj.data.length > 0) {
      for (let item of obj.data) {
        // 插入下载按钮
        if (Array.isArray(item.share_info?.function_entries)) {
          const hasDL = item.share_info.function_entries.some(x => x?.type === "video_download");
          if (!hasDL) {
            item.share_info.function_entries.push({ type: "video_download" });
          }
        }
        // 提取无水印H265 URL
        const vid = item?.id;
        const h265url = item?.video_info_v2?.media?.stream?.h265?.[0]?.master_url;
        if (vid && h265url) {
          normalCache.push({ id: vid, url: h265url });
          // 如果 item.data.disable 为 true，则认为是“禁止保存”模式，把链接放到 unlockCache
          if (item?.media_save_config?.disable_save === true) {
            unlockCache.push({ id: vid, url: h265url });
          }
        }
      }
    }
    if (normalCache.length > 0) {
      $.setdata(JSON.stringify(normalCache), "redBookVideoFeed");
      console.log(`v4 cache: 普通视频 ${normalCache.length} 条`);
    }
    if (unlockCache.length > 0) {
      $.setdata(JSON.stringify(unlockCache), "redBookVideoFeedUnlock");
      console.log(`v4 cache: 禁止保存视频 ${unlockCache.length} 条`);
    }
  } catch (e) {
    console.log(`/v4/note/videofeed 处理异常：${e}`);
  }
}

if (url.includes("/v10/note/video/save")) {
  try {
    const vid = obj.data?.note_id;
    if (!vid) {
      console.log("视频保存失败：返回体缺少 note_id");
      $done({ body: rsp_body });
    }
    const normalRaw = $.getdata("redBookVideoFeed") || "[]";
    const unlockRaw = $.getdata("redBookVideoFeedUnlock") || "[]";
    let normalArr = [], unlockArr = [];
    try {
      normalArr = JSON.parse(normalRaw);
      unlockArr = JSON.parse(unlockRaw);
    } catch {
      console.log("解析视频缓存失败");
    }
    let foundDL = false;
    // 先尝试从普通视频缓存里找
    if (Array.isArray(normalArr)) {
      for (let rec of normalArr) {
        if (rec.id === vid) {
          obj.data.download_url = rec.url;
          foundDL = true;
          break;
        }
      }
    }
    // 如果普通缓存没有，再判断服务器是否标记为 disable=true
    if (!foundDL && obj?.data?.disable === true) {
      for (let rec of unlockArr) {
        if (rec.id === vid) {
          // 移除禁止标记，设置 status=2，并填入链接
          delete obj.data.disable;
          delete obj.data.msg;
          obj.data.status = 2;
          obj.data.download_url = rec.url;
          foundDL = true;
          break;
        }
      }
      if (!foundDL) {
        console.log(`视频保存失败：未在 unlock 缓存中找到 note_id=${vid}`);
      }
    }
    if (!foundDL) {
      console.log(`视频保存失败： note_id=${vid} 未在任何缓存命中`);
    }
    // 重置 unlock 缓存标记
    $.setdata(JSON.stringify([]), "redBookVideoFeedUnlock");
  } catch (e) {
    console.log(`/v10/note/video/save 处理异常：${e}`);
  }
}

// 7.—— 关注页 / 推荐页 —— 

if (url.includes("/user/followings/followfeed")) {
  if (Array.isArray(obj.data?.items)) {
    obj.data.items = obj.data.items.filter(i => i?.recommend_reason === "friend_post");
  }
}

if (url.includes("/v4/followfeed")) {
  if (Array.isArray(obj.data?.items)) {
    obj.data.items = obj.data.items.filter(i => !["recommend_user"].includes(i?.recommend_reason));
  }
}

if (url.includes("/recommend/user/follow_recommend")) {
  if (obj.data?.title === "你可能感兴趣的人") {
    obj.data = {};
  }
}

// 8.—— 首页 Feed（v6）去广告/带货/商品，只保留直播 & 普通笔记 —— 

if (url.includes("/v6/homefeed")) {
  try {
    const arr = obj.data;
    if (Array.isArray(arr) && arr.length > 0) {
      const filtered = [];
      for (let item of arr) {
        if (item?.model_type === "live_v2") {
          // 保留直播条目
          filtered.push(item);
        } else if (item?.hasOwnProperty("ads_info")) {
          // 跳过广告
        } else if (item?.hasOwnProperty("card_icon")) {
          // 跳过带货卡片
        } else if (Array.isArray(item?.note_attributes) && item.note_attributes.includes("goods")) {
          // 跳过商品
        } else {
          // 普通笔记，先删除 related_ques 冗余字段
          if (item?.related_ques) delete item.related_ques;
          filtered.push(item);
        }
      }
      obj.data = filtered;
    }
  } catch (e) {
    console.log(`/v6/homefeed 过滤异常：${e}`);
  }
}

// 9.—— 小工具 Widgets —— 

if (url.includes("/note/widgets")) {
  if (obj.data) {
    const removeKeys = ["cooperate_binds", "generic", "note_next_step"];
    for (let key of removeKeys) {
      delete obj.data[key];
    }
  }
}

// 10.—— 评论列表 & 评论 Live 图缓存 —— 

if (url.includes("/api/sns/v5/note/comment/list?") || url.includes("/api/sns/v3/note/comment/sub_comments?")) {
  try {
    replaceRedIdWithFmz200(obj.data);
    const comments = obj.data?.comments;
    let note_id = "";
    const livePhotos = [];
    if (Array.isArray(comments) && comments.length > 0) {
      note_id = comments[0]?.note_id || "";
      for (let comment of comments) {
        // 处理一级评论
        if (comment.comment_type === 3) {
          comment.comment_type = 2;
          console.log(`修改 一级评论 comment_type: 3->2`);
        }
        if (comment.media_source_type === 1) {
          comment.media_source_type = 0;
          console.log(`修改 一级评论 media_source_type: 1->0`);
        }
        if (Array.isArray(comment.pictures)) {
          for (let pic of comment.pictures) {
            const vid = pic?.video_id;
            const h265url = (() => {
              try {
                return JSON.parse(pic.video_info)?.stream?.h265?.[0]?.master_url;
              } catch {
                return null;
              }
            })();
            if (vid && h265url) {
              livePhotos.push({ videId: vid, videoUrl: h265url });
              console.log(`一级评论收集到 Live 图 video_id=${vid}`);
            }
          }
        }
        // 处理二级子评论
        if (Array.isArray(comment.sub_comments)) {
          for (let sub of comment.sub_comments) {
            if (sub.comment_type === 3) {
              sub.comment_type = 2;
              console.log(`修改 二级评论 comment_type: 3->2`);
            }
            if (sub.media_source_type === 1) {
              sub.media_source_type = 0;
              console.log(`修改 二级评论 media_source_type: 1->0`);
            }
            if (Array.isArray(sub.pictures)) {
              for (let pic of sub.pictures) {
                const vid = pic?.video_id;
                const h265url = (() => {
                  try {
                    return JSON.parse(pic.video_info)?.stream?.h265?.[0]?.master_url;
                  } catch {
                    return null;
                  }
                })();
                if (vid && h265url) {
                  livePhotos.push({ videId: vid, videoUrl: h265url });
                  console.log(`二级评论收集到 Live 图 video_id=${vid}`);
                }
              }
            }
          }
        }
      }
    }
    console.log(`评论列表 note_id=${note_id}，共收集到 ${livePhotos.length} 条 Live 图`);
    if (livePhotos.length > 0) {
      const oldCacheRaw = $.getdata("fmz200.xiaohongshu.comments.rsp") || "";
      let newCache = { noteId: note_id, livePhotos };
      if (oldCacheRaw) {
        try {
          const oldCache = JSON.parse(oldCacheRaw);
          if (oldCache.noteId === note_id) {
            // 去重合并
            const merged = oldCache.livePhotos.concat(livePhotos);
            newCache.livePhotos = deduplicateLivePhotos(merged);
            console.log(`评论 Live 图做了去重合并，合并后共 ${newCache.livePhotos.length} 条`);
          }
        } catch {
          console.log("旧评论缓存解析失败，直接覆盖");
        }
      }
      $.setdata(JSON.stringify(newCache), "fmz200.xiaohongshu.comments.rsp");
      console.log("已写入评论 Live 图缓存");
    }
  } catch (e) {
    console.log(`/note/comment 处理异常：${e}`);
  }
}

// 11.—— 评论区 Live 图下载替换 —— 

if (url.includes("/api/sns/v1/interaction/comment/video/download?")) {
  try {
    const cacheRaw = $.getdata("fmz200.xiaohongshu.comments.rsp") || "";
    const vid = obj.data?.video?.video_id;
    if (!vid) {
      console.log("评论 Live 图下载失败：响应体缺少 video.video_id");
      $done({ body: rsp_body });
    }
    if (!cacheRaw) {
      console.log(`评论 Live 图下载失败：缓存为空，无法替换 video_id=${vid}`);
      $done({ body: rsp_body });
    }
    let cacheObj;
    try {
      cacheObj = JSON.parse(cacheRaw);
    } catch {
      console.log("评论缓存 JSON 解析失败");
      $done({ body: rsp_body });
    }
    const matched = cacheObj.livePhotos.find(x => x.videId === vid);
    if (matched) {
      obj.data.video.video_url = matched.videoUrl;
      console.log(`评论 Live 图下载成功：video_id=${vid} URL 已替换`);
    } else {
      console.log(`评论 Live 图下载失败：缓存中找不到 video_id=${vid}`);
    }
  } catch (e) {
    console.log(`/comment/video/download 处理异常：${e}`);
  }
}

$done({ body: JSON.stringify(obj) });



/**
 * imageEnhance：对传入的 images_list（JSON 字符串）做“高像素输出”或“原始分辨率PNG”替换
 * 如果传入非 JSON 或替换失败，会 catch 并返回空数组，保证不抛异常
 */
function imageEnhance(jsonStr) {
  if (!jsonStr) {
    console.error("imageEnhance 收到空字符串");
    return [];
  }
  let modStr = jsonStr;
  try {
    const quality = $.getdata("fmz200.xiaohongshu.imageQuality");
    if (quality === "original") {
      // 原始分辨率：PNG
      modStr = modStr.replace(
        /\?imageView2\/2[^&]*(?:&redImage\/frame\/0)/,
        "?imageView2/0/format/png&redImage/frame/0"
      );
      console.log("imageEnhance：使用原始 PNG");
    } else {
      // 高像素输出 2160p
      modStr = modStr.replace(/imageView2\/2\/w\/\d+\/format/g, "imageView2/2/w/2160/format");
      modStr = modStr.replace(/imageView2\/2\/h\/\d+\/format/g, "imageView2/2/h/2160/format");
      console.log("imageEnhance：使用高像素输出 2160p");
    }
    return JSON.parse(modStr);
  } catch (e) {
    console.error(`imageEnhance 异常：${e}`);
    try {
      return JSON.parse(jsonStr);
    } catch {
      return [];
    }
  }
}


/**
 * 去重 Live Photo 列表，根据 videId 唯一性
 */
function deduplicateLivePhotos(arr) {
  const seen = new Set();
  const ret = [];
  for (let item of arr) {
    if (!item?.videId) continue;
    if (!seen.has(item.videId)) {
      seen.add(item.videId);
      ret.push(item);
    }
  }
  return ret;
}

/**
 * 递归替换对象中所有 red_id 字段为 fmz200，然后删除原 red_id
 */
function replaceRedIdWithFmz200(obj) {
  if (Array.isArray(obj)) {
    for (let el of obj) {
      replaceRedIdWithFmz200(el);
    }
  } else if (obj && typeof obj === 'object') {
    if ('red_id' in obj) {
      obj.fmz200 = obj.red_id;
      delete obj.red_id;
    }
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        replaceRedIdWithFmz200(obj[key]);
      }
    }
  }
}

/**
 * Env 脚本环境适配（Surge/QuanX/Loon/Node.js 等）
 */
function Env(name) {
  this.name = name;
  this.log = msg => console.log(`${this.name}, ${msg}`);
  this.getdata = key => {
    try {
      return $persistentStore.read(key);
    } catch {
      return null;
    }
  };
  this.setdata = (val, key) => {
    try {
      return $persistentStore.write(val, key);
    } catch {
      return false;
    }
  };
}
