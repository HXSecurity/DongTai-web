import request from '@/utils/request'
import { iResponse } from '@/services/types'

interface agentListParams {
  page: number
  pageSize: number
}

export default () =>
  new (class {
    agentUpdate(): Promise<iResponse> {
      return request.get('/agent/status/update', { timeout: 1000 })
    }

    agentList(params: agentListParams): Promise<iResponse> {
      return request.get('/agents', { params })
    }

    agentInstall(params: { id: number }): Promise<iResponse> {
      return request.post('/agent/install', params)
    }

    agentUninstall(params: { id: number }): Promise<iResponse> {
      return request.post('/agent/uninstall', params)
    }

    agentStart(params: any): Promise<iResponse> {
      return request.post('/agent/start', params)
    }

    agentStop(params: any): Promise<iResponse> {
      return request.post('/agent/stop', params)
    }

    agentDelete(params: { id: number }): Promise<iResponse> {
      return request.get('/agent/' + params.id + '/delete')
    }

    strategyList(): Promise<iResponse> {
      return request.get('/strategys')
    }

    strategyEnable(id: number): Promise<iResponse> {
      return request.get(`/strategy/${id}/enable`)
    }

    strategyDisable(id: number): Promise<iResponse> {
      return request.get(`/strategy/${id}/disable`)
    }

    deleteAgents(params: any): Promise<iResponse> {
      return request.get(`/agents/delete`, { params })
    }

    upgradeOnline(
      Authorization: string,
      data: { url: string; token: string }
    ): Promise<iResponse> {
      // return request.post('/agent/upgrade/online', params)
      return request({
        method: 'post',
        url: '/agent/upgrade/online',
        data,
        headers: {
          Authorization,
        },
      }).then()
    }

    upgradeOffline(params: any): Promise<iResponse> {
      return request.post('/agent/upgrade/offline', params)
    }

    logList(params: { page: number; pageSize: number }): Promise<iResponse> {
      return request.get('/logs', { params })
    }

    logDelete(params: { ids: string }): Promise<iResponse> {
      return request.post('/log/delete', params)
    }

    logClear(): Promise<iResponse> {
      return request.get('/log/clear')
    }

    // logExport(params: { ids: string }): Promise<iResponse> {
    //   return request.get('/log/export', { params })
    // }

    setLang(language: string): Promise<iResponse> {
      return request.get('/i18n/setlang?language=' + language)
    }

    strategyUserList(): Promise<iResponse> {
      return request.get('/strategy/user/list')
    }

    strategyTypes(): Promise<iResponse> {
      return request.get('/strategy/types')
    }

    strategyUserAdd(params: { ids: string; name: string }): Promise<iResponse> {
      return request.post('/strategy/user/add', params)
    }

    hookRuleSummary(params: { language_id: number }): Promise<iResponse> {
      return request.get('/engine/hook/rule/summary', { params })
    }

    programLanguage(): Promise<iResponse> {
      return request.get('/program_language')
    }

    hookRuleList(params: {
      type: string
      page: number
      pageSize: number
      strategy_type?: any
      language_id: number
    }): Promise<iResponse> {
      return request.get('/engine/hook/rules', { params })
    }

    ruleTypes(params: {
      type: string
      language_id: number
    }): Promise<iResponse> {
      return request.get('/engine/hook/rule_types', { params })
    }
    ruleTypeAdd(params: {
      type: string
      name: string
      short_name: string
      enable: number
    }): Promise<iResponse> {
      return request.post('/engine/hook/rule_type/add', params)
    }

    ruleAdd(params: {
      rule_type_id: string
      rule_value: string
      rule_source: string
      rule_target: string
      inherit: string
      track: string
    }): Promise<iResponse> {
      return request.post('/engine/hook/rule/add', params)
    }
    modifyAdd(params: {
      rule_id: number
      rule_type_id: string
      rule_value: string
      rule_source: string
      rule_target: string
      inherit: string
      track: string
    }): Promise<iResponse> {
      return request.post('/engine/hook/rule/modify', params)
    }

    ruleDisable(params: { rule_id: string }): Promise<iResponse> {
      return request.get('/engine/hook/rule/disable', { params })
    }

    ruleEnable(params: { rule_id: string }): Promise<iResponse> {
      return request.get('/engine/hook/rule/enable', { params })
    }

    changeStatusBatch(data: any): Promise<iResponse> {
      return request.post('/engine/hook/rule/status', data)
    }

    changeStatus(params: any): Promise<iResponse> {
      return request.get('/engine/hook/rule/status', { params })
    }
    ruleDelete(params: { rule_id: string }): Promise<iResponse> {
      return request.get('/engine/hook/rule/delete', { params })
    }

    updateManage(id: string, data: any): Promise<iResponse> {
      return request.put(`/strategy/${id}/update`, data)
    }

    deleteManage(id: string): Promise<iResponse> {
      return request.delete(`/strategy/${id}/delete`)
    }
    openapi(): Promise<iResponse> {
      return request.get(`/openapi`)
    }
    setOpenapi(data: any): Promise<iResponse> {
      return request.post(`/openapi`, data)
    }

    searchProject(params: any): Promise<iResponse> {
      return request.get(`/project/search`, { params })
    }

    health(): Promise<iResponse> {
      return request.get(`/health`)
    }

    ossHealth(): Promise<iResponse> {
      return request.get(`/oss/health`)
    }
  })()
