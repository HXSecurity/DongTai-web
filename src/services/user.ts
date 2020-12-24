import request from '@/utils/request'
import { iResponse } from '@/services/types'

interface loginParams {
  username: string
  password: string
}

// 修改密码
interface changePasswordParams {
  username: string
  old_password: string
  new_password: string
}

interface UserAddParams {
  username: string
  password: string
  re_password: string
  email: string
  role: number
  department: string
  phone: string
  uid?: number
}

export default () =>
  new (class {
    // 获取验证码
    initCaptcha(): Promise<iResponse> {
      return request.get('/captcha/refresh')
    }

    // 登陆
    login(params: loginParams): Promise<iResponse> {
      return request.post('/user/login', params)
    }

    // 获取用户信息
    getUserInfo(): Promise<iResponse> {
      return request.get('/user/info')
    }

    // 退出登陆
    logout(): Promise<iResponse> {
      return request.get('/user/logout')
    }

    // 修改密码
    changePassword(params: changePasswordParams): Promise<iResponse> {
      return request.post('/user/changePassword', params)
    }

    // 用户列表
    userList(params: {
      page: number
      pageSize: number
      keywords?: string
    }): Promise<iResponse> {
      return request.get('/users', { params })
    }

    // 新增用户
    userAdd(params: UserAddParams): Promise<iResponse> {
      return request.post('/user/add', params)
    }

    userDelete(params: { uid: number }): Promise<iResponse> {
      return request.post('/user/delete', params)
    }

    // 部门列表
    departmentList(): Promise<iResponse> {
      return request.get('/departments')
    }

    // 获取用户token、系统更新url
    userToken(): Promise<iResponse> {
      return request.get('/user/token')
    }
  })()
