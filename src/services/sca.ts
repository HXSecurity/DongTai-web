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
    // scaList
    scaList(params: scaListParams): Promise<iResponse> {
      return request.get('/scas', { params })
    }

    // scaSummary
    scaSummary(params: scaListParams): Promise<iResponse> {
      return request.get('/sca/summary', { params })
    }

    // getScaDetail
    getScaDetail(id: number): Promise<iResponse> {
      return request.get(`/sca/${id}`)
    }
  })()
