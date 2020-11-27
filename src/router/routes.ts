import {RouteConfig} from 'vue-router'


const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'index',
    // redirect: '/login',
    component: () => import('@/views/layout/Index.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
]

export default routes
