import { Commit } from 'vuex'
import createUserServices from '@/services/user'
import { Message } from 'element-ui'
import Cookie from 'cookies-js'
import route from '@/router/routes'
import router from '@/router'
const userServices = createUserServices()

const state: any = {
  userInfo: null,
  routers: route.baseRoutes,
}

const mutations: any = {
  SET_ROUTER(state: any, routers: []) {
    state.routers[0].children.push(...routers)
    router.addRoutes(state.routers)
  },
  UPDATE_USER_INFO(state: any, userInfo: any) {
    state.userInfo = userInfo
  },
}

const actions: any = {
  async getUserInfo(context: { commit: Commit }) {
    const { status, msg, data } = await userServices.getUserInfo()

    if (status !== 201) {
      Message.error(msg)
    }
    context.commit('UPDATE_USER_INFO', data)
    context.commit('SET_ROUTER', route.routes)
  },
  async logOut(context: { commit: Commit }) {
    const { status, msg } = await userServices.logout()
    if (status !== 201) {
      Message.error(msg)
    }
    Cookie.expire('sessionid')
    Cookie.expire('DTCsrfToken')
    context.commit('UPDATE_USER_INFO', null)
    window.location.reload()
  },
  clearInfo(context: { commit: Commit }) {
    Cookie.expire('sessionid')
    Cookie.expire('DTCsrfToken')
    context.commit('UPDATE_USER_INFO', null)
    window.location.reload()
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
