import Vue from 'vue'
import Router from 'vue-router'

import index from '@/pages/index'
import choujiang from '@/pages/modules/choujiang'
import dianming from '@/pages/modules/dianming'
import jiaohuan from '@/pages/modules/jiaohuan'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/choujiang',
      name: 'choujiang',
      components: {
        default: choujiang
      }
    },
    {
      path: '/index',
      name: 'index',
      components: {
        default: index
      }
    },
    {
      path: '/choujiang',
      name: 'choujiang',
      components: {
        default: choujiang
      }
    },
    {
      path: '/dianming',
      name: 'dianming',
      components: {
        default: dianming
      }
    },
    {
      path: '/jiaohuan',
      name: 'jiaohuan',
      components: {
        default: jiaohuan
      }
    },
  ]
})
