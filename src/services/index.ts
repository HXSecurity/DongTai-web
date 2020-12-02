import createLoginServices from './login'
import createVulnServices from './vuln'
import createScaServices from './sca'

const createServices = () => new class {
  login: object | undefined
  vuln: object | undefined
  sca: object | undefined
}()

const services = createServices()
services.login = createLoginServices()
services.vuln = createVulnServices()
services.sca = createScaServices()

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
