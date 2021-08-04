import request from '@/utils/request'
import { iResponse } from '@/services/types'

interface loginParams {
  username: string
  password: string
}

// Change Password
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
  department: object
  phone: string
  uid?: number
}

export default () =>
  new (class {
    // Get verification code
    initCaptcha(): Promise<iResponse> {
      return request.get('/captcha/refresh')
    }

    // Login
    login(params: loginParams): Promise<iResponse> {
      return request.post('/user/login', params)
    }

    // Get user information
    getUserInfo(): Promise<iResponse> {
      return request.get('/user/info')
    }

    // logout
    logout(): Promise<iResponse> {
      return request.get('/user/logout')
    }

    // changePassword
    changePassword(params: changePasswordParams): Promise<iResponse> {
      return request.post('/user/changePassword', params)
    }

    // userList
    userList(params: {
      page: number
      pageSize: number
      keywords?: string
    }): Promise<iResponse> {
      return request.get('/users', { params })
    }

    // userAdd
    userAdd(params: UserAddParams): Promise<iResponse> {
      return request.put('/user/add', params)
    }

    // userEdit
    userEdit(params: UserAddParams): Promise<iResponse> {
      return request.post('/user/' + params.uid, params)
    }

    userDelete(params: { uid: number }): Promise<iResponse> {
      return request.delete('/user/' + params.uid + '/delete')
    }

    // departmentList
    departmentList(): Promise<iResponse> {
      return request.get('/departments')
    }

    // Get user token and system update URL
    userToken(): Promise<iResponse> {
      return request.get('/user/token')
    }

    // User list
    reset(params: { userId: number }): Promise<iResponse> {
      return request.post('/user/password/reset', params)
    }
  })()
