interface VulContObj {
  level: number
  name: string
  total: number
}

export interface ProjectListParams {
  id: number
  name: string
  mode: string
  agent_count: number
  latest_time: string
  vul_count: Array<VulContObj>
}

export interface ProjectObj {
  id: number
  mode: string
  name: string
  latest_time: string
}

export const enum SelectTabs {
  desc = 'desc',
  vul = 'vul',
}
