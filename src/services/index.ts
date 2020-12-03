import createLoginServices from './login'
import createVulnServices from './vuln'
import createScaServices from './sca'
import createSettingServices from './setting'

const createServices = () => new class {
  login = createLoginServices()
  vuln = createVulnServices()
  sca = createScaServices()
  setting = createSettingServices()
}()

const services = createServices()

export default services
