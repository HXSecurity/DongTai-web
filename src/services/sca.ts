import request from '@/utils/request'
import { iResponse } from '@/services/types'
import { Message } from 'element-ui'
import { i18n } from '@/config/lang'
import { Params } from './../views/taint/types/search.d'
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
    vulProjectAssets(params: any): Promise<iResponse> {
      return request.get('/vul_project_assets', {
        params,
        baseURL: '/openapi/sca/v1',
      })
    }

    assetVulDetail(data: any): Promise<iResponse> {
      return request.get('/asset_vul_detail/' + data.aggr_id, {
        baseURL: '/openapi/sca/v1',
      })
    }

    assetVuls(row: any): Promise<iResponse> {
      return request.get(
        `/package_vuls/${row.language_id}/${row.package_name}/${row.package_version}?page=${row.page}&page_size=${row.page_size}`,
        {
          baseURL: '/api/sca/v2',
        }
      )
    }

    assetProjects(row: any): Promise<iResponse> {
      if (row.project_id) {
        return request.get(
          `/package/${row.language_id}/${row.package_name}/${row.package_version}/relation_projects?page=${row.page}&page_size=${row.page_size}&project_id=${row.project_id}`,
          {
            baseURL: '/api/sca/v2',
          }
        )
      }
      return request.get(
        `/package/${row.language_id}/${row.package_name}/${row.package_version}/relation_projects?page=${row.page}&page_size=${row.page_size}`,
        {
          baseURL: '/api/sca/v2',
        }
      )
    }
    assetProjectId(row: any): Promise<iResponse> {
      return request.get(
        `/package/${row.language_id}/${row.package_name}/${row.package_version}/relation_project/${row.project_id}`,
        {
          baseURL: '/api/sca/v2',
        }
      )
    }
    vulPackId(row: any): Promise<iResponse> {
      return request.get(`/package_vul/${row.vul_id}`, {
        baseURL: '/api/sca/v2',
      })
    }
    // scaList /api/sca/v2/package
    // scaList(data: any): Promise<iResponse> {
    //   return request.post('/scas', data)
    // }
    scaList(data: any): Promise<iResponse> {
      return request.post('/package/', data, {
        baseURL: '/api/sca/v2',
      })
    }

    // scaSummary
    // scaSummary(data: any): Promise<iResponse> {
    //   return request.post('/sca/summary', data)
    // }
    scaSummary(data: any): Promise<iResponse> {
      if (data.project_id) {
        return request.get(
          `/package_summary?project_id=${data.project_id}&project_version_id=${data.version_id}&keyword=${data.keyword}`,
          {
            baseURL: '/api/sca/v2',
            // baseURL: '/openapi/sca/v2',
          }
        )
      }
      return request.get(`/package_summary?keyword=${data.keyword}`, {
        baseURL: '/api/sca/v2',
        // baseURL: '/openapi/sca/v2',
      })
    }

    // getScaDetail
    getScaDetail(row: any): Promise<iResponse> {
      return request.get(
        `/package/${row.language_id}/${row.package_name}/${row.package_version}/detail`,
        {
          baseURL: '/api/sca/v2',
        }
      )
    }
  })()
