import createUserServices from './user'
import createVulnServices from './vuln'
import createScaServices from './sca'
import createSettingServices from './setting'
import createProjectServices from './project'
import createDeployServices from './deploy'
import createTaintService from './taint'
import createRoleService from './role'
import createMessageService from './message'

const createServices = () =>
  new (class {
    user = createUserServices()
    vuln = createVulnServices()
    sca = createScaServices()
    setting = createSettingServices()
    project = createProjectServices()
    deploy = createDeployServices()
    taint = createTaintService()
    role = createRoleService()
    message = createMessageService()
  })()

const services = createServices()

export default services
