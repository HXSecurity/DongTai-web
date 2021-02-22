
export interface Params {
  key: string
  value: string
  operate: string
  criteria: string
}

export interface ParamsOption {
  label: string
  value: string
}

interface Dependency{
  package_name: string
  vul_count: number
}

export interface SearchParams {
  name: string
  msg: string
  level: string
  paramsList: Params[]
}

export interface methodPoolSearchParams {
  name: string
  msg: string
  level: string
  sinks?: string[]
  sources?: string[]
  propagators?: string[]
  filters?: string[]
  [key: string]: any
}

export interface DataObj{
  agent_name: string
  dependencies:dependency[]
  sink_rules: {value: string}[]
  language: string
  level: string | null
  req_params: string | null
  rule: string | null
  update_time: string
  url: string
}

export interface RuleObj{
  id: number
  rule_name: string
  rule_msg: string
}

export interface VulRuleObj{
  name: string
  msg: string
  level: string
  sinks?: string[]
  sources?: string[]
  propagators?: string[]
  filters?: string[]
}

export interface VulObj{
  language: string
  method_pool: string
  req_header: string
  res_body: string
  url: string
}

export interface GraphData{
  nodes: any[]
  edges: any[]
}

export interface TaintLinkObj{
  args: string
  callerClass: string
  callerLineNumber: number
  callerMethod: string
  className: string
  interfaces: string[]
  invokeId: number
  methodName: string
  retClassName: ""
  signature: string
  source: boolean
  sourceHash: string[]
  targetHash: number[]
}
