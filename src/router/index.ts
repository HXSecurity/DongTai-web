import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/store'
import Nprogress from 'nprogress'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  Nprogress.start()
  // 当前没有用户信息
  if (!store.getters.userInfo && to.fullPath !== '/login') {
    store
      .dispatch('user/getUserInfo')
      .then(() => {
        Nprogress.done()
        next()
      })
      .catch(() => {
        Nprogress.done()
        next('/login')
      })
  } else {
    next()
  }
})

router.afterEach((to) => {
  Nprogress.done()
  if (to.meta.name) {
    document.title = to.meta.name
  }
})

export default router
