// 2023-04-22 14:55

if (!$response.body) $done({});
const method = $request.method;
const url = $request.url;
let body = $response.body;

if (url.includes("/a.p")) {
  if (method == "POST") {
    body = body
        .replace(/"playright":\d+/g, '"playright":1')
        .replace(/"downright":\d+/g, '"downright":1')
        .replace(/"policytype":\d+/g, '"policytype":3')
        .replace(/"policy":\d+/g, '"policy":5');
  } else if (url.includes("getvip")) {
    let obj = JSON.parse(body);
    obj.packs = {
      end: 32495443200,
      bought_vip: 1,
      type: 1,
      period: 31,
      bought_vip_end: 32495443200
    };
    body = JSON.stringify(obj);
  }
} else if (url.includes("mgxhtj.kuwo.cn") || url.includes("nmobi.kuwo.cn")) {
  body = body
      .replace(/<ad\x20focusid="[^>]*>/g, "")
      .replace(/<ad\x20publish="[^>]*>/g, "")
      .replace(/(<userinfolabel\x20content=")[^"]*/g, "$1[]");
} else if (url.includes("searchrecterm.kuwo.cn")) {
  body = '{ content: [{ query_word: "搜索歌曲", desc: "" }] }';
} else if (url.includes("/music.pay") && method == "POST") {
  if (body.includes("audio")) {
    let obj = JSON.parse(body);
    obj.songs[0].audio.forEach((item) => (item.st = 0));
    let tmp = obj.songs[0].audio[0].policy;
    obj.user[0] = {
      pid: obj.songs[0].audio[0].pid,
      type: tmp,
      name: tmp + "_1",
      categray: tmp + "_1",
      id: obj.songs[0].id,
      order: 375787919,
      final: [],
      buy: 1657425321,
      begin: 1657425321,
      end: 4180305321,
      CurEnd: 0,
      playCnt: 0,
      playUpper: 300,
      downCnt: 0,
      downUpper: 300,
      playVideoCnt: 0,
      playVideoUpper: 3000,
      downVideoCnt: 0,
      downVideoUpper: 3000,
      price: obj.songs[0].audio[0].price,
      period: 1000,
      feetype: 0,
      info: obj.songs[0]
    };
    body = JSON.stringify(obj);
  }
} else if (url.includes("/vip/enc/user/vip?op=ui")) {
  body =
      "Vo4m6X2hTph/vfpPmau8PTT0sFN6JCgzxSLVH/u3sbEt7VniYsVHbRFgOgN+Uvs39rAI7R3C5HVpaSj8tr8U8dLYwYdDCjMILuUorh3z0BiQToiWxudHkcASIPHNrmZHZYC/yv3DP4b89hbzfqU5UUDUqaZpEBZr76sDF2wNPmYjUEFSVCMGyTl1F6j1DBmKJ1Tik0YuG/2UBa/Ilz12a1KneXsNs5x5EE41bXDke7EygIB3I+6SoITZXOLFAFQFZujdI0GzClNglDKtclpUxpjN3uVeJxHLU40FTwNWo3ZDNv8KSdZpYZ5BDEOCyZkifmHlf1wnocX2zTr2xRAM6JhAD2WaSSNQQVJUI5lv72QNZSN43Pj/qdzatHQP4Pp/H1YxyP36rv3qBcnnJy/55YouIczRc3eJjXExRgo54qdyTYRMYoS9GzNn/edR3hSNnMn9PnElBCfZhkL0R5kZ9JBFCM3vNOy7Cnp6RVyAG0GFHv/g2q1yqkJxibyDro5nlnnvHjhZrsOvSvTXI1BBUlQjGoRqqCTDUvHLoiNwWMoKKfxtswWQiXjoQ6mL5dazxjUsbsHzC1N8YNMVtzf8gBryr3nMWS44wyUpi1/0WhGTRW1wsCllO1DB24+ibTFH/yftWN+/apM9vbQAkc/J+aFy/01plK7rsGNwWYYKG0sr6CS8dGQzy0On6aFo07hiU+wjUEFSVCOf/wKzzX5Cn/OLMKeVa1BPDxV5tm39vCrsxIG6T29VHWx8ck93S/nXCm2dHfojuLySZKJ50B1FaN5uFIY+LA1RbO/0sL+CoSJhoNOLibzt75c5dleW+lbwxLAAdBh5AFq4Z1Uj8bPjm5mHcGWQuBAyZIO+ie8wP4yvWwQFf1ENJiNQQVJUIzwCo22cpAtoAzYZWm3XFPfSlov4G15JGaaHL2X5FG5BTeUwwbBiQfwUpcb6oT8dbIKh2SsUZCeJZW43lLI0UIo9u3y1+P4GMtOKEZ7Sx0aQ3ewknthU2tpL0gnykFtiEtKBxcfHjJEen158zVXrbxxC0W35SmaYOOwgAmEMfxwHI1BBUlQjhVUHnBabnJcnmXCICcyUBglrZkXcNLwg91p4889vKFTLlzROHTt20UzjfKWsNK3U8pYgKYXPbQtSzIuRheEEQDFhLvEhIGKaB6yDoacDLJZ0jgFRIKKFBkbK0VE4nIABi1qgQOXvq1sG4QeupjfEWYqMX8EyyqPHrsDiCltAF1wjUEFSVCNybeUusnxJF2zswj8xQtfPiwfDj3TwKWxKXCmkheqHy7/0Qpyc84xWvq+YXktsU97wUZLHrgJmARudJmQNEwAweIdHMafcwreBy731z6kGLojy5TLgTN7XSm5Ar+hgOW+1ZwkWLyrVvaCdO/8/zdYl1w/PQUCs6dw0ThIeahwjpQ==";
} else if (url.includes("/vip/v2/user/vip?op=ui")) {
  let obj = JSON.parse(body);
  obj.data = {
    vipIcon:
        "https://image.kuwo.cn/fe/f2d09ac0-b959-404f-86fa-dc65c715c0e96.png",
    iconJumpUrl:
        "http://vip1.kuwo.cn/vip/vue/anPay/pay/index.html?pageType=avip&MBOX_WEBCLOSE=1&FULLHASARROW=1",
    growthValue: "21600",
    vipTag: "VIP6",
    vipOverSeasExpire: "0",
    time: "1659582730304",
    goSvipPage: "1",
    isNewUser: "1",
    vipmIcon:
        "https://image.kuwo.cn/fe/34ad47f8-da7f-43e4-abdc-e6c995666368yyb.png",
    svipIcon:
        "https://image.kuwo.cn/fe/f2d09ac0-b959-404f-86fa-dc65c715c0e96.png",
    vipmExpire: "32495443200000",
    biedSong: "0",
    luxuryIcon:
        "https://image.kuwo.cn/fe/2fae68ff-de2d-4473-bf28-8efc29e44968vip.png",
    userType: "3",
    isYearUser: "2",
    vip3Expire: "0",
    experienceExpire: "0",
    luxAutoPayUser: "2",
    biedAlbum: "1",
    vipLuxuryExpire: "32495443200000",
    vipmAutoPayUser: "2",
    svipAutoPayUser: "2",
    vipExpire: "32495443200000",
    svipExpire: "32495443200000"
  };
  body = JSON.stringify(obj);
} else if (url.includes("/vip/v2/theme?op=gd")) {
  let obj = JSON.parse(body);
  obj.data.needBieds = null;
  body = JSON.stringify(obj);
}

$done({ body });