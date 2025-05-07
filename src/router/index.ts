import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: LoginPage
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
