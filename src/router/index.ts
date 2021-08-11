import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/store'
import Nprogress from 'nprogress'
import { getToken } from '@/utils/utils'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes.baseRoutes,
})

let reloadNum = 0

const whiteList = ['/taint', '/taint/search', '/taint/poolDetail', '/login']

const isWhiteList = (path: string) => {
  return whiteList.some((item: string) => {
    return path.indexOf(item) > -1
  })
}

router.beforeEach((to: any, from: any, next: any) => {
  Nprogress.start()

  if (!getToken() && isWhiteList(to.fullPath)) {
    if (reloadNum === 0) {
      reloadNum++
    }
    next()
    return
  }

  if (getToken() && to.fullPath === '/login') {
    if (reloadNum > 5) {
      return
    }
    next('/project')
    return
  }

  // No permission
  if (
    getToken() &&
    !store.getters.userInfo &&
    !whiteList.includes(to.fullPath)
  ) {
    if (reloadNum > 0) {
      return
    }
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
    debugger
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
