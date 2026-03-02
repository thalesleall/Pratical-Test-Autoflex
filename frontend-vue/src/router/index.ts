import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/products', name: 'products', component: () => import('@/views/ProductsView.vue') },
    { path: '/materials', name: 'materials', component: () => import('@/views/MaterialsView.vue') },
    {
      path: '/compositions',
      name: 'compositions',
      component: () => import('@/views/CompositionsView.vue'),
    },
    {
      path: '/production',
      name: 'production',
      component: () => import('@/views/ProductionView.vue'),
    },
  ],
})

export default router
