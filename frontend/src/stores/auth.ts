import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
    const token = ref(localStorage.getItem('token') || null);
    const router = useRouter();

    function login(userData: any, authToken: string) {
        user.value = userData;
        token.value = authToken;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
    }

    function logout() {
        user.value = null;
        token.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
    }

    return { user, token, login, logout };
});
