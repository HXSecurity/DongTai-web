import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import './styles/common.scss'
import './styles/theme/index.css'
import './styles/iconfont/iconfont.css'
import './styles/iconfont/iconfont'
import 'view-design/dist/styles/iview.css'
import ElementUI from 'element-ui'
import { i18n } from '@/config/lang'
import MyMarkdownIt from '@/components/markdownNice/Index'
import { dot } from '@/directive/dot'
import VueClipboard from 'vue-clipboard2'
import VueDOMPurifyHTML from 'vue-dompurify-html'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Vue.use(VueDOMPurifyHTML,{ 
	default: {
			KEEP_CONTENT: false
	}
})
Vue.use(VueClipboard)
Vue.config.productionTip = false

Vue.use(ElementUI, { i18n: (key: any, value: any) => i18n.t(key, value) })
Vue.component('MyMarkdownIt', MyMarkdownIt)
dot(Vue)
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
