import request from '@/utils/request'
import { iResponse } from '@/services/types'
import axios from 'axios'

interface agentListParams {
  page: number
  pageSize: number
}

export default () =>
  new (class {
    agentUpdate(): Promise<iResponse> {
      return request.get('/agent/status/update', { timeout: 1000 })
    }

    aliasModified(data: any): Promise<iResponse> {
      return request.post('/agent/alias/modified', data)
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

    strategyList(all: boolean, params: any): Promise<iResponse> {
      if (all) {
        return request.get(`/strategys`)
      } else {
        return request.get(
          `/strategys?page=${params.page}&page_size=${params.page_size}&name=${params.name}`
        )
      }
    }

    getStrategy(id: any): Promise<iResponse> {
      return request.get(`/strategy/${id}`)
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

    updateManage(id: string, data: any): Promise<iResponse> {
      return request.put(`/strategy/${id}/update`, data)
    }

    deleteManage(id: string): Promise<iResponse> {
      return request.delete(`/strategy/${id}/delete`)
    }

    addManage(data: any): Promise<iResponse> {
      return request.post(`/strategys`, data)
    }

    vul_levels(): Promise<iResponse> {
      return request.get('/vul_levels')
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
      keyword?: string
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

    searchProject(params: any): Promise<iResponse> {
      return request.get(`/project/search`, { params })
    }

    health(): Promise<iResponse> {
      return request.get(`/health`)
    }

    ossHealth(): Promise<iResponse> {
      return request.get(`/oss/health`)
    }

    profileGet(data: any): Promise<iResponse> {
      return request.post(`/profile/batch/get`, data)
    }

    profileModified(data: any): Promise<iResponse> {
      return request.post(`/profile/batch/modified`, data)
    }

    get_sensitive_info_rule(params: any): Promise<iResponse> {
      return request.get(
        `/sensitive_info_rule?page=${params.page}&page_size=${params.page_size}&name=${params.name}`
      )
    }

    pattern_type(): Promise<iResponse> {
      return request.get(`/sensitive_info_rule/pattern_type`)
    }

    create_sensitive_info_rule(data: any): Promise<iResponse> {
      return request.post(`/sensitive_info_rule`, data)
    }

    update_sensitive_info_rule(data: any): Promise<iResponse> {
      return request.put(`/sensitive_info_rule/${data.id}`, data)
    }

    get_sensitive_info_rule_one(data: any): Promise<iResponse> {
      return request.get(`/sensitive_info_rule/${data.id}`)
    }

    delete_sensitive_info_rule_one(data: any): Promise<iResponse> {
      return request.delete(`/sensitive_info_rule/${data.id}`)
    }
    regex_validation(data: any): Promise<iResponse> {
      return request.post(`/sensitive_info_rule/${data.url}_validation`, data)
    }

    get_scan_strategy(params: any): Promise<iResponse> {
      return request.get(
        `/scan_strategy?page=${params.page}&page_size=${params.page_size}&name=${params.name}`
      )
    }

    create_scan_strategy(data: any): Promise<iResponse> {
      return request.post(`/scan_strategy`, data)
    }

    update_scan_strategy(data: any): Promise<iResponse> {
      return request.put(`/scan_strategy/${data.id}`, data)
    }

    get_scan_strategy_one(data: any): Promise<iResponse> {
      return request.get(`/scan_strategy/${data.id}`)
    }

    delete_scan_strategy_one(data: any): Promise<iResponse> {
      return request.delete(`/scan_strategy/${data.id}`)
    }
    version(): Promise<iResponse> {
      return axios.get(
        `https://api.github.com/repos/HXSecurity/DongTai/releases/latest`
      )
    }

    nowVersion(): Promise<iResponse> {
      return axios.get(`/version.txt?v=` + Math.random())
    }

    versionlist(): Promise<iResponse> {
      return request.get(`/version_control/versionlist`)
    }

    get_sca_strategy(params: any): Promise<iResponse> {
      return request.get(
        `/scadb/maven/bulk?page=${params.page}&page_size=${params.page_size}&name=${params.name}`
      )
    }

    edit_sca(data: any): Promise<iResponse> {
      return request.put(`/scadb/maven/${data.id}`, data)
    }

    add_sca(data: any): Promise<iResponse> {
      delete data.id
      return request.post(`/scadb/maven`, data)
    }

    delete_sca(params: any): Promise<iResponse> {
      return request.delete(`/scadb/maven/${params.id}`)
    }

    delete_sca_bulk(data: any): Promise<iResponse> {
      return request.post(`/scadb/maven/bulk/delete`, data)
    }

    sca_stat(): Promise<iResponse> {
      return request.get(`/scadb/maven/stat`)
    }

    get_license_list(): Promise<iResponse> {
      return request.get(`/scadb/license_list`)
    }
    get_threshold(): Promise<iResponse> {
      return request.get(`/threshold/settings/get`)
    }

    save_threshold(data: any): Promise<iResponse> {
      return request.post(`/threshold/settings`, data)
    }

    webhook_type(): Promise<iResponse> {
      return request.get(`/webhook/type/list`)
    }

    webhook_get(): Promise<iResponse> {
      return request.get(`/webhook/settings/get`)
    }
    webhook_set(data: any): Promise<iResponse> {
      return request.post(`/webhook/settings`, data)
    }
    webhook_delete(data: any): Promise<iResponse> {
      return request.post(`/webhook/type/del`, data)
    }
    update_core(data: any): Promise<iResponse> {
      return request.post(`/agent/core/update`, data)
    }
  })()
