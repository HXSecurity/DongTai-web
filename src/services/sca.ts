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

    assetVulProjects(aggr_id: any, params: any): Promise<iResponse> {
      return request.get('/asset_vul_projects/' + aggr_id, {
        params,
        baseURL: '/openapi/sca/v1',
      })
    }

    assetVuls(aggr_id: any): Promise<iResponse> {
      return request.get('/asset_vuls/' + aggr_id, {
        baseURL: '/openapi/sca/v1',
      })
    }

    assetProjects(aggr_id: any): Promise<iResponse> {
      return request.get('/asset_projects/' + aggr_id, {
        baseURL: '/openapi/sca/v1',
      })
    }
    // scaList
    scaList(data: any): Promise<iResponse> {
      return request.post('/scas', data)
    }

    // scaSummary
    scaSummary(data: any): Promise<iResponse> {
      return request.post('/sca/summary', data)
    }

    // getScaDetail
    getScaDetail(id: number): Promise<iResponse> {
      return request.get(`/sca/${id}`)
    }

    // scaExport
    scaExport(project_id: string) {
      window.open(
        `${process.env.VUE_APP_BASE_API}/sca_export?project_id=` + project_id
      )
    }
  })()
