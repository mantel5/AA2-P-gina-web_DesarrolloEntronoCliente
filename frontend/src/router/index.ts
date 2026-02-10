import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/HomeView.vue')
        },
        {
            path: '/auth',
            component: () => import('../layouts/AuthLayout.vue'),
            children: [
                {
                    path: 'login',
                    name: 'login',
                    component: () => import('../views/auth/LoginView.vue')
                },
                {
                    path: 'register',
                    name: 'register',
                    component: () => import('../views/auth/RegisterView.vue')
                }
            ]
        },
        {
            path: '/login',
            redirect: '/auth/login'
        },
        {
            path: '/admin',
            component: () => import('../layouts/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: () => import('../views/admin/DashboardView.vue')
                },
                {
                    path: 'categories',
                    name: 'categories',
                    component: () => import('../views/admin/CategoryList.vue')
                },
                {
                    path: 'products',
                    name: 'products',
                    component: () => import('../views/admin/ProductList.vue')
                }
            ]
        }
    ]
})

import { useAuthStore } from '../stores/auth'

router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requiresAuth && !authStore.token) {
        next('/auth/login')
    } else {
        next()
    }
})

export default router
