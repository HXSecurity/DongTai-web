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
  })()
