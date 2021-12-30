import request from '@/utils/request'
import { iResponse } from '@/services/types'
import { Message } from 'element-ui'
import { i18n } from '@/config/lang'
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
    // scaList
    scaList(params: scaListParams): Promise<iResponse> {
      return request.get('/scas', { params })
    }

    // scaSummary
    scaSummary(params: scaListParams): Promise<iResponse> {
      return request.get('/sca/summary', { params })
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
