import { defineStore } from 'pinia';
import { ref } from 'vue';
import { HttpClient } from '../core/http-client';

export const useProductStore = defineStore('product', () => {
    const products = ref<any[]>([]);
    const loading = ref(false);
    const error = ref('');

    async function fetchProducts() {
        loading.value = true;
        try {
            products.value = await HttpClient.get('/products');
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    async function createProduct(product: any) {
        loading.value = true;
        try {
            await HttpClient.post('/products', product);
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
            await HttpClient.put(`/products/${id}`, product);
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
            await HttpClient.delete(`/products/${id}`);
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
