import { defineStore } from 'pinia';
import { ref } from 'vue';
import { HttpClient } from '../core/http-client';
import { useCartStore } from './cart';

export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
}

export interface Order {
    id: number;
    userId: number;
    username?: string;
    status: string;
    total: number;
    createdAt: string;
    items: OrderItem[];
}

export const useOrderStore = defineStore('order', () => {
    const orders = ref<Order[]>([]);
    const loading = ref(false);
    const error = ref('');


    async function checkoutCart() {
        const cartStore = useCartStore();
        if (cartStore.items.length === 0) throw new Error('Cart is empty');

        loading.value = true;
        error.value = '';
        try {
            const payload = {
                items: cartStore.items.map(i => ({
                    productId: i.productId,
                    productName: i.productName,
                    quantity: i.quantity,
                    unitPrice: i.unitPrice,
                })),
                total: cartStore.total,
            };
            const newOrder: Order = await HttpClient.post('/orders', payload);
            orders.value.unshift(newOrder);
            cartStore.clearCart();
            return newOrder;
        } catch (err: any) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function fetchMyOrders() {
        loading.value = true;
        error.value = '';
        try {
            orders.value = await HttpClient.get('/orders/my');
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    async function fetchAllOrders() {
        loading.value = true;
        error.value = '';
        try {
            orders.value = await HttpClient.get('/orders');
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    async function updateOrderStatus(orderId: number, status: string) {
        loading.value = true;
        error.value = '';
        try {
            await HttpClient.put(`/orders/${orderId}/status`, { status });
            const order = orders.value.find(o => o.id === orderId);
            if (order) order.status = status;
        } catch (err: any) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return { orders, loading, error, checkoutCart, fetchMyOrders, fetchAllOrders, updateOrderStatus };
});
