import createUserServices from '@/services/user'
import { Message } from 'element-ui'

const userServices = createUserServices()

const state = {
  userInfo: null
}

const actions = {
  async getUserInfo ({ commit }) {
    const { status, msg, data } = await userServices.getUserInfo()
    if (status !== 201) {
      Message.error(msg)
      return
    }
    commit('UPDATE_USER_INFO', data)
  },
  async logOut ({ commit }) {
    const { status, msg } = await userServices.logout()
    if (status !== 201) {
      Message.error(msg)
      return
    }
    commit('UPDATE_USER_INFO', null)
  },
  clearInfo ({ commit }) {
    commit('UPDATE_USER_INFO', null)
  }
}

const mutations = {
  UPDATE_USER_INFO (state, userInfo) {
    state.userInfo = userInfo
  }
}

export default {
  state,
  actions,
  mutations
}
