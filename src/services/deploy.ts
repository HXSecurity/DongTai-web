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
    // 系统部署条件获取
    agentDeployInfo(): Promise<iResponse> {
      return request.get('/agent/deploy/info')
    }

    // 下载引擎
    agentDownload(url: string, language: string) {
      request
        .get('agent/download?url=' + url + '&language=' + language, {
          responseType: 'blob', // 告诉服务器我们需要的响应格式
        })
        .then((res: any) => {
          const blob = new Blob([res], {
            type: 'application/octet-stream', // 将会被放入到blob中的数组内容的MIME类型
          })
          // const objectUrl = URL.createObjectURL(blob); // 生成一个url
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'agent.jar'
          link.click()
        })
    }
    //系统部署信息提交
    agentDeploySubmit(params: AgentDeploySubmitParams): Promise<iResponse> {
      return request.post('/agent/deploy/submit', params)
    }

    // 获取系统部署信息
    getDeplogInfo(): Promise<iResponse> {
      return request.get('/agent/deploy/submit')
    }

    // 获取OPENAPI的地址
    getOpenApiUrl(): Promise<iResponse> {
      return request.get('/openapi')
    }
    // 获取Token
    getToken(): Promise<iResponse> {
      return request.get('/user/token')
    }
    // 获取Documents
    getDocuments(params: any): Promise<iResponse> {
      return request.get('/documents', { params })
    }
    // 获取MD
    getMD(params: any): Promise<iResponse> {
      return request.get('/agent/deploy', { params })
    }
  })()
