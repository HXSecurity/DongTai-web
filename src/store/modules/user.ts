import { Commit } from 'vuex'
import createUserServices from '@/services/user'
import { Message } from 'element-ui'
import Cookie from 'cookies-js'
import route from '@/router/routes'
import router from '@/router'
import { i18n } from '@/config/lang'

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
    if (userInfo) {
      const language = window.localStorage.getItem(
        userInfo.username + '-language'
      )
      let DEFAULT_LANG = 'zh_cn'
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let lang = language || navigator.language || navigator.userLanguage //常规浏览器语言和IE浏览器
      lang = lang.substr(0, 2) //截取lang前2位字符
      if (lang == 'zh') {
        DEFAULT_LANG = 'zh_cn'
      } else if (lang == 'en') {
        DEFAULT_LANG = 'en'
      } else {
        DEFAULT_LANG = 'zh_cn'
      }
      i18n.locale = DEFAULT_LANG
    }
  },
}

const actions: any = {
  async getUserInfo(context: { commit: Commit }) {
    const { status, msg, data } = await userServices.getUserInfo()

    if (status !== 201) {
      Message.error(msg)
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
      Message.error(msg)
    }
    context.commit('clearInfo')
    window.localStorage.clear()
    router.push({ path: '/login' })
    window.location.reload()
  },
  clearInfo(context: { commit: Commit }) {
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
