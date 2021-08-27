import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/store'
import Nprogress from 'nprogress'
import { getToken } from '@/utils/utils'
import { i18n } from '@/config/lang'

Vue.use(VueRouter)

const router: any = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes.baseRoutes,
})

let reloadNum = 0

const whiteList = ['/taint', '/taint/search', '/taint/poolDetail', '/login']

const isWhiteList = (path: string) => {
  return whiteList.includes(path)
}

router.beforeEach(async (to: any, from: any, next: any) => {
  Nprogress.start()

  if (getToken() && !store.getters.userInfo) {
    try {
      await store.dispatch('user/getUserInfo')
    } catch (e) {
      await store.dispatch('user/logOut')
    }
  }

  if (getToken() && to.fullPath === '/login') {
    next({ path: '/project' })
    return
  }

  if (getToken()) {
    if (reloadNum) {
      next()
    } else {
      reloadNum++
      next({ ...to, replace: true })
    }
    return
  }

  if (!getToken() && !isWhiteList(to.fullPath)) {
    store.dispatch('user/clearInfo')
    next('/login')
    return
  }

  if (!getToken() && isWhiteList(to.fullPath)) {
    next()
    return
  }
})

router.afterEach((to: any) => {
  Nprogress.done()
  if (to.meta.name) {
    document.title = i18n.t(to.meta.i18n) as string
  }
})

router.onError((error: any) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
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
