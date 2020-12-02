import request from '@/utils/request'

interface scaListParams {
    page?: number;
    pageSize?: number;
    language?: string;
    level?: string;
    type?: string;
    app?: string;
    url?: string;
    order?: string;
}

export default () => new class {
  // 组件列表
  scaList (params: scaListParams) {
    return request.get('/scas', { params })
  }

  // 组件概要
  scaSummary (params: scaListParams) {
    return request.get('/sca/summary', { params })
  }

  // 组件详情
  getScaDetail (id: number) {
    return request.get(`/sca/${id}`)
  }
}()
