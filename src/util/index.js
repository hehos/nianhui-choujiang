/**
 * Created by hehui on 2017/12/29.
 */

export default {
  /**
   * 生成一个 url 字符串
   * @param url 初始 url
   * @param params 需要处理的 参数
   * @returns {string}
   */
  getUrl(url, params) {
    let formatUrl = '';
    let tempSearch = url.substring(url.indexOf('?') + 1, url.length);
    let search = tempSearch ? '&' : '?';
    for (let key in params) {
      search += `${key}=${params[key]}&`;
    }
    search = search.substring(0, search.length - 1);
    formatUrl = url + search;
    console.log(formatUrl);
    return formatUrl;
  },

  /**
   * 洽客循序的ID最大值为：
   *
   * 返回 2年前所在年份得 1 月 1 日至今的毫秒数作为 ID
   * 如：当前为2017/12/12，那就返回2015/1/1至2017/12/12得毫秒数
   * @returns {number}
   */
  getSimpleUUID() {
    var date1 = new Date();
    var date2 = new Date();

    date2.setFullYear(date1.getFullYear() - 2); // 年
    date2.setMonth(0);
    date2.setDate(1);
    date2.setHours(0);
    date2.setMinutes(0);
    date2.setSeconds(0);
    date2.setMilliseconds(0);
    return Math.floor((date1.getTime() - date2.getTime())/100);
  },

  getApiUUID(url, cb) {
    window.$.getJSON(url, (data) => {
      console.log('接口返回UUID:');
      console.log(data);
      if (data.code === '200') {
        cb(parseInt(data.data));
      } else {
        throw new Error('获取用户ID失败' +
        data.message ? data.message : data.msg);
      }
    });
  },

  // 检测 移动端还是pc端
  isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var i = 0; i < Agents.length; i++) {
      if (userAgentInfo.indexOf(Agents[i]) > 0) { flag = false; break; }
    }
    return flag;
  },

  // 检测 浏览器类型
  browserType () {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = false;
    if (userAgent.indexOf('Edge') > -1) {
      return "Edge";
    }
    if (userAgent.indexOf('.NET') > -1) {
      return "IE";
    }
    //判断是否Opera浏览器
    if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
      isOpera = true;
      return "Opera"
    };
    //判断是否Firefox浏览器
    if (userAgent.indexOf("Firefox") > -1) {
      return "FF";
    }
    if (userAgent.indexOf("Chrome") > -1) {
      return "Chrome";
    }
    //判断是否Safari浏览器
    if (userAgent.indexOf("Safari") > -1) {
      return "Safari";
    }
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
      return "IE";
    }; //判断是否IE浏览器
  },

  // 新消息提示
  NewMsgHint: {
    _step: 0,
    _d: null,
    _title: '',     // 存储top 框架的 document.title 属性值
    _hasHidden: true,  // 存储top 框架是否有document.hidden 属性
    _timer: null,
    _isMyTop: false,  // 是否为 top 框架

    setTitle(title) {
      if (this._isMyTop) {
        this._d.title = title;
      } else {
        top.postMessage({
          type: 'document',
          data: {
            title: title,
          }
        }, '*');
      }

    },
    show() {
      let temps = this._title
        .replace("【　　　】", "")
        .replace("【新消息】", "");
      this._timer = setTimeout(() => {
        this.show();
        this._step++;
        this._step == 3 && (this._step = 1);
        this._step == 1 && (this.setTitle(`【新消息】${temps}`));
        this._step == 2 && (this.setTitle(`【　　　】${temps}`));
      }, 800);
    },
    clear() {
      this._step = 0;
      clearTimeout(this._timer);
      this.setTitle(this._title);
    },
    listen() {
      this._hasHidden &&
        // 浏览器标签页被隐藏或显示的时候会触发visibilitychange事件
        // 注意这里只能用 document，不能用 this._d
        document.addEventListener("visibilitychange", () => {
          console.log(document.hidden);
          if (!document.hidden) {
            this.clear();
          }
        });
    },

    run() {
      if (this._hasHidden) {
        if (document.hidden) {
          this.show();
        } else {
          this.clear();
        }
      }
      return this;
    },

    // 如果 隐藏，显示新消息到达通知
    // 处理iframe内的跨域问题
    init() {
      // 判断是否为 top 框架
      this._isMyTop = top === window;
      if (this._isMyTop) {
        this._d = document;
        this._title = document.title;
        this._hasHidden = hidden in document;
      } else {
        window.addEventListener('message', (e) => {
          let data = e.data;
          if (data.type === 'document') {
            console.log(e.data);
            data = data.data;
            this._title = data.title;
            this._hasHidden = data.hasHidden;
          }
        }, false);
      }
    }
  },
  /**
   * 管理 localStorage 中字段的版本号，
   * 使bug修复后，可更新 localStorage 属性，避免老数据问题
   * @type {number}
   */
  Storage: {
    _ls: null,
    _version: 1,     // localStorage 版本
    _propPrefix: 'jz_choujiang',    // localStorage 属性前缀
    // localStorage 属性名的前面部分
    storageKeyHead() {
      return `${this._propPrefix}_${this._version}`
    },
    version(v) {
      this._version = v;
      return this;
    },
    // 更新 localStorage
    update() {
      let lsObj = this._ls;
      let prevVersion;

      let lsObjKeys = Object.keys(lsObj);
      for(var key of lsObjKeys) {
        if (key.startsWith(this._propPrefix)) {
          prevVersion =
            key.slice(this._propPrefix.length)
              .split('_')[1];
          prevVersion = parseInt(prevVersion);
          break;
        }
      }
      // 如果跟之前的版本不一样，更新localStorage中对应属性的数据
      if (this._version !== prevVersion) {
        for(var key of lsObjKeys) {
          if (key.startsWith(this._propPrefix)) {
            lsObj.removeItem(key);
          }
        }
      }
      return this;
    },
    setItem(key, val) {
      this._ls.setItem(key, JSON.stringify(val));
    },
    getItem(key) {
      let entry = this._ls.getItem(key);
      if (entry) {
        return JSON.parse(entry);
      } else {
        return undefined;
      }
    },
    createKey(type, alones) {
      let key = `${this.storageKeyHead()}_${type}`;
      for (let a in alones) {
        key += alones[a] ? '_' + alones[a] : '';
      }
      return key;
    },
    init() {
      let ls = localStorage;

      this._ls = ls;
      return this;
    },
  },

  // 处理 date
  // 将时间拆分成 年， 日期， 时分
  splitDate(date) {
    let obj = {
      year: '',
      date: '',
      time: ''
    }
    obj.year = date.getFullYear();
    let md = date.toLocaleDateString();
    md = md.split('/');
    md.shift();
    obj.date = md.join('-');
    let hms = date.toLocaleTimeString('chinese', {hour12:false});
    hms = hms.split(':');
    hms.pop();
    obj.time = hms.join(':');
    return obj;
  }

}
