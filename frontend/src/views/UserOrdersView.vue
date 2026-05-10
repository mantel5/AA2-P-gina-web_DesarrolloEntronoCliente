<script setup lang="ts">
import { onMounted } from 'vue';
import { useOrderStore } from '../stores/order';

const orderStore = useOrderStore();

// Map backend status strings to display-friendly chip colours
const statusColor: Record<string, string> = {
    pending: 'orange',
    processing: 'blue',
    shipped: 'cyan',
    delivered: 'success',
    cancelled: 'error',
};

const statusLabel: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
};

onMounted(() => {
    orderStore.fetchMyOrders();
});
</script>

<template>
    <v-container>
        <div class="d-flex justify-space-between align-center mb-6">
            <h1 class="text-h4 text-primary">
                <v-icon class="mr-2">mdi-package-variant-closed</v-icon>
                Mis Pedidos
            </h1>
            <v-btn variant="text" prepend-icon="mdi-store" to="/shop">
                Volver a la Tienda
            </v-btn>
        </div>

        <!-- Loading skeleton -->
        <v-row v-if="orderStore.loading">
            <v-col cols="12" class="text-center py-12">
                <v-progress-circular indeterminate color="primary" size="64" />
            </v-col>
        </v-row>

        <!-- No orders yet -->
        <div v-else-if="orderStore.orders.length === 0" class="text-center py-16">
            <v-icon size="80" color="grey-lighten-1">mdi-package-variant-closed-remove</v-icon>
            <h3 class="text-h6 text-grey mt-4">Aún no has realizado ningún pedido.</h3>
            <v-btn color="primary" variant="flat" class="mt-6" to="/shop" prepend-icon="mdi-store">
                ¡Empieza a comprar!
            </v-btn>
        </div>

        <!-- Order list -->
        <v-row v-else>
            <v-col
                v-for="order in orderStore.orders"
                :key="order.id"
                cols="12"
                md="6"
            >
                <v-card variant="outlined" class="h-100">
                    <v-card-title class="d-flex justify-space-between align-center pa-4">
                        <span>Pedido #{{ order.id }}</span>
                        <v-chip
                            :color="statusColor[order.status] || 'grey'"
                            variant="tonal"
                            size="small"
                        >
                            {{ statusLabel[order.status] || order.status }}
                        </v-chip>
                    </v-card-title>

                    <v-card-subtitle class="px-4 pb-2">
                        {{ new Date(order.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                    </v-card-subtitle>

                    <v-divider />

                    <v-list density="compact">
                        <v-list-item
                            v-for="item in order.items"
                            :key="item.productId"
                            :title="item.productName"
                            :subtitle="`${item.quantity} × ${item.unitPrice.toFixed(2)} €`"
                        >
                            <template v-slot:append>
                                <span class="text-body-2 font-weight-bold">
                                    {{ (item.quantity * item.unitPrice).toFixed(2) }} €
                                </span>
                            </template>
                        </v-list-item>
                    </v-list>

                    <v-divider />

                    <v-card-text class="d-flex justify-space-between align-center">
                        <span class="text-body-1">Total del pedido</span>
                        <span class="text-h6 font-weight-bold text-primary">
                            {{ order.total.toFixed(2) }} €
                        </span>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
