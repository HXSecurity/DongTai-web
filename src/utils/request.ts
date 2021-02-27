import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/utils'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 20000,
})

const request = (config: AxiosRequestConfig) => {
  if (getToken()) {
    config.headers['csrf-token'] = getToken()
  }
  return config
}

const requestError = (error: any) => {
  console.error(error)
  return error
}

const response = (response: AxiosResponse) => {
  return response.data
}

const responseError = (error: any) => {
  if (error.message && error.message.indexOf('timeout') !== -1) {
    Message.error('请求超时')
    return
  }
  if (error.response.status === 403) {
    store.dispatch('user/logOut')
    store.dispatch('user/clearInfo')
    router.push('/login')
  }
  if (error.response.status === 500) {
    // 没有权限
    Message.error('接口异常')
    return error
  }
  return error
}

service.interceptors.request.use(request, requestError)
service.interceptors.response.use(response, responseError)

export default service
