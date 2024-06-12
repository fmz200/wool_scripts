/**
 * 作者：fmz200，修改自dompling的ql_cookie_sync.js
 * 作用：定时同步BoxJS中的数据到青龙环境变量，每日自动同步
 * 配置：40 0 * * * https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/qinglong/ql_sync.js
 * 定时：QX导入订阅 https://raw.githubusercontent.com/fmz200/wool_scripts/main/boxjs/fmz200_gallery.json
 * 使用：详见BoxJS页面 https://raw.githubusercontent.com/fmz200/wool_scripts/main/boxjs/fmz200.boxjs.json
 * 更新：2023-06-04 13:30
 */

const $ = new API('ql', true);

const title = '🐉 同步通知';

const sync_keys = $.read('#ql_sync_keys').replace(/\s/g, '').split(',') || [];
if (sync_keys.length === 0) {
  $.notify(title, '', `未填写需要同步的keys，请在BoxJS填写正确`);
  $.done();
}

let remark = {};

!(async () => {
  // 只登陆一次
  const ql_script = (await getScriptUrl()) || '';
  eval(ql_script);
  await $.ql.login();
  // 开始同步数据
  for await (const key of sync_keys) {
    await autoSync(key);
  }
  const keyText = sync_keys.map((item) => item).join(`\n`);
  if ($.read('ql_sync_notify') !== 'true') {
    $.notify(title, '', `已同步以下keys的数据：\n${keyText}`);
  }
  $.done();
})();

async function autoSync(key_remark) {
  $.log(`--------------------`);
  try {
    // key可能包含两部分：key@remark
    let key;
    let remark;
    if (key_remark.includes('@')) {
      [key, remark] = key_remark.split('@');
    } else {
      key = key_remark;
      remark = 'BoxJS同步的数据'; // 如果没有备注，可以设置为 null 或其他默认值
    }
    const values = await $.ql.select(key); // 同一个key可能有多个值，暂时只做一个的同步
    await $.ql.delete(values.data.map((item) => item.id));
    $.log(`已清空${key}的数据`);

    const addData = [];
    const key_value = $.read(`#${key}`);
    $.log(`已读取${key}的数据`);
    addData.push({name: key, value: key_value, remarks: remark});
    if (addData.length) await $.ql.add(addData);
    $.log(`已同步${key}的数据`);
  } catch (e) {
    $.log(`同步${key_remark}的数据时发生错误：` + JSON.stringify(e));
  }
  $.log(`--------------------`);
}

async function getScriptUrl() {
  const response = await $.http.get({
    url: 'https://raw.githubusercontent.com/fmz200/wool_scripts/main/Scripts/qinglong/ql_api.js',
  });
  return response.body;
}

function getURL(api, key = 'api') {
  return `${baseURL}/${key}/${api}`;
}

function login() {
  const opt = {
    headers,
    url: getURL('login'),
    body: JSON.stringify(account),
  };
  return $.http.post(opt).then((response) => JSON.parse(response.body));
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ENV() {
  const isQX = typeof $task !== 'undefined';
  const isLoon = typeof $loon !== 'undefined';
  const isSurge = typeof $httpClient !== 'undefined' && !isLoon;
  const isJSBox = typeof require == 'function' && typeof $jsbox != 'undefined';
  const isNode = typeof require == 'function' && !isJSBox;
  const isRequest = typeof $request !== 'undefined';
  const isScriptable = typeof importModule !== 'undefined';
  return {isQX, isLoon, isSurge, isNode, isJSBox, isRequest, isScriptable};
}

function HTTP(defaultOptions = {baseURL: ''}) {
  const {isQX, isLoon, isSurge, isScriptable, isNode} = ENV();
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH'];
  const URL_REGEX =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  function send(method, options) {
    options = typeof options === 'string' ? {url: options} : options;
    const baseURL = defaultOptions.baseURL;
    if (baseURL && !URL_REGEX.test(options.url || '')) {
      options.url = baseURL ? baseURL + options.url : options.url;
    }
    options = {...defaultOptions, ...options};
    const timeout = options.timeout;
    const events = {
      ...{
        onRequest: () => {
        },
        onResponse: (resp) => resp,
        onTimeout: () => {
        },
      },
      ...options.events,
    };

    events.onRequest(method, options);

    let worker;
    if (isQX) {
      worker = $task.fetch({method, ...options});
    } else if (isLoon || isSurge || isNode) {
      worker = new Promise((resolve, reject) => {
        const request = isNode ? require('request') : $httpClient;
        request[method.toLowerCase()](options, (err, response, body) => {
          if (err) reject(err);
          else
            resolve({
              statusCode: response.status || response.statusCode,
              headers: response.headers,
              body,
            });
        });
      });
    } else if (isScriptable) {
      const request = new Request(options.url);
      request.method = method;
      request.headers = options.headers;
      request.body = options.body;
      worker = new Promise((resolve, reject) => {
        request
          .loadString()
          .then((body) => {
            resolve({
              statusCode: request.response.statusCode,
              headers: request.response.headers,
              body,
            });
          })
          .catch((err) => reject(err));
      });
    }

    let timeoutid;
    const timer = timeout
      ? new Promise((_, reject) => {
        timeoutid = setTimeout(() => {
          events.onTimeout();
          return reject(
            `${method} URL: ${options.url} exceeds the timeout ${timeout} ms`
          );
        }, timeout);
      })
      : null;

    return (
      timer
        ? Promise.race([timer, worker]).then((res) => {
          clearTimeout(timeoutid);
          return res;
        })
        : worker
    ).then((resp) => events.onResponse(resp));
  }

  const http = {};
  methods.forEach(
    (method) =>
      (http[method.toLowerCase()] = (options) => send(method, options))
  );
  return http;
}

function API(name = 'untitled', debug = false) {
  const {isQX, isLoon, isSurge, isNode, isJSBox, isScriptable} = ENV();
  return new (class {
    constructor(name, debug) {
      this.name = name;
      this.debug = debug;

      this.http = HTTP();
      this.env = ENV();

      this.node = (() => {
        if (isNode) {
          const fs = require('fs');

          return {
            fs,
          };
        } else {
          return null;
        }
      })();
      this.initCache();

      const delay = (t, v) =>
        new Promise(function (resolve) {
          setTimeout(resolve.bind(null, v), t);
        });

      Promise.prototype.delay = function (t) {
        return this.then(function (v) {
          return delay(t, v);
        });
      };
    }

    // persistance

    // initialize cache
    initCache() {
      if (isQX) this.cache = JSON.parse($prefs.valueForKey(this.name) || '{}');
      if (isLoon || isSurge)
        this.cache = JSON.parse($persistentStore.read(this.name) || '{}');

      if (isNode) {
        // create a json for root cache
        let fpath = 'root.json';
        if (!this.node.fs.existsSync(fpath)) {
          this.node.fs.writeFileSync(
            fpath,
            JSON.stringify({}),
            {flag: 'wx'},
            (err) => console.log(err)
          );
        }
        this.root = {};

        // create a json file with the given name if not exists
        fpath = `${this.name}.json`;
        if (!this.node.fs.existsSync(fpath)) {
          this.node.fs.writeFileSync(
            fpath,
            JSON.stringify({}),
            {flag: 'wx'},
            (err) => console.log(err)
          );
          this.cache = {};
        } else {
          this.cache = JSON.parse(
            this.node.fs.readFileSync(`${this.name}.json`)
          );
        }
      }
    }

    // store cache
    persistCache() {
      const data = JSON.stringify(this.cache);
      if (isQX) $prefs.setValueForKey(data, this.name);
      if (isLoon || isSurge) $persistentStore.write(data, this.name);
      if (isNode) {
        this.node.fs.writeFileSync(
          `${this.name}.json`,
          data,
          {flag: 'w'},
          (err) => console.log(err)
        );
        this.node.fs.writeFileSync(
          'root.json',
          JSON.stringify(this.root),
          {flag: 'w'},
          (err) => console.log(err)
        );
      }
    }

    write(data, key) {
      this.log(`SET ${key}`);
      if (key.indexOf('#') !== -1) {
        key = key.substr(1);
        if (isSurge || isLoon) {
          return $persistentStore.write(data, key);
        }
        if (isQX) {
          return $prefs.setValueForKey(data, key);
        }
        if (isNode) {
          this.root[key] = data;
        }
      } else {
        this.cache[key] = data;
      }
      this.persistCache();
    }

    read(key) {
      this.log(`READ ${key}`);
      if (key.indexOf('#') !== -1) {
        key = key.substr(1);
        if (isSurge || isLoon) {
          return $persistentStore.read(key);
        }
        if (isQX) {
          return $prefs.valueForKey(key);
        }
        if (isNode) {
          return this.root[key];
        }
      } else {
        return this.cache[key];
      }
    }

    delete(key) {
      this.log(`DELETE ${key}`);
      if (key.indexOf('#') !== -1) {
        key = key.substr(1);
        if (isSurge || isLoon) {
          return $persistentStore.write(null, key);
        }
        if (isQX) {
          return $prefs.removeValueForKey(key);
        }
        if (isNode) {
          delete this.root[key];
        }
      } else {
        delete this.cache[key];
      }
      this.persistCache();
    }

    // notification
    notify(title, subtitle = '', content = '', options = {}) {
      const openURL = options['open-url'];
      const mediaURL = options['media-url'];

      if (isQX) $notify(title, subtitle, content, options);
      if (isSurge) {
        $notification.post(
          title,
          subtitle,
          content + `${mediaURL ? '\n多媒体:' + mediaURL : ''}`,
          {
            url: openURL,
          }
        );
      }
      if (isLoon) {
        let opts = {};
        if (openURL) opts['openUrl'] = openURL;
        if (mediaURL) opts['mediaUrl'] = mediaURL;
        if (JSON.stringify(opts) == '{}') {
          $notification.post(title, subtitle, content);
        } else {
          $notification.post(title, subtitle, content, opts);
        }
      }
      if (isNode || isScriptable) {
        const content_ =
          content +
          (openURL ? `\n点击跳转: ${openURL}` : '') +
          (mediaURL ? `\n多媒体: ${mediaURL}` : '');
        if (isJSBox) {
          const push = require('push');
          push.schedule({
            title: title,
            body: (subtitle ? subtitle + '\n' : '') + content_,
          });
        } else {
          console.log(`${title}\n${subtitle}\n${content_}\n\n`);
        }
      }
    }

    // other helper functions
    log(msg) {
      if (this.debug) console.log(msg);
    }

    info(msg) {
      console.log(msg);
    }

    error(msg) {
      console.log('ERROR: ' + msg);
    }

    wait(millisec) {
      return new Promise((resolve) => setTimeout(resolve, millisec));
    }

    done(value = {}) {
      if (isQX || isLoon || isSurge) {
        $done(value);
      } else if (isNode && !isJSBox) {
        if (typeof $context !== 'undefined') {
          $context.headers = value.headers;
          $context.statusCode = value.statusCode;
          $context.body = value.body;
        }
      }
    }
  })(name, debug);
}
