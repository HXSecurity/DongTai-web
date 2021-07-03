import request from '@/utils/request'
import { iResponse } from '@/services/types'

interface ProjectListParams {
  page: number
  pageSize: number
  name: string
}

interface ProjectAddParams {
  pid?: number | string
  name: string
  mode: string
  agent_ids: string
  scan_id: number
}

export default () =>
  new (class {
    // 项目列表
    projectList(params: ProjectListParams): Promise<iResponse> {
      return request.get('/projects', { params })
    }

    versionList(id: any): Promise<iResponse> {
      return request.get(`/project/version/list/${id}`)
    }

    versionAdd(params: any): Promise<iResponse> {
      return request.post(`/project/version/add`, params)
    }

    versionEdit(params: any): Promise<iResponse> {
      return request.post(`/project/version/update`, params)
    }

    versionCurrent(params: any): Promise<iResponse> {
      return request.post(`/project/version/current`, params)
    }

    versionDelete(params: any): Promise<iResponse> {
      return request.post(`/project/version/delete`, params)
    }

    //新增项目 编辑
    projectAdd(params: ProjectAddParams): Promise<iResponse> {
      return request.post('/project/add', params)
    }

    getEngineList(id: string): Promise<iResponse> {
      return request.get(`/project/engines/${id}`)
    }

    // 项目详情
    projectDetail(id: string): Promise<iResponse> {
      return request.get(`/project/${id}`)
    }

    // 删除项目
    projectDelete(params: { id: number }): Promise<iResponse> {
      return request.post('/project/delete', params)
    }

    //项目详情 - 图标概括
    projectsSummary(id: string): Promise<iResponse> {
      return request.get(`/projects/summary/${id}`)
    }

    //项目详情 - 漏洞验证
    projectsRecheck(id: string): Promise<iResponse> {
      return request.get(`/vul/recheck?projectId=${id}`)
    }
  })()
