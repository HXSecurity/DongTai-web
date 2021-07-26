import request from '@/utils/request'
import { iResponse } from '@/services/types'

interface agentListParams {
  page: number
  pageSize: number
}

export default () =>
  new (class {
    // 引擎管理-引擎列表
    agentUpdate(): Promise<iResponse> {
      return request.get('/agent/status/update', { timeout: 1000 })
    }

    // 引擎管理-引擎列表
    agentList(params: agentListParams): Promise<iResponse> {
      return request.get('/agents', { params })
    }

    // 引擎管理-安装
    agentInstall(params: { id: number }): Promise<iResponse> {
      return request.post('/agent/install', params)
    }

    // 引擎管理-卸载
    agentUninstall(params: { id: number }): Promise<iResponse> {
      return request.post('/agent/uninstall', params)
    }

    // 引擎管理-开启工作
    agentStart(params: { id: number }): Promise<iResponse> {
      return request.post('/agent/start', params)
    }

    // 引擎管理-暂停
    agentStop(params: { id: number }): Promise<iResponse> {
      return request.post('/agent/stop', params)
    }

    // 引擎管理-删除
    agentDelete(params: { id: number }): Promise<iResponse> {
      return request.get('/agent/' + params.id + '/delete')
    }

    // 策略管理-策略列表
    strategyList(): Promise<iResponse> {
      return request.get('/strategys')
    }

    // 策略管理-策略启用
    strategyEnable(id: number): Promise<iResponse> {
      return request.get(`/strategy/${id}/enable`)
    }

    // 策略管理-策略禁用
    strategyDisable(id: number): Promise<iResponse> {
      return request.get(`/strategy/${id}/disable`)
    }

    // 在线升级
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

    // 离线升级
    upgradeOffline(params: any): Promise<iResponse> {
      return request.post('/agent/upgrade/offline', params)
    }

    // 日志列表
    logList(params: { page: number; pageSize: number }): Promise<iResponse> {
      return request.get('/logs', { params })
    }

    // 删除指定操作日志
    logDelete(params: { ids: string }): Promise<iResponse> {
      return request.post('/log/delete', params)
    }

    // 清空日志
    logClear(): Promise<iResponse> {
      return request.get('/log/clear')
    }

    // // 导出日志
    // logExport(params: { ids: string }): Promise<iResponse> {
    //   return request.get('/log/export', { params })
    // }

    // 用户查询自有创建策略
    strategyUserList(): Promise<iResponse> {
      return request.get('/strategy/user/list')
    }

    // 按等级获取策略类型
    strategyTypes(): Promise<iResponse> {
      return request.get('/strategy/types')
    }

    // 用户创建策略
    strategyUserAdd(params: { ids: string; name: string }): Promise<iResponse> {
      return request.post('/strategy/user/add', params)
    }

    // HOOK规则-规则概览
    hookRuleSummary(): Promise<iResponse> {
      return request.get('/engine/hook/rule/summary')
    }

    // HOOK规则-规则列表
    hookRuleList(params: {
      type: string
      page: number
      pageSize: number
      strategy_type?: any
    }): Promise<iResponse> {
      return request.get('/engine/hook/rules', { params })
    }

    // HOOK规则-添加规则类型
    ruleTypes(params: { type: string }): Promise<iResponse> {
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

    // HOOK规则-添加规则
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

    // HOOK规则-添加规则
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

    // HOOK规则-禁用规则
    ruleDisable(params: { rule_id: string }): Promise<iResponse> {
      return request.get('/engine/hook/rule/disable', { params })
    }

    // HOOK规则-禁用规则
    ruleEnable(params: { rule_id: string }): Promise<iResponse> {
      return request.get('/engine/hook/rule/enable', { params })
    }

    // HOOK规则-禁用规则
    changeStatusBatch(data: any): Promise<iResponse> {
      return request.post('/engine/hook/rule/status', data)
    }

    // HOOK规则-禁用规则
    changeStatus(params: any): Promise<iResponse> {
      return request.get('/engine/hook/rule/status', { params })
    }
    // HOOK规则-删除规则
    ruleDelete(params: { rule_id: string }): Promise<iResponse> {
      return request.get('/engine/hook/rule/delete', { params })
    }

    // 策略-删除策略
    updateManage(id: string, data: any): Promise<iResponse> {
      return request.put(`/strategy/${id}/update`, data)
    }

    // 策略-删除策略
    deleteManage(id: string): Promise<iResponse> {
      return request.delete(`/strategy/${id}/delete`)
    }
    // 获取openapi
    openapi(): Promise<iResponse> {
      return request.get(`/openapi`)
    }
    setOpenapi(data: any): Promise<iResponse> {
      return request.post(`/openapi`, data)
    }

    searchProject(params: any): Promise<iResponse> {
      return request.get(`/project/search`,  { params })
    }
  })()
