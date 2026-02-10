import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCategoryStore = defineStore('category', () => {
    const categories = ref([]);
    const loading = ref(false);
    const error = ref('');

    async function fetchCategories() {
        loading.value = true;
        try {
            const response = await fetch('http://localhost:3000/api/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            categories.value = await response.json();
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    async function createCategory(category: any) {
        loading.value = true;
        try {
            const response = await fetch('http://localhost:3000/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category)
            });
            if (!response.ok) throw new Error('Failed to create category');
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
            const response = await fetch(`http://localhost:3000/api/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category)
            });
            if (!response.ok) throw new Error('Failed to update category');
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
            const response = await fetch(`http://localhost:3000/api/categories/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete category');
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
