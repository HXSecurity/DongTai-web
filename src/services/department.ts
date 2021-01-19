import request from '@/utils/request'
import { iResponse } from '@/services/types'

export default () =>
    new (class {
        departmentList(): Promise<iResponse> {
            return request.get('/departments')
        }

        departmentUpdate(id: number, params: { name: string }): Promise<iResponse> {
            return request.post('/department/' + id, params)
        }

        departmentAdd(params: { name: string }): Promise<iResponse> {
            return request.put('/department/add', params)
        }

        departmentDel(id: number): Promise<iResponse> {
            return request.delete('/department/' + id + '/delete')
        }
    })()