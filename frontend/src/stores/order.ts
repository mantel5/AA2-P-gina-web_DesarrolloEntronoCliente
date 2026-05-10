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
    username?: string; // Only present in admin view
    status: string;
    total: number;
    createdAt: string;
    items: OrderItem[];
}

export const useOrderStore = defineStore('order', () => {
    // ---------- State ----------
    const orders = ref<Order[]>([]);
    const loading = ref(false);
    const error = ref('');

    // ---------- Actions ----------

    // User: convert the current cart into a real order
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
            orders.value.unshift(newOrder); // prepend so it appears at top
            cartStore.clearCart();
            return newOrder;
        } catch (err: any) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    // User: fetch their own order history
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

    // Admin: fetch ALL orders from every user
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

    // Admin: change the status of an order
    async function updateOrderStatus(orderId: number, status: string) {
        loading.value = true;
        error.value = '';
        try {
            await HttpClient.put(`/orders/${orderId}/status`, { status });
            // Update locally to avoid a full re-fetch
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
