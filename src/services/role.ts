import request from '@/utils/request'
import qs from 'qs'
import { iResponse } from '@/services/types'

export default () =>
  new (class {
    getRoles(params: any): Promise<iResponse> {
      return request.get('/roles', { params })
    }

    addRoles(data: any): Promise<iResponse> {
      return request.put('/role/add', data)
    }

    deleteRoles(role_id: any): Promise<iResponse> {
      return request.delete(`/role/${role_id}/delete`)
    }

    editRole(data: any): Promise<iResponse> {
      return request.post(`/role/${data.id}`, data)
    }

    getRoute(): Promise<iResponse> {
      return request.get(`/route`)
    }
  })()
