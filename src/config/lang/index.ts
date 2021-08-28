import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

import zh_cn from './zh_cn'

const DEFAULT_LANG = 'zh_cn'

const locals = {
  zh_cn: zh_cn,
}

export const i18n = new VueI18n({
  locale: DEFAULT_LANG,
  messages: locals,
})

// export const langSetUp = lang =>{
//   Vue.config.lang = lang
//   i18n.locale = lang
// }

window.i18n = i18n
