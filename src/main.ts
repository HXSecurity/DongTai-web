import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/common.scss'
import './styles/theme/index.css'
import ElementUI from 'element-ui'
import services from "@/services/index";


Vue.config.productionTip = false
Vue.prototype.$services = services

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
