var myhead = {
  "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
}

getlist()

async function getlist() {
  let Return_list = await get_list()
  let app_List = Return_list[0]
  let all_num = Return_list[1]
  let app_lin_num = app_List.length

  while (all_num > app_lin_num) {
    let id = app_List.slice(-1)[0].id
    app_List = await get_page_id_last(app_List, id)
    app_lin_num = app_List.length
  }
  $("Video").data = app_List;
  $("Video").endRefreshing()
}

async function get_list() {
  let resp = await $http.request({
    method: "GET",
    url: "https://mergeek.com/free/apps",
    timeout: 30,
    header: myhead,
  })
  if (resp.data && resp.data != "") {
    let data = resp.data
    let html = data.replace(/\n|\s|\r/g, '')

    let all_num = data.match(/<p>(.*?)个/)[1]//获取限免数
    all_num = Number(all_num)

    let arr = html.match(/<divclass="svq-article-col"(.*?)<\/div><\/article><\/div>/g)

    var data_list = []
    for (const i in arr) {
      let jj = arr[i].match(/class="meta-category__link">(.*?)<\/a>/)
      if (jj != null) {
        data_list.push({
          img: {
            src: arr[i].match(/<imgalt=''src='(.*?)'class='avataravatar-60photoavatar-img'/)[1],
          },
          id: arr[i].match(/<divclass="svq-article-col"data-guid="(.*?)"/)[1],
          url: "https://mergeek.com" + await getApp_id('https://mergeek.com/' + arr[i].match(/<divclass="friendlyWrap"><ahref="\/(.*?)"><\/a><\/div>/)[1]),
          link: arr[i].match(/class="meta-category__link">(.*?)<\/a>/)[1],
          present_price: arr[i].match(/>([A-Z]{4})<\/div><\/div><\/div><divclass="friendlyWrap"/)[1],
          pm: {
            text: arr[i].match(/data-fancybox="gallery-23"data-caption="(.*?)">/)[1],
          },
        })
      }
    }
    console.log("限免列表：" + JSON.stringify(data_list));
    console.log("限免数量：" + all_num);
    return [data_list, all_num];
  }
}

async function get_page_id_last(app_List, id) {
  let resp = await $http.request({
    method: "GET",
    url: `https://mergeek.com/free/apps?last_id=${id}`,
    timeout: 30,
    header: {
      "X-Requested-With": "XMLHttpRequest",
    },
  })

  if (resp.data.data && resp.data.data.apps != "") {
    for (const i in resp.data.data.apps) {
      app_List.push({
        img: {
          src: resp.data.data.apps[i].icon
        },
        id: resp.data.data.apps[i].id,
        url: "https://apps.apple.com/cn/app/hibido-pro-todo-calendar-note/id" + resp.data.data.apps[i].appstore_id,
        link: resp.data.data.apps[i].classifications,
        present_price: resp.data.data.apps[i].present_price,
        pm: {
          text: resp.data.data.apps[i].name
        },

      })
    }
    return app_List
  }
}

async function getApp_id(url) {
  let resp = await $http.request({
    method: "GET",
    url: url,
    timeout: 30,
    header: myhead,
  })
  if (resp.data && resp.data != "") {
    let arr = resp.data.replace(/\n|\s|\r/g, '')
    // console.log(arr)
    return arr.match(/<divclass="downloadMenu"><divclass="downloadMenuItem"><ahref="(.*?)"target="_top">跳转<\/a><\/div>/)[1]
  }
}

var changeList = [{"name": "每日限免", "id": "1"}]
$ui.render({
  props: {
    title: "app每日限免"
  },
  views: [
    {
      type: "menu",
      props: {
        id: "menu",
        items: changeList.map(function (item) {
          return item.name
        })
      },
      layout: (make, view) => {
        make.left.top.right.equalTo(0)
        make.height.equalTo(50)
      },
      events: {
        changed: function (sender) {
          $cache.set("type", changeList[sender.index].id)
        }
      }
    },
    {
      type: "matrix",
      props: {
        id: "Video",
        itemHeight: 185,//整个方格高度
        columns: 3,
        spacing: 7,
        reorder: true,
        info: 'dd',
        template: [{
          type: "image",
          props: {
            id: "img",
            radius: 30,
          },
          layout: (make, view) => {
            make.centerX.equalTo(view.super)
            make.height.equalTo(110)
            make.width.equalTo(110)
          }
        },
          {
            type: "label",
            props: {
              id: "pm",
              align: $align.center,
              lines: 0,
              font: $font("bold", 15),

            },
            layout: (make, view) => {
              make.top.equalTo($("img").bottom).equalTo(0)//offset偏移量
              make.right.left.inset(0)

            }
          }
        ]
      },
      layout: (make, view) => {
        make.top.equalTo($("menu").bottom)
        make.bottom.left.right.inset(0)
      },
      events: {
        didSelect: function (sender, indexPath, data) {
          $app.openURL(data.url)

        }
      }
    },
  ]
})
