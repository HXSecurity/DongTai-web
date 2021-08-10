import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/store'
import Nprogress from 'nprogress'
import { getToken } from '@/utils/utils'
Vue.use(VueRouter)
let initFlag = true
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes.baseRoutes,
})

const whiteList = ['/login', '/taint', '/taint/search', '/taint/poolDetail']

const isWhiteList = (path: string) => {
  return whiteList.some((item: string) => {
    return path.indexOf(item) > -1
  })
}

router.beforeEach(async (to: any, from: any, next: any) => {
  Nprogress.start()

  if (!getToken() && isWhiteList(to.fullPath)) {
    next()
    return
  }
  if (getToken() && to.fullPath === '/login') {
    next('/')
    return
  }
  // No permission
  if (
    (!store.getters.userInfo && !isWhiteList(to.fullPath)) ||
    (getToken() && isWhiteList(to.fullPath)) && initFlag
  ) {
    initFlag = false
    await store
      .dispatch('user/getUserInfo')
      .then(() => {
        store.commit('user/SET_ROUTER', routes.routes)
        Nprogress.done()
        if (
          store.getters.userInfo.role != 1 &&
          (to.fullPath == '/user/userList' ||
            to.fullPath == '/setting/sysInfo' ||
            to.fullPath == '/setting/upgradeOnline')
        ) {
          next('/')
        } else {
          next({ ...to, replace: true })
        }
      })
      .catch(() => {
        Nprogress.done()
        if (isWhiteList(to.fullPath)) {
          next()
        } else {
          next('/login')
        }
      })
  } else {
    Nprogress.done()
    next()
  }
})

router.afterEach((to: any) => {
  Nprogress.done()
  if (to.meta.name) {
    document.title = to.meta.name
  }
})

// Duplicate route error
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(
  location: import('vue-router').RawLocation
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return originalPush.call(this, location).catch((err: any) => err)
}

export default router
