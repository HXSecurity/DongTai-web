export interface iResponse<T = any> {
  status: number
  msg: string
  data?: T
  [key: string]: any
}
