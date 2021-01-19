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

        talentAdd(params: {
            talent_name: string
            email: string
            is_active?: boolean
        }): Promise<iResponse> {
            return request.put('/talent/add', params)
        }

        talentEdit(params: {
            id: number
            talent_name: string
            is_active?: boolean
        }): Promise<iResponse> {
            return request.post('talent/' + params.id, params)
        }

        talentDelete(id: number): Promise<iResponse> {
            return request.delete('talent/' + id + '/delete')
        }
    })()