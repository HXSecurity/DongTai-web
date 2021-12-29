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
      return request
        .get(`/sca_export?project_id=` + project_id, {
          responseType: 'blob',
        })
        .then((res: any) => {
          if (Object.prototype.toString.call(res) !== '[object Blob]') {
            Message.error(i18n.t('base.downloadError') as string)
            return
          }
          const blob = new Blob([res], {
            type: 'application/octet-stream',
          })
          // const objectUrl = URL.createObjectURL(blob);
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'sca.csv'
          link.click()
        })
    }
  })()
