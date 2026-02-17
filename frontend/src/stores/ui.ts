import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
    const loading = ref(false);
    const snackbar = ref({
        show: false,
        message: '',
        color: 'success'
    });

    function showSnackbar(message: string, color: 'success' | 'error' | 'info' = 'success') {
        snackbar.value = {
            show: true,
            message,
            color
        };
    }

    function setLoading(value: boolean) {
        loading.value = value;
    }

    return { loading, snackbar, showSnackbar, setLoading };
});
