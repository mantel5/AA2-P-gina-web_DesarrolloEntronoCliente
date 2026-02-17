// @ts-ignore
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// @ts-ignore
import { HttpClient } from '../core/http-client';

export const useAuthStore = defineStore('auth', () => {
    // Safe initialization from localStorage
    const storedUser = localStorage.getItem('user');
    let parsedUser = null;
    try {
        parsedUser = storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
    }

    const user = ref(parsedUser);
    const token = ref(localStorage.getItem('token') || null);
    const router = useRouter();

    async function login(credentials: any) {
        try {
            console.log('Attempting login with username:', credentials.username);
            const data: any = await HttpClient.post('/auth/login', credentials);
            console.log('Login response received:', data);

            if (!data.token || !data.user) {
                throw new Error('Invalid response structure from server');
            }

            user.value = data.user;
            token.value = data.token;
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
        } catch (error) {
            console.error('Login action error:', error);
            throw error;
        }
    }

    async function register(credentials: any) {
        await HttpClient.post('/auth/register', credentials);
    }

    function logout() {
        user.value = null;
        token.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
    }

    return { user, token, login, logout, register };
});
