export interface AgentListObj {
  token: string
  server: number
  version: string
  running_status: string
  system_load: string
  id: string
}

export interface StrategyListObj {
  id: string
  vul_type: string
  vul_level: string
  state: string
  vul_name: string
  vul_desc: string
}

export interface LogItem { 
  username: string
  action_time: string
  content_type: string
  object_id: string
  object_repr: string
  action_flag: number
  change_message: string
  log_id: number
  user_id: string
}