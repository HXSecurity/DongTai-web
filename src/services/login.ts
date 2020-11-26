import request from '@/utils/request'

interface loginParams {
  username: string,
  password: string
}

// 修改密码
interface changePasswordParams {
  username: string,
  old_password: string,
  new_password: string
}

export default () => new class {
  // 登陆
  login(params: loginParams) {
    return request.post('/user/login', params)
  }

  // 退出登陆
  logout() {
    return request.get('/user/logout')
  }

  // 修改密码
  changePassword(params: changePasswordParams) {
    return request.post('/user/changePassword', params)
  }
}
