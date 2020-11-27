import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './styles/common.scss'
import './styles/theme/index.css'
import ElementUI from 'element-ui'
import services from "@/services/index";


Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(services)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
