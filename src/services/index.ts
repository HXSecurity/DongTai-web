import createUserServices from './user'
import createVulnServices from './vuln'
import createScaServices from './sca'
import createSettingServices from './setting'
import createProjectServices from './project'
import createDeployServices from './deploy'
import createTalentServices from './talent'
import createDepartmentServices from './department'
import createTaintService from './taint'

const createServices = () =>
  new (class {
    user = createUserServices()
    talent = createTalentServices()
    department = createDepartmentServices()
    vuln = createVulnServices()
    sca = createScaServices()
    setting = createSettingServices()
    project = createProjectServices()
    deploy = createDeployServices()
    taint = createTaintService()
  })()

const services = createServices()

export default services
