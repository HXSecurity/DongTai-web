import request from '@/utils/request'
import { iResponse } from '@/services/types'
import axios from 'axios'

interface agentListParams {
  page: number
  page_size: number
}

export default () =>
  new (class {
    enum(): Promise<iResponse> {
      return request.get('/circuit_config/enum/all')
    }

    agentUpdate(): Promise<iResponse> {
      return request.get('/agent/status/update', { timeout: 1000 })
    }

    aliasModified(data: any): Promise<iResponse> {
      return request.post('/agent/alias/modified', data)
    }

    audit(data: any): Promise<iResponse> {
      return request.post('/agent/audit', data)
    }

    // agentList(params: any): Promise<iResponse> {
    //   return request.get('/agents', { params })
    // agentList(params: agentListParams): Promise<iResponse> {
    //   return request.get('/agents', { params })
    // }

    stat(params: any): Promise<iResponse> {
      return request.get('/agents/stat', {
        params,
        baseURL: process.env.VUE_APP_BASE_API_V2,
      })
    }

    summary(): Promise<iResponse> {
      return request.get('/agents/summary', {
        baseURL: process.env.VUE_APP_BASE_API_V2,
      })
    }

    agentList(params: any): Promise<iResponse> {
      return request.get('/agents', {
        params,
        baseURL: process.env.VUE_APP_BASE_API_V2,
      })
    }

    agentInstall(params: { id: number }): Promise<iResponse> {
      return request.post('/agent/install', params)
    }
    // 状态管理-保持变更
    getDataClean(params: any): Promise<iResponse> {
      return request.get('/systemmonitor/data_clean', {
        params,
      })
    }
    // 状态管理-修改变更
    dataClean(params: any): Promise<iResponse> {
      return request.post('/systemmonitor/data_clean', params)
    }
    // 状态管理-立即清理
    dataCleanTask(params: any): Promise<iResponse> {
      return request.post('/systemmonitor/data_clean/task', params)
    }
    
    //获取交叉验证配置
    getCrossValid(params: any): Promise<iResponse> {
      return request.get('/dastvul/settings', {
        params,
      })
    }
    
    // 更新交叉验证配置
    updateCrossValid(params: any): Promise<iResponse> {
      return request.post('/dastvul/settings', params)
    }

    // 扫描器文档
    getDocuments(params: any): Promise<iResponse> {
      return request.get(`/dastvul/settings/doc`, {params})
    }

    agentUninstall(params: any): Promise<iResponse> {
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

    vulRecheckPayload(params: any): Promise<iResponse> {
      return request.get('/vul_recheck_payload', { params })
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

    ruleAdd(params: any): Promise<iResponse> {
      return request.post('/engine/hook/rule/add', params)
    }
    modifyAdd(params: any): Promise<iResponse> {
      return request.post('/engine/hook/rule/modify', params)
    }

    vul_recheck_payload(params: any): Promise<iResponse> {
      return request.post('/vul_recheck_payload', params)
    }

    edit_vul_recheck_payload(data: any): Promise<iResponse> {
      return request.put('/vul_recheck_payload/' + data.id, data)
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

    changeVulStatus(data: any): Promise<iResponse> {
      return request.put('/vul_recheck_payload/status', data)
    }

    delVulStatus(data: any): Promise<iResponse> {
      return request.delete('/vul_recheck_payload/' + data.id)
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

    machinecode(): Promise<iResponse> {
      return request.get(`/license/machinecode`)
    }

    isAuthenticated(): Promise<iResponse> {
      return request.get(`/license/is_authenticated`)
    }

    uploadLicense(data: any): Promise<iResponse> {
      return request.post(`/license/upload_license`, data)
    }

    detailLicense(): Promise<iResponse> {
      return request.get(`/license/detail_license`)
    }

    currentConcurrency(): Promise<iResponse> {
      return request.get(`/license/current_concurrency`)
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

    circuitPriority(row: any, data: any): Promise<iResponse> {
      return request.put(`/circuit_config/${row.id}/priority`, data)
    }

    circuitReset(row: any): Promise<iResponse> {
      return request.put(`/circuit_config/${row.id}/reset`)
    }

    get_threshold(): Promise<iResponse> {
      return request.get(`/circuit_config`)
    }

    createCircuit(data: any): Promise<iResponse> {
      return request.post(`/circuit_config`, data)
    }

    updateCircuit(data: any): Promise<iResponse> {
      return request.put(`/circuit_config/` + data.id, data)
    }
    getCircuit(id: any): Promise<iResponse> {
      return request.get(`/circuit_config/` + id)
    }

    save_threshold(data: any): Promise<iResponse> {
      return request.post(`/threshold/settings`, data)
    }
    get_threshold_byid(id: any): Promise<iResponse> {
      return request.get(`/threshold/settings/get/` + id)
    }

    del_threshold(data: any): Promise<iResponse> {
      return request.delete(`/circuit_config/` + data.id)
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
    log_export_batch(data: any): Promise<iResponse> {
      return request.post(`/agent/log/batch`, data)
    }

    update_core_all(data: any): Promise<iResponse> {
      return request.post(`/agent/core/update/all`, data)
    }
    // 配置模版
    creatProjecttemplat(data: any): Promise<iResponse> {
      return request.post(`/projecttemplate`, data)
    }
    listProjecttemplat(params: any): Promise<iResponse> {
      return request.get(
        `/projecttemplate?page=${params.page}&page_size=${params.page_size}`
      )
    }
    getProjecttemplat(params: any): Promise<iResponse> {
      return request.get(`/projecttemplate/${params.id}`)
    }
    putProjecttemplat(data: any): Promise<iResponse> {
      return request.put(`/projecttemplate/` + data.id, data)
    }
    delProjecttemplat(data: any): Promise<iResponse> {
      return request.delete(`/projecttemplate/` + data.id)
    }
    getEnum(): Promise<iResponse> {
      return request.get('/hook_rule/enum', { timeout: 1000 })
    }
  })()
