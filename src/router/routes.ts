import { RouteConfig } from 'vue-router'
import { i18n } from '@/config/lang'

const baseRoutes: Array<RouteConfig> = [
  {
    path: '/',
    name: '/',
    redirect: '/login',
    meta: {
      name: i18n.t('menu.home'),
    },
    component: () => import('@/views/layout/Index.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        meta: {
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
          isMenu: true,
          keepAlive: true,
          disabled: true,
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
          {
            path: 'search',
            name: 'search',
            meta: {
              keepAlive: true,
              disabled: true,
              name: i18n.t('menu.taintPool'),
            },
            component: () => import('@/views/taint/Search.vue'),
          },
          {
            path: 'poolDetail/:id',
            name: 'poolDetail',
            meta: {
              keepAlive: true,
              disabled: true,
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
          name: i18n.t('menu.projectManage'),
        },
        component: () => import('@/views/project/ProjectManage.vue'),
      },
      {
        path: 'projectEdit/:pid?',
        name: 'projectEdit/:pid?',
        meta: {
          disabled: true,
          name: i18n.t('menu.projectEdit'),
        },
        component: () => import('@/views/project/ProjectEdit.vue'),
      },
      {
        path: 'projectDetail/:pid',
        name: 'projectDetail/:pid',
        meta: {
          disabled: true,
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
      name: i18n.t('menu.vuln'),
    },
    component: () => import('@/views/vuln/Index.vue'),
    children: [
      {
        path: 'vulnList',
        name: 'vulnList',
        meta: {
          name: i18n.t('menu.vulnList'),
        },
        component: () => import('@/views/vuln/VulnList.vue'),
      },
      {
        path: 'vulnDetail/:page/:id',
        name: 'vulnDetail/:page/:id',
        meta: {
          name: i18n.t('menu.vulnDetail'),
        },
        component: () => import('@/views/vuln/VulnDetail.vue'),
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
      name: i18n.t('menu.sca'),
    },
    component: () => import('@/views/sca/Index.vue'),
    children: [
      {
        path: 'scaList',
        name: 'scaList',
        meta: {
          disabled: true,
          name: i18n.t('menu.scaList'),
        },
        component: () => import('@/views/sca/ScaList.vue'),
      },
      {
        path: 'scaDetail/:page/:id',
        name: 'scaDetail/:page/:id',
        meta: {
          disabled: true,
          name: i18n.t('menu.scaDetail'),
        },
        component: () => import('@/views/sca/ScaDetail.vue'),
      },
    ],
  },
  {
    path: '/taint',
    name: 'taint',
    redirect: '/taint/search',
    meta: {
      isMenu: true,
      keepAlive: true,
      disabled: true,
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
      {
        path: 'search',
        name: 'search',
        meta: {
          keepAlive: true,
          disabled: true,
          name: i18n.t('menu.taintPool'),
        },
        component: () => import('@/views/taint/Search.vue'),
      },
      {
        path: 'poolDetail/:id',
        name: 'poolDetail',
        meta: {
          keepAlive: true,
          disabled: true,
          name: i18n.t('menu.poolDetail'),
        },
        component: () => import('@/views/taint/PoolDetail.vue'),
      },
    ],
  },
  {
    path: '/setting',
    name: 'setting',
    redirect: '/setting/agentManage',
    meta: {
      isMenu: true,
      name: i18n.t('menu.setting'),
    },
    component: () => import('@/views/setting/Index.vue'),
    children: [
      {
        path: 'agentManage',
        name: 'agentManage',
        meta: {
          disabled: true,
          name: i18n.t('menu.agentManage'),
        },
        component: () => import('@/views/setting/AgentManage.vue'),
      },
      {
        path: 'strategyManage',
        name: 'strategyManage',
        meta: {
          name: i18n.t('menu.strategyManage'),
        },
        component: () => import('@/views/setting/StrategyManage.vue'),
      },
      {
        path: 'hookRule',
        name: 'hookRule',
        meta: {
          disabled: true,
          name: i18n.t('menu.hookRule'),
        },
        component: () => import('@/views/setting/hookRule.vue'),
      },
      // {
      //   path: 'upgradeOnline',
      //   name: 'upgradeOnline',
      //   meta: {
      //     name: i18n.t('menu.upgradeOnline'),
      //   },
      //   component: () => import('@/views/setting/UpgradeOnline.vue'),
      // },
      // {
      //   path: 'sysInfo',
      //   name: 'sysInfo',
      //   meta: {
      //     name: i18n.t('menu.sysInfo'),
      //   },
      //   component: () => import('@/views/setting/SysInfo.vue'),
      // },
      {
        path: 'changePassword',
        name: 'changePassword',
        meta: {
          disabled: true,
          name: i18n.t('menu.changePassword'),
        },
        component: () => import('@/views/setting/ChangePassword.vue'),
      },
      {
        path: 'logManage',
        name: 'logManage',
        meta: {
          disabled: true,
          name: i18n.t('menu.logManage'),
        },
        component: () => import('@/views/setting/LogManage.vue'),
      },
      {
        path: 'serverRegister',
        name: 'serverRegister',
        meta: {
          disabled: true,
          name: i18n.t('menu.serverRegister'),
        },
        component: () => import('@/views/setting/serverRegister.vue'),
      },
    ],
  },
  {
    path: '/department',
    name: 'department',
    redirect: '/department/departmentList',
    meta: {
      isMenu: true,
      name: i18n.t('menu.department'),
    },
    component: () => import('@/views/department/Index.vue'),
    children: [
      {
        path: 'departmentList',
        name: 'departmentList',
        meta: {
          name: i18n.t('menu.department'),
        },
        component: () => import('@/views/department/DepartmentList.vue'),
      },
    ],
  },
  {
    path: '/talent',
    name: 'talent',
    redirect: '/talent/talentList',
    meta: {
      isMenu: true,
      name: i18n.t('menu.talent'),
    },
    component: () => import('@/views/talent/Index.vue'),
    children: [
      {
        path: 'talentList',
        name: 'talentList',
        meta: {
          name: i18n.t('menu.talent'),
        },
        component: () => import('@/views/talent/TalentList.vue'),
      },
    ],
  },
  {
    path: '/deploy',
    name: '/deploy',
    meta: {
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
          name: i18n.t('menu.projectManage'),
        },
        component: () => import('@/views/project/ProjectManage.vue'),
      },
      {
        path: 'projectEdit/:pid?',
        name: 'projectEdit/:pid?',
        meta: {
          disabled: true,
          name: i18n.t('menu.projectEdit'),
        },
        component: () => import('@/views/project/ProjectEdit.vue'),
      },
      {
        path: 'projectDetail/:pid',
        name: 'projectDetail/:pid',
        meta: {
          disabled: true,
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
      name: i18n.t('menu.vuln'),
    },
    component: () => import('@/views/vuln/Index.vue'),
    children: [
      {
        path: 'vulnList',
        name: 'vulnList',
        meta: {
          name: i18n.t('menu.vulnList'),
        },
        component: () => import('@/views/vuln/VulnList.vue'),
      },
      {
        path: 'vulnDetail/:page/:id',
        name: 'vulnDetail/:page/:id',
        meta: {
          name: i18n.t('menu.vulnDetail'),
        },
        component: () => import('@/views/vuln/VulnDetail.vue'),
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
      name: i18n.t('menu.sca'),
    },
    component: () => import('@/views/sca/Index.vue'),
    children: [
      {
        path: 'scaList',
        name: 'scaList',
        meta: {
          disabled: true,
          name: i18n.t('menu.scaList'),
        },
        component: () => import('@/views/sca/ScaList.vue'),
      },
      {
        path: 'scaDetail/:page/:id',
        name: 'scaDetail/:page/:id',
        meta: {
          disabled: true,
          name: i18n.t('menu.scaDetail'),
        },
        component: () => import('@/views/sca/ScaDetail.vue'),
      },
    ],
  },
  {
    path: '/taint',
    name: 'taint',
    redirect: '/taint/search',
    meta: {
      isMenu: true,
      keepAlive: true,
      disabled: true,
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
      {
        path: 'search',
        name: 'search',
        meta: {
          keepAlive: true,
          disabled: true,
          name: i18n.t('menu.taintPool'),
        },
        component: () => import('@/views/taint/Search.vue'),
      },
      {
        path: 'poolDetail/:id',
        name: 'poolDetail',
        meta: {
          keepAlive: true,
          disabled: true,
          name: i18n.t('menu.poolDetail'),
        },
        component: () => import('@/views/taint/PoolDetail.vue'),
      },
    ],
  },
  {
    path: '/setting',
    name: 'setting',
    redirect: '/setting/agentManage',
    meta: {
      isMenu: true,
      name: i18n.t('menu.setting'),
    },
    component: () => import('@/views/setting/Index.vue'),
    children: [
      {
        path: 'agentManage',
        name: 'agentManage',
        meta: {
          disabled: true,
          name: i18n.t('menu.agentManage'),
        },
        component: () => import('@/views/setting/AgentManage.vue'),
      },
      {
        path: 'strategyManage',
        name: 'strategyManage',
        meta: {
          name: i18n.t('menu.strategyManage'),
        },
        component: () => import('@/views/setting/StrategyManage.vue'),
      },
      {
        path: 'hookRule',
        name: 'hookRule',
        meta: {
          disabled: true,
          name: i18n.t('menu.hookRule'),
        },
        component: () => import('@/views/setting/hookRule.vue'),
      },
      // {
      //   path: 'upgradeOnline',
      //   name: 'upgradeOnline',
      //   meta: {
      //     name: i18n.t('menu.upgradeOnline'),
      //   },
      //   component: () => import('@/views/setting/UpgradeOnline.vue'),
      // },
      // {
      //   path: 'sysInfo',
      //   name: 'sysInfo',
      //   meta: {
      //     name: i18n.t('menu.sysInfo'),
      //   },
      //   component: () => import('@/views/setting/SysInfo.vue'),
      // },
      {
        path: 'changePassword',
        name: 'changePassword',
        meta: {
          disabled: true,
          name: i18n.t('menu.changePassword'),
        },
        component: () => import('@/views/setting/ChangePassword.vue'),
      },
      {
        path: 'logManage',
        name: 'logManage',
        meta: {
          disabled: true,
          name: i18n.t('menu.logManage'),
        },
        component: () => import('@/views/setting/LogManage.vue'),
      },
      {
        path: 'serverRegister',
        name: 'serverRegister',
        meta: {
          disabled: true,
          name: i18n.t('menu.serverRegister'),
        },
        component: () => import('@/views/setting/serverRegister.vue'),
      },
    ],
  },
  {
    path: '/department',
    name: 'department',
    redirect: '/department/departmentList',
    meta: {
      isMenu: true,
      name: i18n.t('menu.department'),
    },
    component: () => import('@/views/department/Index.vue'),
    children: [
      {
        path: 'departmentList',
        name: 'departmentList',
        meta: {
          name: i18n.t('menu.department'),
        },
        component: () => import('@/views/department/DepartmentList.vue'),
      },
    ],
  },
  {
    path: '/deploy',
    name: '/deploy',
    meta: {
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
          name: i18n.t('menu.projectManage'),
        },
        component: () => import('@/views/project/ProjectManage.vue'),
      },
      {
        path: 'projectEdit/:pid?',
        name: 'projectEdit/:pid?',
        meta: {
          disabled: true,
          name: i18n.t('menu.projectEdit'),
        },
        component: () => import('@/views/project/ProjectEdit.vue'),
      },
      {
        path: 'projectDetail/:pid',
        name: 'projectDetail/:pid',
        meta: {
          disabled: true,
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
      name: i18n.t('menu.vuln'),
    },
    component: () => import('@/views/vuln/Index.vue'),
    children: [
      {
        path: 'vulnList',
        name: 'vulnList',
        meta: {
          name: i18n.t('menu.vulnList'),
        },
        component: () => import('@/views/vuln/VulnList.vue'),
      },
      {
        path: 'vulnDetail/:page/:id',
        name: 'vulnDetail/:page/:id',
        meta: {
          name: i18n.t('menu.vulnDetail'),
        },
        component: () => import('@/views/vuln/VulnDetail.vue'),
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
      name: i18n.t('menu.sca'),
    },
    component: () => import('@/views/sca/Index.vue'),
    children: [
      {
        path: 'scaList',
        name: 'scaList',
        meta: {
          disabled: true,
          name: i18n.t('menu.scaList'),
        },
        component: () => import('@/views/sca/ScaList.vue'),
      },
      {
        path: 'scaDetail/:page/:id',
        name: 'scaDetail/:page/:id',
        meta: {
          disabled: true,
          name: i18n.t('menu.scaDetail'),
        },
        component: () => import('@/views/sca/ScaDetail.vue'),
      },
    ],
  },
  {
    path: '/taint',
    name: 'taint',
    redirect: '/taint/search',
    meta: {
      isMenu: true,
      keepAlive: true,
      disabled: true,
      name: i18n.t('menu.taintPool'),
    },
    component: () => import('@/views/taint/Index.vue'),
    children: [
      {
        path: 'search',
        name: 'search',
        meta: {
          keepAlive: true,
          disabled: true,
          name: i18n.t('menu.taintPool'),
        },
        component: () => import('@/views/taint/Search.vue'),
      },
      {
        path: 'poolDetail/:id',
        name: 'poolDetail',
        meta: {
          keepAlive: true,
          disabled: true,
          name: i18n.t('menu.poolDetail'),
        },
        component: () => import('@/views/taint/PoolDetail.vue'),
      },
    ],
  },
  {
    path: '/setting',
    name: 'setting',
    redirect: '/setting/agentManage',
    meta: {
      isMenu: true,
      name: i18n.t('menu.setting'),
    },
    component: () => import('@/views/setting/Index.vue'),
    children: [
      {
        path: 'agentManage',
        name: 'agentManage',
        meta: {
          disabled: true,
          name: i18n.t('menu.agentManage'),
        },
        component: () => import('@/views/setting/AgentManage.vue'),
      },
      {
        path: 'strategyManage',
        name: 'strategyManage',
        meta: {
          name: i18n.t('menu.strategyManage'),
        },
        component: () => import('@/views/setting/StrategyManage.vue'),
      },
      {
        path: 'hookRule',
        name: 'hookRule',
        meta: {
          disabled: true,
          name: i18n.t('menu.hookRule'),
        },
        component: () => import('@/views/setting/hookRule.vue'),
      },
      // {
      //   path: 'upgradeOnline',
      //   name: 'upgradeOnline',
      //   meta: {
      //     name: i18n.t('menu.upgradeOnline'),
      //   },
      //   component: () => import('@/views/setting/UpgradeOnline.vue'),
      // },
      // {
      //   path: 'sysInfo',
      //   name: 'sysInfo',
      //   meta: {
      //     name: i18n.t('menu.sysInfo'),
      //   },
      //   component: () => import('@/views/setting/SysInfo.vue'),
      // },
      {
        path: 'changePassword',
        name: 'changePassword',
        meta: {
          disabled: true,
          name: i18n.t('menu.changePassword'),
        },
        component: () => import('@/views/setting/ChangePassword.vue'),
      },
      {
        path: 'logManage',
        name: 'logManage',
        meta: {
          disabled: true,
          name: i18n.t('menu.logManage'),
        },
        component: () => import('@/views/setting/LogManage.vue'),
      },
    ],
  },
  {
    path: '/deploy',
    name: '/deploy',
    meta: {
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
