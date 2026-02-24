import { defineStore } from 'pinia';
import { ref } from 'vue';
import { HttpClient } from '../core/http-client';

export const useCategoryStore = defineStore('category', () => {
    const categories = ref<any[]>([]);
    const loading = ref(false);
    const error = ref('');

    async function fetchCategories() {
        loading.value = true;
        try {
            categories.value = await HttpClient.get('/categories');
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    async function createCategory(category: any) {
        loading.value = true;
        try {
            await HttpClient.post('/categories', category);
            await fetchCategories();
        } catch (err: any) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateCategory(id: number, category: any) {
        loading.value = true;
        try {
            await HttpClient.put(`/categories/${id}`, category);
            await fetchCategories();
        } catch (err: any) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteCategory(id: number) {
        loading.value = true;
        try {
            await HttpClient.delete(`/categories/${id}`);
            await fetchCategories();
        } catch (err: any) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory };
});
