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

const whiteList = ['taint/search']

const isWhiteList = (path: string) => {
  return whiteList.some((item: string) => {
    return path.indexOf(item) > -1
  })
}

router.beforeEach((to, from, next) => {
  Nprogress.start()

  // 当前没有用户信息
  if (!store.getters.userInfo && to.fullPath !== '/login') {
    store
      .dispatch('user/getUserInfo')
      .then(() => {
        Nprogress.done()
        if (
          store.getters.userInfo.role != 1 &&
          (to.fullPath == '/user/userList' ||
            to.fullPath == '/setting/sysInfo' ||
            to.fullPath == '/setting/upgradeOnline')
        ) {
          next('/')
        } else {
          next()
        }
      })
      .catch(() => {
        Nprogress.done()
        if(isWhiteList(to.fullPath)){
          Nprogress.done()
          next()
        }else{

        next('/login')
        }
      })
  } else {
    Nprogress.done()
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
