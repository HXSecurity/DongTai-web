import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import './styles/common.scss'
import './styles/theme/index.css'
import './styles/iconfont/iconfont.css'
import './styles/iconfont/iconfont'
import ElementUI from 'element-ui'
import { i18n } from '@/config/lang'
import MyMarkdownIt from '@/components/markdownNice/Index'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.component('MyMarkdownIt', MyMarkdownIt)

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
