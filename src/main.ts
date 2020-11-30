import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import './styles/common.scss'
import './styles/theme/index.css'
import ElementUI from 'element-ui'
import services from '@/services/index'
import { i18n } from '@/config/lang'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(services)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
