export default {
  menu: {
    home: '首页',
    login: '登录',
    vuln: '应用漏洞',
    vulnList: '应用漏洞列表',
    vulnDetail: '应用漏洞详情',
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
      orderOptions:{
        app_name: '项目名称',
        server_name: '服务器名称',
        type: '漏洞类型',
        level: '漏洞等级',
        url: 'url',
        latest_time: '最新上报时间',
        first_time: '首次上报时间',
      }
    }
  }
}
