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

    timerange(): Promise<iResponse> {
      return request.get('/engine/method_pool/timerange')
    }

    methodPoolSearch(
      latest: number,
      params: methodPoolSearchParams
    ): Promise<iResponse> {
      return request.post('/engine/method_pool/search?latest=' + latest, params)
    }

    engineVulRule(params: { type: string }): Promise<iResponse> {
      return request.get('/engine/vul_rule', { params })
    }

    engineVulRuleDetail(params: { rule_id: number }): Promise<iResponse> {
      return request.get('/engine/vul_rule/detail', { params })
    }

    vulRuleSave(params: any, id?: number): Promise<iResponse> {
      let url = '/engine/vul_rule/save'
      if (id) {
        url = url + '?id=' + id
      }
      return request.post(url, params)
    }

    vulRuleType(): Promise<iResponse> {
      return request.get('engine/vul_rule/type')
    }

    methodPoolDetail(
      id: string,
      params: methodPoolSearchParams
    ): Promise<iResponse> {
      return request.post(`/engine/method_pool/detail?id=${id}`, params)
    }

    replay(data: any): Promise<iResponse> {
      return request.post(`/engine/request/replay`, data)
    }
    getReplay(params: any): Promise<iResponse> {
      return request.get(`/engine/request/replay`, { params })
    }
    search(params: any): Promise<iResponse> {
      return request.post(`/engine/method_pool/search`, params)
    }
    graph(params: any): Promise<iResponse> {
      return request.get(`engine/graph`, { params })
    }
    sca(params: any): Promise<iResponse> {
      return request.get(`engine/method_pool/sca`, { params })
    }
  })()
