import Vue from 'vue'
import VueI18n from 'vue-i18n'
import el_en from '@/el-en'
import el_cn from '@/el-cn'
import Cookie from 'cookies-js'

Vue.use(VueI18n)

import zh_cn from './zh_cn'
import en from './en'
let DEFAULT_LANG = 'zh_cn'
let lang =
  Cookie.get('django_language') ||
  (navigator as any).language ||
  (navigator as any).userLanguage //常规浏览器语言和IE浏览器
lang = lang.substr(0, 2) //截取lang前2位字符
if (lang == 'zh') {
  DEFAULT_LANG = 'zh_cn'
} else if (lang == 'en') {
  DEFAULT_LANG = 'en'
} else {
  DEFAULT_LANG = 'zh_cn'
}

const locals = {
  zh_cn: { ...el_cn, ...zh_cn },
  en: { ...en, ...el_en },
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
