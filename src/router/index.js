import Vue from 'vue'
import Router from 'vue-router'
import Analytics from '@/components/Analytics'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Analytics',
      component: Analytics
    }
  ]
})
