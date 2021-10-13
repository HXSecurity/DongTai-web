import request from '@/utils/request'
import { iResponse } from '@/services/types'

interface AgentDeploySubmitParams {
  agent_value?: string
  java_version?: string
  middleware?: string
  system?: string
}

export default () =>
  new (class {
    list(params: any): Promise<iResponse> {
      return request.get('/message/list', { params })
    }

    unreadCount(): Promise<iResponse> {
      return request.get('/message/unread_count')
    }

    mDelete(data: any): Promise<iResponse> {
      return request.post('/message/delete', data)
    }
  })()
