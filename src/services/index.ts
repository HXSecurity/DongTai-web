import createLoginServices from './login'
import createVulnServices from './vuln'

const createServices = () => new class {
  login: object | undefined
  vuln: object | undefined
}()

const services = createServices()
services.login = createLoginServices()
services.vuln = createVulnServices()

export default {
  install: (Vue: any) => {
    Vue.prototype.$services = services
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $services: any;
  }
}
