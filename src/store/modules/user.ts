import { Commit } from 'vuex'
import createUserServices from '@/services/user'
import { Message } from 'element-ui'
import Cookie from 'cookies-js'
import route from '@/router/routes'
import router from '@/router'
import { i18n } from '@/config/lang'
let flag = false
const userServices = createUserServices()

const state: any = {
  userInfo: null,
  routers: route.baseRoutes,
}

const mutations: any = {
  SET_ROUTER(state: any, routers: []) {
    state.routers[0].children.splice(1, 1)
    state.routers[0].children.push(...routers, {
      path: '*',
      redirect: '/',
    })
    router.addRoutes(state.routers)
  },
  UPDATE_USER_INFO(state: any, userInfo: any) {
    state.userInfo = userInfo
  },
}

const actions: any = {
  async getUserInfo(context: { commit: Commit }) {
    if (flag) {
      return
    }
    flag = true
    const { status, infoMsg, data } = await userServices.getUserInfo()
    if (status !== 201) {
      Message({ message: infoMsg, type: 'error' })
      const { status, msg } = await userServices.logout()
      if (status !== 201) {
        Message({ message: msg, type: 'error' })
        return
      }
      context.commit('clearInfo')
      window.localStorage.clear()
      window.location.reload()
      return
    }
    switch (data.role) {
      case 1:
        context.commit('SET_ROUTER', route.routes)
        break
      case 2:
        context.commit('SET_ROUTER', route.adminRoutes)
        break
      default:
        context.commit('SET_ROUTER', route.userRoutes)
        break
    }
    context.commit('UPDATE_USER_INFO', data)
  },
  async logOut(context: { commit: Commit }) {
    const { status, msg } = await userServices.logout()
    if (status !== 201) {
      Message({ message: msg, type: 'error' })
      return
    }
    context.commit('clearInfo')
    window.localStorage.clear()
    window.location.reload()
  },
  clearInfo(context: { commit: Commit }) {
    flag = false
    Cookie.expire('sessionid')
    Cookie.expire('DTCsrfToken')
    context.commit('UPDATE_USER_INFO', null)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
