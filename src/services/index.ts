import createLoginServices from "@/services/login";

const createServices = () => new class {
  login: object | undefined
}

const services = createServices()
services.login = createLoginServices()

export default {
  install: (Vue: any) => {
    Vue.$services = Vue.prototype.$services = services
  }
}
