import createUserServices from './user'
import createVulnServices from './vuln'
import createScaServices from './sca'
import createSettingServices from './setting'
import createProjectServices from './project'
import createDeployServices from './deploy'

const createServices = () =>
  new (class {
    user = createUserServices()
    vuln = createVulnServices()
    sca = createScaServices()
    setting = createSettingServices()
    project = createProjectServices()
    deploy = createDeployServices()
  })()

const services = createServices()

export default services
