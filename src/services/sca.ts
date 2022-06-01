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
  })()
