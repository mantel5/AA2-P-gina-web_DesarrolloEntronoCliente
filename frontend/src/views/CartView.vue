<script setup lang="ts">
import { useCartStore } from '../stores/cart';
import { useOrderStore } from '../stores/order';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const cartStore = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();
const { t } = useI18n();

const checkingOut = ref(false);
const checkoutError = ref('');
const checkoutSuccess = ref(false);
const confirmDialog = ref(false);

// abre el diálogo de confirmación
function openConfirmDialog() {
    confirmDialog.value = true;
}

// El usuario pulsó "No, volver"
function cancelCheckout() {
    confirmDialog.value = false;
}

// El usuario pulsó "Sí, confirmar"
async function handleCheckout() {
    confirmDialog.value = false;
    checkingOut.value = true;
    checkoutError.value = '';
    checkoutSuccess.value = false;
    try {
        await orderStore.checkoutCart();
        checkoutSuccess.value = true;
        // hacemos la redirección a la página de los pedidos del usuario
        setTimeout(() => router.push('/my-orders'), 2000);
    } catch (err: any) {
        checkoutError.value = err.message || t('cart_checkout_error_default');
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
                {{ $t('cart_title') }}
            </h1>
            <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/shop">
                {{ $t('cart_keep_shopping') }}
            </v-btn>
        </div>

        <!-- Estado de carrito vacío -->
        <div v-if="cartStore.items.length === 0" class="text-center py-16">
            <v-icon size="80" color="grey-lighten-1">mdi-cart-off</v-icon>
            <h3 class="text-h6 text-grey mt-4">{{ $t('cart_empty_title') }}</h3>
            <v-btn color="primary" variant="flat" class="mt-6" to="/shop" prepend-icon="mdi-store">
                {{ $t('cart_go_to_shop') }}
            </v-btn>
        </div>

        <!-- Carrito con productos -->
        <v-row v-else>
            <!-- Lista de productos (columna izquierda) -->
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
                                    {{ item.unitPrice.toFixed(2) }} {{ $t('cart_unit_price') }}
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
                            {{ $t('cart_clear') }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>

            <!-- Resumen del pedido (columna derecha) -->
            <v-col cols="12" lg="4">
                <v-card variant="outlined">
                    <v-card-title class="pa-4">{{ $t('cart_order_summary') }}</v-card-title>
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
                            <span>{{ $t('cart_total') }}</span>
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
                            @click="openConfirmDialog"
                        >
                            {{ $t('cart_confirm_order') }}
                        </v-btn>
                    </v-card-actions>

                    <!-- Mensaje de éxito -->
                    <v-alert
                        v-if="checkoutSuccess"
                        type="success"
                        variant="tonal"
                        class="ma-3 mt-0"
                        icon="mdi-check-circle"
                        closable
                    >
                        {{ $t('cart_checkout_success') }}
                    </v-alert>

                    <!-- Mensaje de error -->
                    <v-alert
                        v-if="checkoutError"
                        type="error"
                        variant="tonal"
                        class="ma-3 mt-0"
                        closable
                    >
                        {{ checkoutError }}
                    </v-alert>
                </v-card>
            </v-col>
        </v-row>

        <!-- Diálogo de confirmación -->
        <v-dialog v-model="confirmDialog" max-width="420" persistent>
            <v-card rounded="lg">
                <v-card-title class="d-flex align-center ga-2 pt-5 px-5">
                    <v-icon color="primary" size="28">mdi-cart-check</v-icon>
                    {{ $t('cart_confirm_dialog_title') }}
                </v-card-title>

                <v-card-text class="px-5 pb-2 text-body-1">
                    {{ $t('cart_confirm_dialog_text') }}
                </v-card-text>

                <v-card-actions class="pa-4 pt-2 ga-2 justify-end">
                    <v-btn
                        variant="outlined"
                        prepend-icon="mdi-close"
                        @click="cancelCheckout"
                    >
                        {{ $t('cart_confirm_no') }}
                    </v-btn>
                    <v-btn
                        color="primary"
                        variant="flat"
                        prepend-icon="mdi-check"
                        @click="handleCheckout"
                    >
                        {{ $t('cart_confirm_yes') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
