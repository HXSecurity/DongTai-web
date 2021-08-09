import { Commit } from 'vuex'
import createUserServices from '@/services/user'
import createRoleServices from '@/services/role'
import { Message } from 'element-ui'
import { clearCookie } from '@/utils/utils'

const userServices = createUserServices()
const roleServices = createRoleServices()

const state: any = {
  userInfo: null,
  routers: [],
}

const mutations: any = {
  SET_ROUTER(state: any, routers: []) {
    state.routers = routers
  },
  UPDATE_USER_INFO(state: any, userInfo: any) {
    state.userInfo = userInfo
  },
}

const actions: any = {
  async getUserInfo(context: { commit: Commit }) {
    const { status, msg, data } = await userServices.getUserInfo()
    // const res = await roleServices.getRoute()
    // context.commit('SET_ROUTER', res.data)
    if (status !== 201) {
      Message.error(msg)
    }
    context.commit('UPDATE_USER_INFO', data)
  },
  async logOut(context: { commit: Commit }) {
    const { status, msg } = await userServices.logout()
    if (status !== 201) {
      Message.error(msg)
    }
    clearCookie('sessionid')
    clearCookie('DTCsrfToken')
    context.commit('UPDATE_USER_INFO', null)
  },
  clearInfo(context: { commit: Commit }) {
    clearCookie('sessionid')
    clearCookie('DTCsrfToken')
    context.commit('UPDATE_USER_INFO', null)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
