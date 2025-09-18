import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue')
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('@/views/PricingView.vue')
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('@/views/FaqView.vue')
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/CheckoutView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/agents',
      name: 'agents',
      component: () => import('@/views/agents/AgentsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/agents/category/:category',
      name: 'category',
      component: () => import('@/views/agents/CategoryView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/views/chat/ChatView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('@/views/community/CommunityView.vue')
    },
    {
      path: '/checkin',
      name: 'checkin',
      component: () => import('@/views/points/CheckinView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/deploy/:id',
      name: 'deploy',
      component: () => import('@/views/deploy/DeployView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/deploy/detail/:id',
      name: 'deployment-detail',
      component: () => import('@/views/deploy/DeploymentDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/agents/create',
      name: 'create-agent',
      component: () => import('@/views/agents/CreateAgentView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/backup',
      name: 'backup',
      component: () => import('@/views/BackupView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

export default router
