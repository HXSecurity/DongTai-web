export interface TalentListObj {
  id: number
  talent_name: string
  is_active: boolean
  create_time: number
  update_time: number
  created: string
}

export interface TalentAddParams {
  talent_name: string
  is_active: boolean
  email?: string
  id?: number
}
