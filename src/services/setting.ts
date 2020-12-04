import request from '@/utils/request'

interface agentListParams {
  page: number
  pageSize: number
}

export default () => new class {
  // 引擎管理-引擎列表
  agentList(params: agentListParams) {
    return request.get('/agents', {params})
  }
  // 引擎管理-安装
  agentInstall(params:{id:number}){
    return request.post('/agent/install',params)
  }
  // 引擎管理-卸载
  agentUninstall(params:{id:number}){
    return request.post('/agent/uninstall',params)
  }
}
