import request from '@/utils/request'
import { iResponse } from '@/services/types'

interface vulnListParams {
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
    // 漏洞列表
    vulnList(params: vulnListParams): Promise<iResponse> {
      return request.get('/vulns', { params })
    }

    // 漏洞概要
    vulnSummary(params: vulnListParams): Promise<iResponse> {
      return request.get('/vuln/summary', { params })
    }

    // 漏洞详情
    getVulnDetail(id: number): Promise<iResponse> {
      return request.get(`/vuln/${id}`)
    }
  })()
