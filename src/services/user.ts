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
  csrfmiddlewaretoken: string
  username: string
  password: string
  email: string
  role: string
  department: string
  phone: string
}

export default () =>
  new (class {
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
    userList(): Promise<iResponse> {
      return request.get('/users')
    }

    // 新增用户
    userAdd(params: UserAddParams): Promise<iResponse> {
      return request.post('/user/add', params)
    }

    // 部门列表
    departmentList(): Promise<iResponse> {
      return request.get('/departments')
    }
  })()
