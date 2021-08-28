import request from '@/utils/request'
import { iResponse } from '@/services/types'

interface vulnListParams {
  page?: number
  pageSize?: number
  project_id?: string
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

    // 漏洞删除
    vulnDelete(id: number): Promise<iResponse> {
      return request.post(`/vuln/delete/${id}`)
    }

    changeStatus(data: any): Promise<iResponse> {
      return request.post(`/vuln/status`, data)
    }

    vulRecheck(data: any): Promise<iResponse> {
      return request.post(`/vul/recheck`, data)
    }

    vulRecheckAll(data: any): Promise<iResponse> {
      return request.get(`/vul/recheck`, { params: data })
    }
  })()
