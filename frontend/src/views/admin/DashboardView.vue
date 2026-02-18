<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useProductStore } from '../../stores/product';
import { useCategoryStore } from '../../stores/category';
import { Bar, Doughnut, Line } from 'vue-chartjs';
import { useI18n } from 'vue-i18n';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement
);

const { t } = useI18n();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const filterDate = ref(new Date().toISOString().substr(0, 10));

onMounted(async () => {
  await Promise.all([
    productStore.fetchProducts(),
    categoryStore.fetchCategories()
  ]);
});

// Chart 1: Products per Category (Bar Chart)
const productsPerCategoryData = computed(() => {
  const labels = categoryStore.categories.map((c: any) => c.name);
  const data = categoryStore.categories.map((c: any) => {
    return productStore.products.filter((p: any) => p.categoryId === c.id).length;
  });

  return {
    labels,
    datasets: [{
      label: t('products'),
      backgroundColor: '#00E5FF', // Sneaker Turquoise
      data
    }]
  };
});

const barOptions = {
  responsive: true,
  maintainAspectRatio: false
};

// Chart 2: Stock Distribution (Doughnut Chart)
const stockData = computed(() => {
  const labels = productStore.products.map((p: any) => p.name).slice(0, 5); // Top 5 products
  const data = productStore.products.map((p: any) => p.stock).slice(0, 5);
  
  return {
    labels,
    datasets: [{
      backgroundColor: ['#00E5FF', '#00B8D4', '#18FFFF', '#455A64', '#B0BEC5'], // Theme palette
      data
    }]
  };
});

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false
};

// Chart 3: Mock Sales Trend (Line Chart)
const salesData = computed(() => {
  return {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
    datasets: [{
      label: 'Ventas Mensuales',
      backgroundColor: 'rgba(0, 229, 255, 0.2)', // Transparent Turquoise
      borderColor: '#00E5FF', // Neon Turquoise
      pointBackgroundColor: '#FFFFFF',
      data: [45, 52, 38, 65, 48, 70, 55] // Static mock data
    }]
  };
});

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false
};
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-4">{{ $t('dashboard') }}</h1>
    
    <!-- KPI Cards -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card color="secondary" dark>
          <v-card-title>{{ $t('products') }}</v-card-title>
          <v-card-text class="text-h4">
            {{ productStore.products.length }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card color="secondary" dark>
          <v-card-title>{{ $t('categories') }}</v-card-title>
          <v-card-text class="text-h4">
            {{ categoryStore.categories.length }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts -->
    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>{{ $t('products') }} por {{ $t('category') }}</v-card-title>
          <v-card-text style="height: 300px; position: relative;">
             <Bar v-if="categoryStore.categories.length" :data="productsPerCategoryData" :options="barOptions" />
             <div v-else class="d-flex justify-center align-center h-100">Cargando datos...</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Top 5 Stock {{ $t('products') }}</v-card-title>
          <v-card-text style="height: 300px; position: relative;">
            <Doughnut v-if="productStore.products.length" :data="stockData" :options="doughnutOptions" />
            <div v-else class="d-flex justify-center align-center h-100">Cargando datos...</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card>
          <v-card-title>Tendencia de Ventas (Simulado)</v-card-title>
           <v-card-text style="height: 300px; position: relative;">
            <Line :data="salesData" :options="lineOptions" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
