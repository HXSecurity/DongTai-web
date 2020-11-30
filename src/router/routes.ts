import { RouteConfig } from 'vue-router'
import { i18n } from '@/config/lang'

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/vulnList',
    meta: {
      name: i18n.t('menu.home')
    },
    component: () => import('@/views/layout/Index.vue'),
    children: [
      {
        path: 'vulnList',
        meta: {
          name: i18n.t('menu.vulnList')
        },
        component: () => import('@/views/vuln/VulnList.vue')
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
