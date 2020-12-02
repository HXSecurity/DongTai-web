export default {
  menu: {
    home: '首页',
    login: '登录',
    vuln: '应用漏洞',
    vulnList: '应用漏洞列表',
    vulnDetail: '应用漏洞详情',
    sca: '组件管理',
    scaList: '组件管理列表',
    scaDetail: '组件管理详情',
    setting: '系统配置',
  },
  views: {
    login: {
      title: '登录',
      usernamePlaceholder: '请输入用户名，默认admin',
      passwordPlaceholder: '请输入密码，默认admin'
    },
    vulnList: {
      filter: '过滤器',
      language: '语言',
      level: '等级',
      type: '类型',
      project_name: '项目',
      orderOptions: {
        app_name: '项目名称',
        server_name: '服务器名称',
        type: '漏洞类型',
        level: '漏洞等级',
        url: 'url',
        latest_time: '最新上报时间',
        first_time: '首次上报时间',
      }
    },
    vulnDetail: {
      baseInfo: '基本信息',
      vulnDesc: '漏洞描述',
      httpRequest: 'HTTP请求',
      codeDemo: '漏洞代码示例',
      graphy: '污点流图',
      suggest: '修复建议',
      appInfo: '应用信息',
      devEnv: '运行时环境',
      path: '环境变量',
      url: 'url',
      first_time: '首次出现',
      serverIp: '服务器 IP',
      language: '语言',
      port: '端口',
      projectName: '项目',
      level: '等级',
      counts: '出现次数',
      type: '类型',
      fileAndNum: '文件及行号',
      wuDianZhi: '污点值',
      route: '路径',
      middleware: '中间件',
      command: '启动命令',
      other: '其他',
    },
    scaList: {
      filter: '过滤器',
      language: '语言',
      level: '等级',
      type: '类型',
      project_name: '项目',
      tableHeaders: {
        name: '组件名称',
        version: '组件版本',
        application: '所属应用',
        language: 'language',
        level: '安全等级',
        count: '漏洞数量',
        time: '发现时间',
      }
    }
  }
}
