import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/store'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  // 当前没有用户信息
  console.log(to);
  console.log(from);
  if (!store.getters.userInfo && to.fullPath !== '/login') {
    store.dispatch('getUserInfo').then(() => {
      console.log('then')
      next()
    }).catch(() => {
      console.log('catch')
      next('/login')
    })
  }else {
    next()
  }
})

export default router
