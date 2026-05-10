<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useOrderStore } from '../../stores/order';

const orderStore = useOrderStore();

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

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

// Tracks which order's detail panel is expanded
const expandedOrderId = ref<number | null>(null);

function toggleExpand(orderId: number) {
    expandedOrderId.value = expandedOrderId.value === orderId ? null : orderId;
}

async function handleStatusChange(orderId: number, newStatus: string) {
    await orderStore.updateOrderStatus(orderId, newStatus);
}

onMounted(() => {
    orderStore.fetchAllOrders();
});
</script>

<template>
    <v-container>
        <div class="mb-6">
            <h1 class="text-h4 text-primary">
                <v-icon class="mr-2">mdi-clipboard-list-outline</v-icon>
                Gestión de Pedidos
            </h1>
            <p class="text-medium-emphasis mt-1">Visualiza y actualiza el estado de todos los pedidos de la tienda.</p>
        </div>

        <!-- Loading -->
        <div v-if="orderStore.loading" class="text-center py-12">
            <v-progress-circular indeterminate color="primary" size="64" />
        </div>

        <!-- No orders -->
        <v-alert
            v-else-if="orderStore.orders.length === 0"
            type="info"
            variant="tonal"
            title="Sin pedidos"
            text="Todavía no se ha realizado ningún pedido en la tienda."
        />

        <!-- Orders table -->
        <v-card v-else variant="outlined">
            <v-list>
                <template v-for="order in orderStore.orders" :key="order.id">
                    <!-- Order row -->
                    <v-list-item
                        :title="`Pedido #${order.id} — ${order.username}`"
                        :subtitle="new Date(order.createdAt).toLocaleString('es-ES')"
                        @click="toggleExpand(order.id)"
                        class="cursor-pointer"
                    >
                        <template v-slot:append>
                            <div class="d-flex align-center ga-4">
                                <span class="text-subtitle-1 font-weight-bold text-primary">
                                    {{ order.total.toFixed(2) }} €
                                </span>

                                <!-- Status selector (stops click from toggling the row) -->
                                <v-select
                                    :model-value="order.status"
                                    :items="ORDER_STATUSES"
                                    density="compact"
                                    variant="outlined"
                                    hide-details
                                    style="min-width: 180px;"
                                    @click.stop
                                    @update:model-value="handleStatusChange(order.id, $event)"
                                >
                                    <template v-slot:selection="{ item }">
                                        <v-chip
                                            :color="statusColor[item.value] || 'grey'"
                                            variant="tonal"
                                            size="small"
                                        >
                                            {{ statusLabel[item.value] || item.value }}
                                        </v-chip>
                                    </template>
                                    <template v-slot:item="{ item, props }">
                                        <v-list-item v-bind="props" :title="statusLabel[item.value] || item.value">
                                            <template v-slot:prepend>
                                                <v-icon :color="statusColor[item.value]" size="small">mdi-circle</v-icon>
                                            </template>
                                        </v-list-item>
                                    </template>
                                </v-select>

                                <v-icon>
                                    {{ expandedOrderId === order.id ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                </v-icon>
                            </div>
                        </template>
                    </v-list-item>

                    <!-- Expandable items detail -->
                    <v-expand-transition>
                        <div v-if="expandedOrderId === order.id">
                            <v-divider />
                            <v-list-item
                                v-for="item in order.items"
                                :key="item.productId"
                                density="compact"
                                class="pl-8 bg-surface-variant"
                            >
                                <template v-slot:prepend>
                                    <v-icon size="small" class="mr-2">mdi-shoe-sneaker</v-icon>
                                </template>
                                <v-list-item-title>{{ item.productName }}</v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ item.quantity }} ud. × {{ item.unitPrice.toFixed(2) }} €
                                </v-list-item-subtitle>
                                <template v-slot:append>
                                    <span class="text-body-2 font-weight-bold">
                                        {{ (item.quantity * item.unitPrice).toFixed(2) }} €
                                    </span>
                                </template>
                            </v-list-item>
                        </div>
                    </v-expand-transition>

                    <v-divider />
                </template>
            </v-list>
        </v-card>
    </v-container>
</template>
