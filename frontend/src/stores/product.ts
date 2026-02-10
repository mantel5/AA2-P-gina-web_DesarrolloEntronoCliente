import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProductStore = defineStore('product', () => {
    const products = ref([]);
    const loading = ref(false);
    const error = ref('');

    async function fetchProducts() {
        loading.value = true;
        try {
            const response = await fetch('http://localhost:3000/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            products.value = await response.json();
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    async function createProduct(product: any) {
        loading.value = true;
        try {
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (!response.ok) throw new Error('Failed to create product');
            await fetchProducts();
        } catch (err: any) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateProduct(id: number, product: any) {
        loading.value = true;
        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (!response.ok) throw new Error('Failed to update product');
            await fetchProducts();
        } catch (err: any) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteProduct(id: number) {
        loading.value = true;
        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete product');
            await fetchProducts();
        } catch (err: any) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct };
});
