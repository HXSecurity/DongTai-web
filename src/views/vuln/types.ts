export interface VulnListObj {
  id: number
  project_name: string
  server_name: string
  server_type: string
  type: string
  level: string
  level_type: string
  url: string
  http_method: string
  top_stack: string
  bottom_stack: string
  taint_position: string
  latest_time: string
  first_time: string
  language: string
  checked: boolean
}

interface Graph {
  type: string
  file: string
  line_number: string
  class: string
  method: string
  source: string
  target: string
  node: string
}

export interface VulnObj {
  graphs: any
  vul: {
    url: string
    uri: string
    http_method: string
    type: string
    taint_position: string
    first_time: number
    latest_time: number
    project_name: string
    project_id: number
    language: string
    level: string
    counts: number
    req_header: string
    graph: Array<Graph>
    context_path: string
    taint_value: string
    param_name: {}
    method_pool_id?: any
  }
  server: {
    name: string
    hostname: string
    ip: string
    port: number
    container: string
    container_path: string
    runtime: string
    environment: string
    command: string
  }
  strategy: {
    desc: string
    sample_code: string
    repair_suggestion: string
  }
  headers: any
}
