/**
 * Created by hehui on 2018/2/6.
 */

import Vue from 'vue'
import router from '../router';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from '../pages/index';

import '../scss/comm.scss';
import '../scss/index.scss';

Vue.use(ElementUI)

import axios from 'axios'

import util from '../util';
// localStorage 版本管理和数据更新
let ls = util.Storage.version(1).init().update();

// let apiUrl = process.env.NODE_ENV !== 'production'
//   ? 'm.9z.cn' : 'http://www.jiuzheng.net/';
// let domain = process.env.NODE_ENV !== 'production'
//   ? '/api/test/' : `http://${apiUrl}/choujiang/`;
let apiUrl = process.env.NODE_ENV !== 'production'
  ? 'www.jiuzheng.net' : 'www.jiuzheng.net';
let domain = process.env.NODE_ENV !== 'production'
  ? '/api/choujiang/' : `http://${apiUrl}/choujiang/`;

console.log(domain);

// 创造全局变量
window.nh_util = util;
window.nh_domain = domain;
window.nh_storage = ls;
window.nh_axios = axios;


new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  created() {

    // 获取活动的所有人
    nh_axios.get(`${nh_domain}/return.php`)
      .then(function (res) {
        console.log(res)
        let storageKey =
          nh_storage.createKey('total');
        nh_storage.setItem(storageKey, res.data);

        // 将总人数存储未全局变量
        window.nh_total_users = res.data;
      })
      .catch(function (error) {
        alert('获取参加活动的人员数据失败');
      });
  }
})