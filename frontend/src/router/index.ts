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
            path: '/shop',
            name: 'shop',
            component: () => import('../views/ShopView.vue'),
            meta: { requiresAuth: true }
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
            path: '/cart',
            name: 'cart',
            component: () => import('../views/CartView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/my-orders',
            name: 'my-orders',
            component: () => import('../views/UserOrdersView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/admin',
            component: () => import('../layouts/AdminLayout.vue'),
            meta: { requiresAuth: true, requiresAdmin: true },
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
                },
                {
                    path: 'orders',
                    name: 'admin-orders',
                    component: () => import('../views/admin/AdminOrdersView.vue')
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
        return
    }

    if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
        next('/')
        return
    }

    next()
})

export default router
