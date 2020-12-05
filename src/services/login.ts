import request from '@/utils/request'

interface loginParams {
  username: string;
  password: string;
}

// 修改密码
interface changePasswordParams {
  username: string;
  old_password: string;
  new_password: string;
}

export default () => new class {
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
}()
