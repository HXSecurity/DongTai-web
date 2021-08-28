///api/v1/method_pools

import request from '@/utils/request'
import { iResponse } from '@/services/types'

interface methodPoolSearchParams {
  name: string
  msg: string
  level: string
  sinks?: string[]
  sources?: string[]
  propagators?: string[]
  filters?: string[]
}

export default () =>
  new (class {
    methodList(params: { page: number; pageSize: number }): Promise<iResponse> {
      return request.get('/method_pools', { params })
    }

    // 搜索接口
    methodPoolSearch(
      latest: number,
      params: methodPoolSearchParams
    ): Promise<iResponse> {
      return request.post('/engine/method_pool/search?latest=' + latest, params)
    }

    // 我的策略/系统策略
    engineVulRule(params: { type: string }): Promise<iResponse> {
      return request.get('/engine/vul_rule', { params })
    }

    // 策略详情
    engineVulRuleDetail(params: { rule_id: number }): Promise<iResponse> {
      return request.get('/engine/vul_rule/detail', { params })
    }

    // 保存策略
    vulRuleSave(params: {}, id?: number): Promise<iResponse> {
      let url = '/engine/vul_rule/save'
      if (id) {
        url = url + '?id=' + id
      }
      return request.post(url, params)
    }

    // 策略类型
    vulRuleType(): Promise<iResponse> {
      return request.get('engine/vul_rule/type')
    }

    // 污点池详情
    methodPoolDetail(
      id: string,
      params: methodPoolSearchParams
    ): Promise<iResponse> {
      return request.post(`/engine/method_pool/detail?id=${id}`, params)
    }

    // 重放
    replay(data: any): Promise<iResponse> {
      return request.post(`/engine/request/replay`, data)
    }
    // 重放
    getReplay(params: any): Promise<iResponse> {
      return request.get(`/engine/request/replay`, { params })
    }
    // 搜索功能
    search(params: any): Promise<iResponse> {
      return request.get(`/engine/method_pool/search`, { params })
    }
    // 污点池
    graph(params: any): Promise<iResponse> {
      return request.get(`engine/graph`, { params })
    }
    // 组件列表
    sca(params: any): Promise<iResponse> {
      return request.get(`engine/method_pool/sca`, { params })
    }
  })()
