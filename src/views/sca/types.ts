export interface ScaListObj {
  package_name: string
  version: string
  project_name: string
  language: string
  level: string
  vul_count: number
  dt: string
  id: string
}

export interface VulObj {
  safe_version: string
  vulcve: string
  vulcwe: string
  vulname: string
  overview: string
  teardown: string
  reference: string
  level: string
}

export interface ScaObj {
  package_name: string
  package_path: string
  signature_value: string
  dt: number
  vul_count: number
  level: string
  version: string
  project_name: string
  vuls: Array<VulObj>
}
