import createUserServices from './user'
import createVulnServices from './vuln'
import createScaServices from './sca'
import createSettingServices from './setting'
import createProjectServices from './project'

const createServices = () =>
  new (class {
    user = createUserServices()
    vuln = createVulnServices()
    sca = createScaServices()
    setting = createSettingServices()
    project = createProjectServices()
  })()

const services = createServices()

export default services
