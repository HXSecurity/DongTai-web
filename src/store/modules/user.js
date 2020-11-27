import createLoginServices from '@/services/login'
import { Message } from 'element-ui'

const loginServices = createLoginServices()

const state = {
  userInfo: null
}

const actions = {
  async getUserInfo ({ commit }) {
    const { status, msg, data } = await loginServices.getUserInfo()
    if (status !== 201) {
      Message.error(msg)
      return
    }
    commit('UPDATE_USER_INFO', data)
  },

  async logOut ({ commit }) {
    const { status, msg } = await loginServices.logout()
    if (status !== 201) {
      Message.error(msg)
      return
    }
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
