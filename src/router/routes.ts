import { RouteConfig } from 'vue-router'
import { i18n } from '@/config/lang'

const baseRoutes: Array<RouteConfig> = [
  {
    path: '/',
    name: '/',
    redirect: '/login',
    meta: {
      i18n: 'menu.home',
      name: i18n.t('menu.home'),
    },
    component: () => import('@/views/layout/Index.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        meta: {
          i18n: 'menu.login',
          name: i18n.t('menu.login'),
          disabled: true,
        },
        component: () => import('@/views/Login.vue'),
      },
      {
        path: '/taint',
        name: 'taint',
        redirect: '/taint/search',
        meta: {
          // isMenu: true,
          keepAlive: true,
          disabled: true,
          i18n: 'menu.taintPool',
          name: i18n.t('menu.taintPool'),
        },
        component: () => import('@/views/taint/Index.vue'),
        children: [
          // {
          //   path: 'Pool',
          //   meta: {
          //     name: i18n.t('menu.taintPool'),
          //   },
          //   component: () => import('@/views/taint/Pool.vue'),
          // },
          // {
          //   path: 'search',
          //   name: 'search',
          //   meta: {
          //     keepAlive: true,
          //     disabled: true,
          //     i18n: 'menu.taintPool',
          //     name: i18n.t('menu.taintPool'),
          //   },
          //   component: () => import('@/views/taint/Search.vue'),
          // },
          {
            path: 'poolDetail/:id',
            name: 'poolDetail',
            meta: {
              keepAlive: true,
              disabled: true,
              i18n: 'menu.poolDetail',
              name: i18n.t('menu.poolDetail'),
            },
            component: () => import('@/views/taint/PoolDetail.vue'),
          },
        ],
      },
    ],
  },
]

const routes: Array<RouteConfig> = [
  {
    path: '/project',
    name: 'project',
    redirect: '/project/projectManage',
    meta: {
      isMenu: true,
      i18n: 'menu.projectManage',
      name: i18n.t('menu.projectManage'),
      disabled: true,
    },
    component: () => import('@/views/project/Index.vue'),
    children: [
      {
        path: 'projectManage',
        name: 'projectManage',
        meta: {
          disabled: true,
          i18n: 'menu.projectManage',
          name: i18n.t('menu.projectManage'),
        },
        component: () => import('@/views/project/ProjectManage.vue'),
      },
      {
        path: 'projectEdit/:pid?',
        name: 'projectEdit/:pid?',
        meta: {
          disabled: true,
          i18n: 'menu.projectEdit',
          name: i18n.t('menu.projectEdit'),
        },
        component: () => import('@/views/project/ProjectEdit.vue'),
      },
      {
        path: 'projectDetail/:pid',
        name: 'projectDetail/:pid',
        meta: {
          disabled: true,
          keepAlive: true,
          i18n: 'menu.projectDetail',
          name: i18n.t('menu.projectDetail'),
        },
        component: () => import('@/views/project/ProjectDetail.vue'),
      },
    ],
  },
  {
    path: '/vuln',
    name: 'vuln',
    redirect: '/vuln/vulnList',
    meta: {
      isMenu: true,
      i18n: 'menu.vuln',
      name: i18n.t('menu.vuln'),
    },
    component: () => import('@/views/vuln/Index.vue'),
    children: [
      {
        path: 'vulnList',
        name: 'vulnList',
        meta: {
          i18n: 'menu.vulnList',
          keepAlive: true,
          name: i18n.t('menu.vulnList'),
        },
        component: () => import('@/views/vuln/VulnList.vue'),
      },
      {
        path: 'vulnDetail/:page/:id',
        name: 'vulnDetail/:page/:id',
        meta: {
          i18n: 'menu.vulnDetail',
          name: i18n.t('menu.vulnDetail'),
        },
        component: () => import('@/views/vuln/VulnDetail.vue'),
      },
      {
        path: 'scaDetail/:page/:id',
        name: 'scaDetail/:page/:id',
        meta: {
          disabled: true,
          i18n: 'menu.scaDetail',
          name: i18n.t('menu.scaDetail'),
        },
        component: () => import('@/views/sca/ScaDetail.vue'),
      },
      {
        path: 'scanDetail/:page/:id',
        name: 'scanDetail/:page/:id',
        meta: {
          disabled: true,
          i18n: 'menu.scanDetail',
          name: i18n.t('menu.scaDetail'),
        },
        component: () => import('@/views/sca/ScanDetail.vue'),
      },
    ],
  },
  {
    path: '/sca',
    name: 'sca',
    redirect: '/sca/scaList',
    meta: {
      disabled: true,
      isMenu: true,
      i18n: 'menu.sca',
      name: i18n.t('menu.sca'),
    },
    component: () => import('@/views/sca/Index.vue'),
    children: [
      {
        path: 'scaList',
        name: 'scaList',
        meta: {
          disabled: true,
          i18n: 'menu.scaList',
          name: i18n.t('menu.scaList'),
        },
        component: () => import('@/views/sca/ScaList.vue'),
      },
      {
        path: 'scalistDetail/:page/:id',
        name: 'scalistDetail/:page/:id',
        meta: {
          i18n: 'menu.scalistDetail',
          name: i18n.t('menu.vulnDetail'),
        },
        component: () => import('@/views/sca/ScaDialog.vue'),
      },
    ],
  },
  {
    path: '/taint',
    name: 'taint',
    redirect: '/taint/search',
    meta: {
      // isMenu: true,
      keepAlive: true,
      disabled: true,
      i18n: 'menu.taintPool',
      name: i18n.t('menu.taintPool'),
    },
    component: () => import('@/views/taint/Index.vue'),
    children: [
      // {
      //   path: 'Pool',
      //   meta: {
      //     name: i18n.t('menu.taintPool'),
      //   },
      //   component: () => import('@/views/taint/Pool.vue'),
      // },
      // {
      //   path: 'search',
      //   name: 'search',
      //   meta: {
      //     keepAlive: true,
      //     disabled: true,
      //     i18n: 'menu.taintPool',
      //     name: i18n.t('menu.taintPool'),
      //   },
      //   component: () => import('@/views/taint/Search.vue'),
      // },
      {
        path: 'poolDetail/:id',
        name: 'poolDetail',
        meta: {
          keepAlive: true,
          disabled: true,
          i18n: 'menu.poolDetail',
          name: i18n.t('menu.poolDetail'),
        },
        component: () => import('@/views/taint/PoolDetail.vue'),
      },
    ],
  },
  {
    path: 'agentManage',
    name: 'agentManage',
    meta: {
      isMenu: true,
      i18n: 'menu.agentManage',
      name: i18n.t('menu.agentManage'),
    },
    component: () => import('@/views/setting/AgentManage.vue'),
  },
  {
    path: 'sysInfo',
    name: 'sysInfo',
    meta: {
      keepAlive: true,
      i18n: 'menu.sysInfo',
      name: i18n.t('menu.sysInfo'),
    },
    component: () => import('@/views/setting/SysInfo.vue'),
  },
  {
    path: 'agentConfig',
    name: 'agentConfig',
    meta: {
      disabled: true,
      i18n: 'menu.agentConfig',
      name: i18n.t('menu.agentConfig'),
    },
    component: () => import('@/views/setting/agentConfig.vue'),
  },
  {
    path: '/setting',
    name: 'setting',
    redirect: '/setting/strategyManage',
    meta: {
      i18n: 'menu.setting',
      name: i18n.t('menu.setting'),
    },
    component: () => import('@/views/setting/Index.vue'),
    children: [
      {
        path: 'webhook',
        name: 'webhook',
        meta: {
          disabled: true,
          i18n: 'menu.webhook',
          name: i18n.t('menu.webhook'),
        },
        component: () => import('@/views/setting/webhook.vue'),
      },

      {
        path: 'strategyManage',
        name: 'strategyManage',
        meta: {
          i18n: 'menu.strategyManage',
          name: i18n.t('menu.strategyManage'),
        },
        component: () => import('@/views/setting/StrategyManage.vue'),
      },
      {
        path: 'strategy',
        name: 'strategy',
        meta: {
          i18n: 'menu.strategy',
          name: i18n.t('menu.strategy'),
        },
        component: () => import('@/views/setting/Strategy.vue'),
      },
      {
        path: 'templateManage',
        name: 'templateManage',
        meta: {
          disabled: true,
          i18n: 'menu.templateManage',
          name: i18n.t('menu.templateManage'),
        },
        component: () => import('@/views/setting/templateManage.vue'),
      },
      {
        path: 'sensitiveManage',
        name: 'sensitiveManage',
        meta: {
          disabled: true,
          i18n: 'menu.sensitiveManage',
          name: i18n.t('menu.sensitiveManage'),
        },
        component: () => import('@/views/setting/sensitiveManage.vue'),
      },
      {
        path: 'sensitive',
        name: 'sensitive',
        meta: {
          disabled: true,
          i18n: 'menu.sensitive',
          name: i18n.t('menu.sensitive'),
        },
        component: () => import('@/views/setting/sensitive.vue'),
      },
      {
        path: 'template',
        name: 'template',
        meta: {
          disabled: true,
          i18n: 'menu.template',
          name: i18n.t('menu.template'),
        },
        component: () => import('@/views/setting/template.vue'),
      },
      // {
      //   path: 'scaManage',
      //   name: 'scaManage',
      //   meta: {
      //     disabled: true,
      //     i18n: 'menu.scaManage',
      //     name: i18n.t('menu.scaManage'),
      //   },
      //   component: () => import('@/views/setting/scaManage.vue'),
      // },
      {
        path: 'hookRule',
        name: 'hookRule',
        meta: {
          disabled: true,
          i18n: 'menu.hookRule',
          name: i18n.t('menu.hookRule'),
        },
        component: () => import('@/views/setting/hookRule.vue'),
      },
      {
        path: 'StatusMonitoring',
        name: 'StatusMonitoring',
        meta: {
          disabled: true,
          i18n: 'menu.statusMonitoring',
          name: i18n.t('menu.statusMonitoring'),
        },
        component: () => import('@/views/setting/StatusMonitoring.vue'),
      },
      {
        path: 'changeLogo',
        name: 'changeLogo',
        meta: {
          disabled: true,
          i18n: 'menu.changeLogo',
          name: i18n.t('menu.changeLogo'),
        },
        component: () => import('@/views/setting/changeLogo.vue'),
      },
      // {
      //   path: 'upgradeOnline',
      //   name: 'upgradeOnline',
      //   meta: {
      //     name: i18n.t('menu.upgradeOnline'),
      //   },
      //   component: () => import('@/views/setting/UpgradeOnline.vue'),
      // },

      {
        path: 'changePassword',
        name: 'changePassword',
        meta: {
          disabled: true,
          i18n: 'menu.changePassword',
          name: i18n.t('menu.changePassword'),
        },
        component: () => import('@/views/setting/ChangePassword.vue'),
      },

      {
        path: 'logManage',
        name: 'logManage',
        meta: {
          disabled: true,
          i18n: 'menu.logManage',
          name: i18n.t('menu.logManage'),
        },
        component: () => import('@/views/setting/LogManage.vue'),
      },

      {
        path: 'about',
        name: 'about',
        meta: {
          disabled: true,
          i18n: 'menu.about',
          name: i18n.t('menu.about'),
        },
        component: () => import('@/views/setting/about.vue'),
      },
    ],
  },

  {
    path: '/deploy',
    name: '/deploy',
    meta: {
      i18n: 'deploy',
      name: '部署IAST',
      disabled: true,
    },
    component: () => import('@/views/deploy/Deploy.vue'),
  },
]

const adminRoutes: Array<RouteConfig> = [
  {
    path: '/project',
    name: 'project',
    redirect: '/project/projectManage',
    meta: {
      isMenu: true,
      i18n: 'menu.projectManage',
      name: i18n.t('menu.projectManage'),
      disabled: true,
    },
    component: () => import('@/views/project/Index.vue'),
    children: [
      {
        path: 'projectManage',
        name: 'projectManage',
        meta: {
          disabled: true,
          i18n: 'menu.projectManage',
          name: i18n.t('menu.projectManage'),
        },
        component: () => import('@/views/project/ProjectManage.vue'),
      },
      {
        path: 'projectEdit/:pid?',
        name: 'projectEdit/:pid?',
        meta: {
          disabled: true,
          i18n: 'menu.projectEdit',
          name: i18n.t('menu.projectEdit'),
        },
        component: () => import('@/views/project/ProjectEdit.vue'),
      },
      {
        path: 'projectDetail/:pid',
        name: 'projectDetail/:pid',
        meta: {
          disabled: true,
          keepAlive: true,
          i18n: 'menu.projectDetail',
          name: i18n.t('menu.projectDetail'),
        },
        component: () => import('@/views/project/ProjectDetail.vue'),
      },
    ],
  },
  {
    path: '/vuln',
    name: 'vuln',
    redirect: '/vuln/vulnList',
    meta: {
      isMenu: true,
      i18n: 'menu.vuln',
      name: i18n.t('menu.vuln'),
    },
    component: () => import('@/views/vuln/Index.vue'),
    children: [
      {
        path: 'vulnList',
        name: 'vulnList',
        meta: {
          i18n: 'menu.vulnList',
          keepAlive: true,
          name: i18n.t('menu.vulnList'),
        },
        component: () => import('@/views/vuln/VulnList.vue'),
      },
      {
        path: 'vulnDetail/:page/:id',
        name: 'vulnDetail/:page/:id',
        meta: {
          i18n: 'menu.vulnDetail',
          name: i18n.t('menu.vulnDetail'),
        },
        component: () => import('@/views/vuln/VulnDetail.vue'),
      },
      {
        path: 'scaDetail/:page/:id',
        name: 'scaDetail/:page/:id',
        meta: {
          disabled: true,
          i18n: 'menu.scaDetail',
          name: i18n.t('menu.scaDetail'),
        },
        component: () => import('@/views/sca/ScaDetail.vue'),
      },
      {
        path: 'scanDetail/:page/:id',
        name: 'scanDetail/:page/:id',
        meta: {
          disabled: true,
          i18n: 'menu.scanDetail',
          name: i18n.t('menu.scaDetail'),
        },
        component: () => import('@/views/sca/ScanDetail.vue'),
      },
    ],
  },
  {
    path: '/sca',
    name: 'sca',
    redirect: '/sca/scaList',
    meta: {
      disabled: true,
      isMenu: true,
      i18n: 'menu.sca',
      name: i18n.t('menu.sca'),
    },
    component: () => import('@/views/sca/Index.vue'),
    children: [
      {
        path: 'scaList',
        name: 'scaList',
        meta: {
          disabled: true,
          i18n: 'menu.scaList',
          name: i18n.t('menu.scaList'),
        },
        component: () => import('@/views/sca/ScaList.vue'),
      },
      {
        path: 'scalistDetail/:page/:id',
        name: 'scalistDetail/:page/:id',
        meta: {
          i18n: 'menu.scalistDetail',
          name: i18n.t('menu.vulnDetail'),
        },
        component: () => import('@/views/sca/ScaDialog.vue'),
      },
    ],
  },
  {
    path: '/taint',
    name: 'taint',
    redirect: '/taint/search',
    meta: {
      // isMenu: true,
      keepAlive: true,
      disabled: true,
      i18n: 'menu.taintPool',
      name: i18n.t('menu.taintPool'),
    },
    component: () => import('@/views/taint/Index.vue'),
    children: [
      // {
      //   path: 'Pool',
      //   meta: {
      //     name: i18n.t('menu.taintPool'),
      //   },
      //   component: () => import('@/views/taint/Pool.vue'),
      // },
      // {
      //   path: 'search',
      //   name: 'search',
      //   meta: {
      //     keepAlive: true,
      //     disabled: true,
      //     i18n: 'menu.taintPool',
      //     name: i18n.t('menu.taintPool'),
      //   },
      //   component: () => import('@/views/taint/Search.vue'),
      // },
      {
        path: 'poolDetail/:id',
        name: 'poolDetail',
        meta: {
          keepAlive: true,
          disabled: true,
          i18n: 'menu.poolDetail',
          name: i18n.t('menu.poolDetail'),
        },
        component: () => import('@/views/taint/PoolDetail.vue'),
      },
    ],
  },
  {
    path: 'agentManage',
    name: 'agentManage',
    meta: {
      isMenu: true,
      i18n: 'menu.agentManage',
      name: i18n.t('menu.agentManage'),
    },
    component: () => import('@/views/setting/AgentManage.vue'),
  },
  {
    path: 'sysInfo',
    name: 'sysInfo',
    meta: {
      keepAlive: true,
      i18n: 'menu.sysInfo',
      name: i18n.t('menu.sysInfo'),
    },
    component: () => import('@/views/setting/SysInfo.vue'),
  },
  {
    path: 'agentConfig',
    name: 'agentConfig',
    meta: {
      disabled: true,
      i18n: 'menu.agentConfig',
      name: i18n.t('menu.agentConfig'),
    },
    component: () => import('@/views/setting/agentConfig.vue'),
  },
  {
    path: '/setting',
    name: 'setting',
    redirect: '/setting/strategyManage',
    meta: {
      i18n: 'menu.setting',
      name: i18n.t('menu.setting'),
    },
    component: () => import('@/views/setting/Index.vue'),
    children: [
      // {
      //   path: 'agentRank',
      //   name: 'agentRank',
      //   meta: {
      //     disabled: true,
      //     i18n: 'menu.agentRank',
      //     name: i18n.t('menu.agentRank'),
      //   },
      //   component: () => import('@/views/setting/agentRank.vue'),
      // },
      {
        path: 'webhook',
        name: 'webhook',
        meta: {
          disabled: true,
          i18n: 'menu.webhook',
          name: i18n.t('menu.webhook'),
        },
        component: () => import('@/views/setting/webhook.vue'),
      },
      {
        path: 'projectTemplate',
        name: 'projectTemplate',
        component: () => import('@/views/setting/projectTemplate.vue'),
        meta: {
          disabled: true,
          i18n: 'menu.projectTemplate',
          isMenu: false,
          keepAlive: false,
          name: 'menu.projectTemplate',
        },
        redirect: '',
      },

      {
        path: 'strategyManage',
        name: 'strategyManage',
        meta: {
          i18n: 'menu.strategyManage',
          name: i18n.t('menu.strategyManage'),
        },
        component: () => import('@/views/setting/StrategyManage.vue'),
      },
      {
        path: 'strategy',
        name: 'strategy',
        meta: {
          i18n: 'menu.strategy',
          name: i18n.t('menu.strategy'),
        },
        component: () => import('@/views/setting/Strategy.vue'),
      },
      {
        path: 'templateManage',
        name: 'templateManage',
        meta: {
          disabled: true,
          i18n: 'menu.templateManage',
          name: i18n.t('menu.templateManage'),
        },
        component: () => import('@/views/setting/templateManage.vue'),
      },
      {
        path: 'sensitiveManage',
        name: 'sensitiveManage',
        meta: {
          disabled: true,
          i18n: 'menu.sensitiveManage',
          name: i18n.t('menu.sensitiveManage'),
        },
        component: () => import('@/views/setting/sensitiveManage.vue'),
      },
      {
        path: 'sensitive',
        name: 'sensitive',
        meta: {
          disabled: true,
          i18n: 'menu.sensitive',
          name: i18n.t('menu.sensitive'),
        },
        component: () => import('@/views/setting/sensitive.vue'),
      },

      {
        path: 'template',
        name: 'template',
        meta: {
          disabled: true,
          i18n: 'menu.template',
          name: i18n.t('menu.template'),
        },
        component: () => import('@/views/setting/template.vue'),
      },
      // {
      //   path: 'scaManage',
      //   name: 'scaManage',
      //   meta: {
      //     disabled: true,
      //     i18n: 'menu.scaManage',
      //     name: i18n.t('menu.scaManage'),
      //   },
      //   component: () => import('@/views/setting/scaManage.vue'),
      // },
      {
        path: 'hookRule',
        name: 'hookRule',
        meta: {
          disabled: true,
          i18n: 'menu.hookRule',
          name: i18n.t('menu.hookRule'),
        },
        component: () => import('@/views/setting/hookRule.vue'),
      },
      {
        path: 'StatusMonitoring',
        name: 'StatusMonitoring',
        meta: {
          disabled: true,
          i18n: 'menu.statusMonitoring',
          name: i18n.t('menu.statusMonitoring'),
        },
        component: () => import('@/views/setting/StatusMonitoring.vue'),
      },
      {
        path: 'SystemSettings',
        name: 'SystemSettings',
        meta: {
          disabled: true,
          i18n: 'menu.systemSettings',
          name: i18n.t('menu.systemSettings'),
        },
        component: () => import('@/views/setting/SystemSettings.vue'),
      },
      {
        path: 'changeLogo',
        name: 'changeLogo',
        meta: {
          disabled: true,
          i18n: 'menu.changeLogo',
          name: i18n.t('menu.changeLogo'),
        },
        component: () => import('@/views/setting/changeLogo.vue'),
      },
      // {
      //   path: 'upgradeOnline',
      //   name: 'upgradeOnline',
      //   meta: {
      //     name: i18n.t('menu.upgradeOnline'),
      //   },
      //   component: () => import('@/views/setting/UpgradeOnline.vue'),
      // },

      {
        path: 'changePassword',
        name: 'changePassword',
        meta: {
          disabled: true,
          i18n: 'menu.changePassword',
          name: i18n.t('menu.changePassword'),
        },
        component: () => import('@/views/setting/ChangePassword.vue'),
      },

      {
        path: 'logManage',
        name: 'logManage',
        meta: {
          disabled: true,
          i18n: 'menu.logManage',
          name: i18n.t('menu.logManage'),
        },
        component: () => import('@/views/setting/LogManage.vue'),
      },

      {
        path: 'about',
        name: 'about',
        meta: {
          disabled: true,
          i18n: 'menu.about',
          name: i18n.t('menu.about'),
        },
        component: () => import('@/views/setting/about.vue'),
      },
    ],
  },
  {
    path: '/deploy',
    name: '/deploy',
    meta: {
      i18n: 'deploy',
      name: '部署IAST',
      disabled: true,
    },
    component: () => import('@/views/deploy/Deploy.vue'),
  },
]

const userRoutes: Array<RouteConfig> = [
  {
    path: '/project',
    name: 'project',
    redirect: '/project/projectManage',
    meta: {
      isMenu: true,
      i18n: 'menu.projectManage',
      name: i18n.t('menu.projectManage'),
      disabled: true,
    },
    component: () => import('@/views/project/Index.vue'),
    children: [
      {
        path: 'projectManage',
        name: 'projectManage',
        meta: {
          disabled: true,
          i18n: 'menu.projectManage',
          name: i18n.t('menu.projectManage'),
        },
        component: () => import('@/views/project/ProjectManage.vue'),
      },
      {
        path: 'projectEdit/:pid?',
        name: 'projectEdit/:pid?',
        meta: {
          disabled: true,
          i18n: 'menu.projectEdit',
          name: i18n.t('menu.projectEdit'),
        },
        component: () => import('@/views/project/ProjectEdit.vue'),
      },
      {
        path: 'projectDetail/:pid',
        name: 'projectDetail/:pid',
        meta: {
          disabled: true,
          keepAlive: true,
          i18n: 'menu.projectDetail',
          name: i18n.t('menu.projectDetail'),
        },
        component: () => import('@/views/project/ProjectDetail.vue'),
      },
    ],
  },
  {
    path: '/vuln',
    name: 'vuln',
    redirect: '/vuln/vulnList',
    meta: {
      isMenu: true,
      i18n: 'menu.vuln',
      name: i18n.t('menu.vuln'),
    },
    component: () => import('@/views/vuln/Index.vue'),
    children: [
      {
        path: 'vulnList',
        name: 'vulnList',
        meta: {
          i18n: 'menu.vulnList',
          keepAlive: true,
          name: i18n.t('menu.vulnList'),
        },
        component: () => import('@/views/vuln/VulnList.vue'),
      },
      {
        path: 'vulnDetail/:page/:id',
        name: 'vulnDetail/:page/:id',
        meta: {
          i18n: 'menu.vulnDetail',
          name: i18n.t('menu.vulnDetail'),
        },
        component: () => import('@/views/vuln/VulnDetail.vue'),
      },
      {
        path: 'scaDetail/:page/:id',
        name: 'scaDetail/:page/:id',
        meta: {
          disabled: true,
          i18n: 'menu.scaDetail',
          name: i18n.t('menu.scaDetail'),
        },
        component: () => import('@/views/sca/ScaDetail.vue'),
      },
      {
        path: 'scanDetail/:page/:id',
        name: 'scanDetail/:page/:id',
        meta: {
          disabled: true,
          i18n: 'menu.scanDetail',
          name: i18n.t('menu.scaDetail'),
        },
        component: () => import('@/views/sca/ScanDetail.vue'),
      },
    ],
  },
  {
    path: '/sca',
    name: 'sca',
    redirect: '/sca/scaList',
    meta: {
      disabled: true,
      isMenu: true,
      i18n: 'menu.sca',
      name: i18n.t('menu.sca'),
    },
    component: () => import('@/views/sca/Index.vue'),
    children: [
      {
        path: 'scaList',
        name: 'scaList',
        meta: {
          disabled: true,
          i18n: 'menu.scaList',
          name: i18n.t('menu.scaList'),
        },
        component: () => import('@/views/sca/ScaList.vue'),
      },
      {
        path: 'scalistDetail/:page/:id',
        name: 'scalistDetail/:page/:id',
        meta: {
          i18n: 'menu.scalistDetail',
          name: i18n.t('menu.scalistDetail'),
        },
        component: () => import('@/views/sca/ScaDialog.vue'),
      },
    ],
  },
  {
    path: '/taint',
    name: 'taint',
    redirect: '/taint/search',
    meta: {
      // isMenu: true,
      keepAlive: true,
      disabled: true,
      i18n: 'menu.taintPool',
      name: i18n.t('menu.taintPool'),
    },
    component: () => import('@/views/taint/Index.vue'),
    children: [
      // {
      //   path: 'search',
      //   name: 'search',
      //   meta: {
      //     keepAlive: true,
      //     disabled: true,
      //     i18n: 'menu.taintPool',
      //     name: i18n.t('menu.taintPool'),
      //   },
      //   component: () => import('@/views/taint/Search.vue'),
      // },
      {
        path: 'poolDetail/:id',
        name: 'poolDetail',
        meta: {
          keepAlive: true,
          disabled: true,
          i18n: 'menu.poolDetail',
          name: i18n.t('menu.poolDetail'),
        },
        component: () => import('@/views/taint/PoolDetail.vue'),
      },
    ],
  },
  {
    path: 'agentManage',
    name: 'agentManage',
    meta: {
      isMenu: true,
      i18n: 'menu.agentManage',
      name: i18n.t('menu.agentManage'),
    },
    component: () => import('@/views/setting/AgentManage.vue'),
  },
  {
    path: 'sysInfo',
    name: 'sysInfo',
    meta: {
      keepAlive: true,
      i18n: 'menu.sysInfo',
      name: i18n.t('menu.sysInfo'),
    },
    component: () => import('@/views/setting/SysInfo.vue'),
  },
  {
    path: '/setting',
    name: 'setting',
    redirect: '/setting/strategyManage',
    meta: {
      i18n: 'menu.setting',
      name: i18n.t('menu.setting'),
    },
    component: () => import('@/views/setting/Index.vue'),
    children: [
      {
        path: 'strategyManage',
        name: 'strategyManage',
        meta: {
          i18n: 'menu.strategyManage',
          name: i18n.t('menu.strategyManage'),
        },
        component: () => import('@/views/setting/StrategyManage.vue'),
      },
      {
        path: 'strategy',
        name: 'strategy',
        meta: {
          i18n: 'menu.strategy',
          name: i18n.t('menu.strategy'),
        },
        component: () => import('@/views/setting/Strategy.vue'),
      },
      {
        path: 'templateManage',
        name: 'templateManage',
        meta: {
          disabled: true,
          i18n: 'menu.templateManage',
          name: i18n.t('menu.templateManage'),
        },
        component: () => import('@/views/setting/templateManage.vue'),
      },
      {
        path: 'sensitiveManage',
        name: 'sensitiveManage',
        meta: {
          disabled: true,
          i18n: 'menu.sensitiveManage',
          name: i18n.t('menu.sensitiveManage'),
        },
        component: () => import('@/views/setting/sensitiveManage.vue'),
      },
      {
        path: 'sensitive',
        name: 'sensitive',
        meta: {
          disabled: true,
          i18n: 'menu.sensitive',
          name: i18n.t('menu.sensitive'),
        },
        component: () => import('@/views/setting/sensitive.vue'),
      },

      {
        path: 'template',
        name: 'template',
        meta: {
          disabled: true,
          i18n: 'menu.template',
          name: i18n.t('menu.template'),
        },
        component: () => import('@/views/setting/template.vue'),
      },
      // {
      //   path: 'scaManage',
      //   name: 'scaManage',
      //   meta: {
      //     disabled: true,
      //     i18n: 'menu.scaManage',
      //     name: i18n.t('menu.scaManage'),
      //   },
      //   component: () => import('@/views/setting/scaManage.vue'),
      // },
      {
        path: 'hookRule',
        name: 'hookRule',
        meta: {
          disabled: true,
          i18n: 'menu.hookRule',
          name: i18n.t('menu.hookRule'),
        },
        component: () => import('@/views/setting/hookRule.vue'),
      },
      {
        path: 'StatusMonitoring',
        name: 'StatusMonitoring',
        meta: {
          disabled: true,
          i18n: 'menu.statusMonitoring',
          name: i18n.t('menu.statusMonitoring'),
        },
        component: () => import('@/views/setting/StatusMonitoring.vue'),
      },
      // {
      //   path: 'changeLogo',
      //   name: 'changeLogo',
      //   meta: {
      //     disabled: true,
      //     i18n: 'menu.changeLogo',
      //     name: i18n.t('menu.changeLogo'),
      //   },
      //   component: () => import('@/views/setting/changeLogo.vue'),
      // },
      // {
      //   path: 'upgradeOnline',
      //   name: 'upgradeOnline',
      //   meta: {
      //     name: i18n.t('menu.upgradeOnline'),
      //   },
      //   component: () => import('@/views/setting/UpgradeOnline.vue'),
      // },

      {
        path: 'changePassword',
        name: 'changePassword',
        meta: {
          disabled: true,
          i18n: 'menu.changePassword',
          name: i18n.t('menu.changePassword'),
        },
        component: () => import('@/views/setting/ChangePassword.vue'),
      },

      {
        path: 'logManage',
        name: 'logManage',
        meta: {
          disabled: true,
          i18n: 'menu.logManage',
          name: i18n.t('menu.logManage'),
        },
        component: () => import('@/views/setting/LogManage.vue'),
      },
      {
        path: 'about',
        name: 'about',
        meta: {
          disabled: true,
          i18n: 'menu.about',
          name: i18n.t('menu.about'),
        },
        component: () => import('@/views/setting/about.vue'),
      },
    ],
  },
  {
    path: '/deploy',
    name: '/deploy',
    meta: {
      i18n: 'deploy',
      name: '部署IAST',
      disabled: true,
    },
    component: () => import('@/views/deploy/Deploy.vue'),
  },
]

export default {
  baseRoutes,
  routes,
  userRoutes,
  adminRoutes,
}
