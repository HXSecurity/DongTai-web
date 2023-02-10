import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import preject from './modules/preject'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    preject,
  },
  getters: {
    userInfo: (state: any) => state.user.userInfo,
    vulnRouteInfo: (state: any) => state.preject.vulnRouteInfo,
    routers: (state: any) => state.user.routers,
  },
})
