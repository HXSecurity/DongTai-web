///api/v1/method_pools

import request from '@/utils/request'
import { iResponse } from '@/services/types'

export default () =>
    new (class {
        methodList(params: {
            page: number
            pageSize: number
        }): Promise<iResponse> {
            return request.get('/method_pools', { params })
        }
    })()