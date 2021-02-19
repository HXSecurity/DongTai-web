///api/v1/method_pools

import request from '@/utils/request'
import { iResponse } from '@/services/types'

interface methodPoolSearchParams {
  id?: string
  msg?: string
  level?: string
  sinks?: string[]
  sources?: string[]
  propagators?: string[]
}

enum engineVulRuleType{
  user,
  system
}

export default () =>
  new (class {
    methodList(params: {
      page: number
      pageSize: number
    }): Promise<iResponse> {
      return request.get('/method_pools', { params })
    }

    // 搜索接口
    methodPoolSearch(params: methodPoolSearchParams): Promise<iResponse> {
      return request.post('/engine/method_pool/search', params)
    }

    // 我的策略/系统策略
    engineVulRule(params: {
      type: string
    }): Promise<iResponse> {
      return request.get('/engine/vul_rule', { params })
    }

    // 策略详情
    engineVulRuleDetail(params:{
      rule_id: number
    }): Promise<iResponse> {
      return request.get('/engine/vul_rule/detail', { params })
    }

  })()
