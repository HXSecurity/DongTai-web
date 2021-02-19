export interface policy {
  name: string
  info: string
}

export interface params {
  criteria: string
  nodeType: string
  select: string
  info: string
}

export interface criteriaOption {
  label: string
  value: string
}

export interface nodeTypeOption {
  label: string
  value: string
}

export interface selectOption {
  label: string
  value: string
}

interface dependency{
  package_name: string
  vul_count: number
}

export interface dataObj{
  agent_name: string
  dependencies:dependency[]
  language: string
  level: string | null
  req_params: string | null
  rule: string | null
  update_time: string
  url: string
}
