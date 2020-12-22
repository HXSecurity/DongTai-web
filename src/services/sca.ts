import request from '@/utils/request'
import { iResponse } from '@/services/types'

interface scaListParams {
  page?: number
  pageSize?: number
  language?: string
  level?: string
  type?: string
  app?: string
  url?: string
  order?: string
}

export default () =>
  new (class {
    // 组件列表
    scaList(params: scaListParams): Promise<iResponse> {
      return request.get('/scas', { params })
    }

    // 组件概要
    scaSummary(params: scaListParams): Promise<iResponse> {
      return request.get('/sca/summary', { params })
    }

    // 组件详情
    getScaDetail(id: number): Promise<iResponse> {
      return request.get(`/sca/${id}`)
    }
  })()
