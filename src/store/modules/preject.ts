const state: any = {
  vulnRouteInfo: [],
}

const mutations: any = {
  setVulnRouteInfo(state: any, vulnRouteInfo: any) {
    state.vulnRouteInfo = vulnRouteInfo
  },
}
const actions = {
  setRouteInfo(context: any, val: string) {
    context.commit('setVulnRouteInfo', val)
  },
}

export default {
  state,
  mutations,
  actions,
}
