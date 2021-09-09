import request from '@/utils/request'
import { iResponse } from '@/services/types'
import { Message } from 'element-ui'
import { i18n } from '@/config/lang'

interface AgentDeploySubmitParams {
  agent_value?: string
  java_version?: string
  middleware?: string
  system?: string
}

export default () =>
  new (class {
    agentDeployInfo(): Promise<iResponse> {
      return request.get('/agent/deploy/info')
    }
    agentDownload(url: string, language: string) {
      request
        .get('agent/download?url=' + url + '&language=' + language, {
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
          if (language === 'java') {
            link.download = 'agent.jar'
          } else {
            link.download = 'dongtai-agent-python.tar.gz'
          }
          link.click()
        })
    }
    agentDeploySubmit(params: AgentDeploySubmitParams): Promise<iResponse> {
      return request.post('/agent/deploy/submit', params)
    }

    getDeplogInfo(): Promise<iResponse> {
      return request.get('/agent/deploy/submit')
    }

    getOpenApiUrl(): Promise<iResponse> {
      return request.get('/openapi')
    }
    getToken(): Promise<iResponse> {
      return request.get('/user/token')
    }
    getDocuments(params: any): Promise<iResponse> {
      return request.get('/documents', { params })
    }
    getMD(params: any): Promise<iResponse> {
      return request.get('/agent/deploy', { params })
    }
  })()
