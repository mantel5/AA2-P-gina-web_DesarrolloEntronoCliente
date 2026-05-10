<script setup lang="ts">
import { useCartStore } from '../stores/cart';
import { useOrderStore } from '../stores/order';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const cartStore = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();

const checkingOut = ref(false);
const checkoutError = ref('');

async function handleCheckout() {
    checkingOut.value = true;
    checkoutError.value = '';
    try {
        await orderStore.checkoutCart();
        // Redirect to the order history page after a successful checkout
        router.push('/my-orders');
    } catch (err: any) {
        checkoutError.value = err.message || 'Error al procesar el pedido.';
    } finally {
        checkingOut.value = false;
    }
}
</script>

<template>
    <v-container>
        <div class="d-flex justify-space-between align-center mb-6">
            <h1 class="text-h4 text-primary">
                <v-icon class="mr-2">mdi-cart-outline</v-icon>
                Mi Carrito
            </h1>
            <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/shop">
                Seguir comprando
            </v-btn>
        </div>

        <!-- Empty cart state -->
        <div v-if="cartStore.items.length === 0" class="text-center py-16">
            <v-icon size="80" color="grey-lighten-1">mdi-cart-off</v-icon>
            <h3 class="text-h6 text-grey mt-4">Tu carrito está vacío.</h3>
            <v-btn color="primary" variant="flat" class="mt-6" to="/shop" prepend-icon="mdi-store">
                Ir a la Tienda
            </v-btn>
        </div>

        <!-- Cart with items -->
        <v-row v-else>
            <!-- Item list (left column) -->
            <v-col cols="12" lg="8">
                <v-card variant="outlined">
                    <v-list lines="two">
                        <template v-for="(item, index) in cartStore.items" :key="item.productId">
                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-avatar size="64" rounded="md" class="mr-3">
                                        <v-img
                                            :src="item.image || 'https://placehold.co/64x64?text=👟'"
                                            cover
                                        />
                                    </v-avatar>
                                </template>

                                <v-list-item-title class="font-weight-bold">
                                    {{ item.productName }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ item.unitPrice.toFixed(2) }} € / unidad
                                </v-list-item-subtitle>

                                <template v-slot:append>
                                    <div class="d-flex align-center ga-2">
                                        <!-- Quantity controls -->
                                        <v-btn
                                            icon="mdi-minus"
                                            size="small"
                                            variant="tonal"
                                            @click="cartStore.decreaseQuantity(item.productId)"
                                        />
                                        <span class="text-h6 font-weight-bold" style="min-width: 2rem; text-align: center;">
                                            {{ item.quantity }}
                                        </span>
                                        <v-btn
                                            icon="mdi-plus"
                                            size="small"
                                            variant="tonal"
                                            @click="cartStore.addToCart({ productId: item.productId, productName: item.productName, unitPrice: item.unitPrice, image: item.image })"
                                        />

                                        <span class="text-subtitle-1 font-weight-bold text-primary ml-4" style="min-width: 5rem; text-align: right;">
                                            {{ (item.unitPrice * item.quantity).toFixed(2) }} €
                                        </span>

                                        <v-btn
                                            icon="mdi-trash-can-outline"
                                            size="small"
                                            variant="plain"
                                            color="error"
                                            class="ml-2"
                                            @click="cartStore.removeFromCart(item.productId)"
                                        />
                                    </div>
                                </template>
                            </v-list-item>
                            <v-divider v-if="index < cartStore.items.length - 1" />
                        </template>
                    </v-list>

                    <v-card-actions class="pa-4">
                        <v-btn
                            variant="text"
                            color="error"
                            prepend-icon="mdi-cart-remove"
                            @click="cartStore.clearCart()"
                        >
                            Vaciar carrito
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>

            <!-- Order summary (right column) -->
            <v-col cols="12" lg="4">
                <v-card variant="outlined">
                    <v-card-title class="pa-4">Resumen del Pedido</v-card-title>
                    <v-divider />
                    <v-list density="compact" class="pa-2">
                        <v-list-item v-for="item in cartStore.items" :key="item.productId">
                            <v-list-item-title>{{ item.productName }} × {{ item.quantity }}</v-list-item-title>
                            <template v-slot:append>
                                {{ (item.unitPrice * item.quantity).toFixed(2) }} €
                            </template>
                        </v-list-item>
                    </v-list>
                    <v-divider />
                    <v-card-text>
                        <div class="d-flex justify-space-between text-h6 font-weight-bold">
                            <span>Total</span>
                            <span class="text-primary">{{ cartStore.total.toFixed(2) }} €</span>
                        </div>
                    </v-card-text>

                    <v-card-actions class="px-4 pb-4">
                        <v-btn
                            color="primary"
                            variant="flat"
                            block
                            size="large"
                            prepend-icon="mdi-check-circle"
                            :loading="checkingOut"
                            @click="handleCheckout"
                        >
                            Confirmar Pedido
                        </v-btn>
                    </v-card-actions>

                    <v-alert
                        v-if="checkoutError"
                        type="error"
                        variant="tonal"
                        class="ma-3 mt-0"
                    >
                        {{ checkoutError }}
                    </v-alert>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
