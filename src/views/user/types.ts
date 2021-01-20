export interface UserListObj {
  username: string
  department: object
  email: string
  id: number
  is_superuser: boolean
  phone: string
}

export interface UserAddParams {
  username: string
  password: string
  re_password: string
  email: string
  role: number
  department: object
  phone: string
  uid?: number
}
