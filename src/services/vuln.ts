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
  agent_id?: string
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

    // 漏洞概要project
    vulnSummary_project(params: vulnListParams): Promise<iResponse> {
      return request.get('/vuln/summary_project', { params })
    }

    // 漏洞概要type
    vulnSummary_type(params: vulnListParams): Promise<iResponse> {
      return request.get('/vuln/summary_type', { params })
    }

    // 漏洞详情
    getVulnDetail(id: number): Promise<iResponse> {
      return request.get(`/vuln/${id}`, {
        baseURL: process.env.VUE_APP_BASE_API_V2,
      })
    }

    // 漏洞删除
    vulnDelete(id: number): Promise<iResponse> {
      return request.post(`/vuln/delete/${id}`)
    }

    changeStatus(data: any): Promise<iResponse> {
      return request.post(`/vuln/status`, data)
    }

    vulRecheck(data: any): Promise<iResponse> {
      return request.post(`/vul/recheck`, data, {
        baseURL: process.env.VUE_APP_BASE_API_V2,
      })
    }

    vulRecheckAll(data: any): Promise<iResponse> {
      return request.get(`/vul/recheck`, {
        params: data,
        baseURL: process.env.VUE_APP_BASE_API_V2,
      })
    }

    vulStatus(): Promise<iResponse> {
      return request.get(`vul/status_list`)
    }
  })()
