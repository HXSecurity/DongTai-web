export interface Department {
  id: number
  name: string
}

export interface UserListObj {
  username: string
  department: Department
  email: string
  id: number
  is_superuser: number
  phone: string
}

export interface UserAddParams {
  username: string
  password: string
  re_password: string
  email: string
  role: number
  department: Department
  phone: string
  uid?: number
}
