import { RouteConfig } from 'vue-router'
import { i18n } from '@/config/lang'

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/vuln',
    meta: {
      name: i18n.t('menu.home')
    },
    component: () => import('@/views/layout/Index.vue'),
    children: [
      {
        path: 'vuln',
        redirect: '/vuln/vulnList',
        meta: {
          name: i18n.t('menu.vuln')
        },
        component: () => import('@/views/vuln/Index.vue'),
        children:[
          {
            path: 'vulnList',
            meta: {
              name: i18n.t('menu.vulnList')
            },
            component: () => import('@/views/vuln/VulnList.vue')
          },
          {
            path: 'vulnDetail/:page/:id',
            meta: {
              name: i18n.t('menu.vulnDetail')
            },
            component: () => import('@/views/vuln/VulnDetail.vue')
          }
        ]
      },
      {
        path: 'sca',
        redirect: '/sca/scaList',
        meta: {
          name: i18n.t('menu.sca')
        },
        component: () => import('@/views/sca/Index.vue'),
        children:[
          {
            path: 'scaList',
            meta: {
              name: i18n.t('menu.scaList')
            },
            component: () => import('@/views/sca/ScaList.vue')
          },
          {
            path: 'scaDetail/:page/:id',
            meta: {
              name: i18n.t('menu.scaDetail')
            },
            component: () => import('@/views/sca/ScaDetail.vue')
          }
        ]
      },
      {
        path: 'setting',
        redirect: '/setting/agentManage',
        meta:{
          name: i18n.t('menu.setting')
        },
        component: () => import('@/views/setting/Index.vue'),
        children:[
          {
            path: 'agentManage',
            meta: {
              name: i18n.t('menu.agentManage')
            },
            component: () => import('@/views/setting/AgentManage.vue')
          },
          {
            path: 'strategyManage',
            meta: {
              name: i18n.t('menu.strategyManage')
            },
            component: () => import('@/views/setting/StrategyManage.vue')
          },
          {
            path: 'changePassword',
            meta: {
              name: i18n.t('menu.changePassword')
            },
            component: () => import('@/views/setting/ChangePassword.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    meta: {
      name: i18n.t('menu.login')
    },
    component: () => import('@/views/Login.vue')
  }
]

export default routes
