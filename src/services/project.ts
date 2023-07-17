import request from '@/utils/request'
import { iResponse } from '@/services/types'

interface ProjectListParams {
  page: number
  pageSize: number
  name: string
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
    projectAdd(params: any): Promise<iResponse> {
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
    projectsSummary(id: string, version?: string): Promise<iResponse> {
      return request.get(`/projects/summary/${id}`, {
        params: {
          version_id: version,
        },
      })
    }

    //项目详情 - api列表
    searchApi(params: any): Promise<iResponse> {
      return request.post('/api_route/search', params)
    }

    //项目详情 - 覆盖率
    coverRate(params: any): Promise<iResponse> {
      return request.get('/api_route/cover_rate', { params })
    }

    //项目详情 - api 查看详情
    relationrequest(params: any): Promise<iResponse> {
      return request.get('/api_route/relationrequest', { params })
    }

    req_headers(params: any): Promise<iResponse> {
      return request.get(`/project/${params.id}/api_test/req_headers`)
    }
    getRecognizeRule(data: any): Promise<iResponse> {
      return request.get(
        `/project/recognize_rule?page=${data.page}&page_size=${data.pageSize}&project_id=${data.project_id}&rule_type=${data.rule_type}`
      )
    }
    postRecognizeRule(data: any): Promise<iResponse> {
      return request.post(`/project/recognize_rule`, data)
    }
    deleteRecognizeRule(params: any): Promise<iResponse> {
      return request.delete(`/project/recognize_rule`, { data: params })
    }
    getRecognizeRuleById(id: any): Promise<iResponse> {
      return request.get(`/project/recognize_rule/${id}`)
    }
    putRecognizeRuleById(data: any): Promise<iResponse> {
      return request.put(`/project/recognize_rule/${data.rule_id}`, {
        rule_detail: data.rule_detail,
        project_id: data.project_id,
        rule_type: data.rule_type,
      })
    }
  })()
