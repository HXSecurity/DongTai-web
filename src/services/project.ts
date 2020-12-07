import request from '@/utils/request'
import { iResponse } from '@/services/types'

interface ProjectListParams {
  page: number
  pageSize: number
  name: string
}

interface ProjectAddParams {
  name: string
  mode: string
  agent_ids: string
}

export default () =>
  new (class {
    // 项目列表
    projectList(params: ProjectListParams): Promise<iResponse> {
      return request.get('/projects', { params })
    }

    //新增项目
    projectAdd(params: ProjectAddParams): Promise<iResponse> {
      return request.post('/project/add', params)
    }

    // 项目详情
    projectDetail(id: number): Promise<iResponse> {
      return request.get(`/project/${id}`)
    }

    // 删除项目
    projectDelete(params: { id: number }): Promise<iResponse> {
      return request.post('/project/delete', params)
    }

    //项目详情 - 图标概括
    projectsSummary(id: number): Promise<iResponse> {
      return request.get(`/projects/summary/${id}`)
    }
  })()
