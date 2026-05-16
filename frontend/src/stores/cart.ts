import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface CartItem {
    productId: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    image?: string;
}

export const useCartStore = defineStore('cart', () => {

    const storedCart = sessionStorage.getItem('cart');
    const items = ref<CartItem[]>(storedCart ? JSON.parse(storedCart) : []);

    function _persist() {
        sessionStorage.setItem('cart', JSON.stringify(items.value));
    }

    const itemCount = computed(() =>
        items.value.reduce((sum, item) => sum + item.quantity, 0)
    );

    const total = computed(() =>
        items.value.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    );

    function addToCart(product: Omit<CartItem, 'quantity'>) {
        const existing = items.value.find(i => i.productId === product.productId);
        if (existing) {
            existing.quantity++;
        } else {
            items.value.push({ ...product, quantity: 1 });
        }
        _persist();
    }

    function removeFromCart(productId: number) {
        items.value = items.value.filter(i => i.productId !== productId);
        _persist();
    }

    function decreaseQuantity(productId: number) {
        const item = items.value.find(i => i.productId === productId);
        if (!item) return;
        if (item.quantity <= 1) {
            removeFromCart(productId);
        } else {
            item.quantity--;
            _persist();
        }
    }

    function clearCart() {
        items.value = [];
        sessionStorage.removeItem('cart');
    }

    return { items, itemCount, total, addToCart, removeFromCart, decreaseQuantity, clearCart };
});
