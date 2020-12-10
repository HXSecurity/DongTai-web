export interface UserListObj {
  username: string
  department: string
  email: string
  id: number
  is_superuser: boolean
  phone: string
}

export interface UserAddParams {
  csrfmiddlewaretoken: string
  username: string
  password: string
  re_password: string
  email: string
  role: string
  department: string
  phone: string
  uid?: number
}
