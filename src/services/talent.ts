import request from '@/utils/request'
import { iResponse } from '@/services/types'

export default () =>
  new (class {
    talentList(params: {
      page: number
      pageSize: number
      keywords?: string
    }): Promise<iResponse> {
      return request.get('/talents', { params })
    }

    talentAdd(params: any): Promise<iResponse> {
      return request.put('/talent/add', params)
    }

    talentEdit(params: any): Promise<iResponse> {
      return request.post('talent/' + params.id, params)
    }

    talentDelete(id: number): Promise<iResponse> {
      return request.delete('talent/' + id + '/delete')
    }
  })()
