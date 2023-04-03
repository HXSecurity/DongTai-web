import request from '@/utils/request'
import { iResponse } from '@/services/types'
import { Params } from './../views/taint/types/search.d'

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
    // 查看日志
    vullog(id: any, vul_type: any): Promise<iResponse> {
      return request.get('/vullog/' + id + '?vul_type=' + vul_type)
    }

    // 获取项目
    integrationProject(params: any): Promise<iResponse> {
      return request.get('/integration/projects', { params })
    }

    integrationIssue(data: any, type: any): Promise<iResponse> {
      return request.post(
        `/integration/issue?integration_type=` +
          type +
          '&vul_id=' +
          data.vul_id,
        data
      )
    }

    integrationMeta(params: any): Promise<iResponse> {
      return request.get('/integration/project/meta', { params })
    }

    vulnList(params: vulnListParams): Promise<iResponse> {
      // sca_vul_list_content
      return request.get('/vulns', { params })
    }

    // 漏洞概要
    vulSummaryNum(data?: any): any {
      switch (data.type) {
        case 'sca':
          return request.post('/sca_vul_summary', data, {
            baseURL: process.env.VUE_APP_BASE_API_V2,
          })
        case 'vuln':
          return request.post('/app_vul_summary', data, {
            baseURL: process.env.VUE_APP_BASE_API_V2,
          })
        case 'scan':
          return request.post('/dastvul/summary', data, {
            baseURL: process.env.VUE_APP_BASE_API_V1,
          })
      }
    }

    // 漏洞列表 sca+app
    vulListContent(data: any): any {
      switch (data.type) {
        case 'sca':
          return request.post('/sca_vul_list_content', data, {
            baseURL: process.env.VUE_APP_BASE_API_V2,
          })
        case 'vuln':
          return request.post('/app_vul_list_content', data, {
            baseURL: process.env.VUE_APP_BASE_API_V2,
          })
        default:
          return request.post('/dastvul', data, {
            baseURL: process.env.VUE_APP_BASE_API_V1,
          })
      }
    }

    // 漏洞列表 sca+app
    recheck(data: any): Promise<iResponse> {
      return request.post('/vul/recheck', data, {
        baseURL: process.env.VUE_APP_BASE_API_V2,
      })
    }

    // 漏洞列表 sca+app
    vulListDelete(data: any): Promise<iResponse> {
      return request.post('/vul_list_delete', data)
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
    // 扫描漏洞详情
    getScanDetail(id: number): Promise<iResponse> {
      return request.get(`/dastvul/${id}`, {
        baseURL: process.env.VUE_APP_BASE_API_V1,
      })
    }

    // 获取关联数据
    getRelationList(params: any): Promise<iResponse>{
      return request.post(`/dastvul/relationlist`, params)
    }

    // 获取漏洞类型
    getVulType(params: any): Promise<iResponse>{
      return request.get(`/dastvul/vultype`,{
        params
      })
    }

    // 删除关联
    deleteRelation(params: any): Promise<iResponse> {
      return request.delete(`/dastvul/relation`, {
        data: params
      })
    }

    // 创建关联
    addRelation(params: any): Promise<iResponse>{
      return request.post(`/dastvul/relation`, params)
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

    // 配置hook
    inteConfig(data: any, type: any): Promise<iResponse> {
      return request.post(`/integration/config?integration_type=` + type, data)
    }

    // 配置hook
    deleteConfig(type: any): Promise<iResponse> {
      return request.delete(`/integration/config/` + type)
    }

    // gethook
    getConfig(type: any): Promise<iResponse> {
      return request.get(`/integration/config/` + type)
    }

    getHeaderVul(params: any): Promise<iResponse> {
      return request.get(`/header_vul`, { params })
    }

    deleteHeaderVul(id: any): Promise<iResponse> {
      return request.delete(`/header_vul/${id}`)
    }
  })()
