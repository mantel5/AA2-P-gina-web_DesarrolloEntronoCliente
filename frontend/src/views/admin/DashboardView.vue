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

const productsPerCategoryData = computed(() => {
  const labels = categoryStore.categories.map((c: any) => c.name);
  const data = categoryStore.categories.map((c: any) => {
    return productStore.products.filter((p: any) => p.categoryId === c.id).length;
  });

  return {
    labels,
    datasets: [{
      label: t('products'),
      backgroundColor: '#00E5FF',
      data
    }]
  };
});

const barOptions = {
  responsive: true,
  maintainAspectRatio: false
};

const stockData = computed(() => {
  const labels = productStore.products.map((p: any) => p.name).slice(0, 5);
  const data = productStore.products.map((p: any) => p.stock).slice(0, 5);
  
  return {
    labels,
    datasets: [{
      backgroundColor: ['#00E5FF', '#00B8D4', '#18FFFF', '#455A64', '#B0BEC5'],
      data
    }]
  };
});

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false
};

const salesData = computed(() => {
  const dateStr = filterDate.value || '';
  const day = parseInt(dateStr.split('-')[2] || '1');
  const month = parseInt(dateStr.split('-')[1] || '1');
  
  const baseValue = (day * 5) + (month * 10);
  
  return {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
    datasets: [{
      label: 'Ventas Mensuales',
      backgroundColor: 'rgba(0, 229, 255, 0.2)',
      borderColor: '#00E5FF',
      pointBackgroundColor: '#FFFFFF',
      data: [
        baseValue % 100, 
        (baseValue + 20) % 100, 
        (baseValue + 50) % 100, 
        (baseValue + 10) % 100, 
        (baseValue + 80) % 100, 
        (baseValue + 30) % 100, 
        (baseValue + 60) % 100
      ]
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
    
    <v-row class="mt-4">
      <v-col cols="12" md="4">
        <v-card color="secondary" dark>
          <v-card-title>{{ $t('products') }}</v-card-title>
          <v-card-text class="text-h4">
            {{ productStore.products.length }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card color="secondary" dark>
          <v-card-title>{{ $t('categories') }}</v-card-title>
          <v-card-text class="text-h4">
            {{ categoryStore.categories.length }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card color="secondary" dark>
          <v-card-title>Filtro de Fecha</v-card-title>
          <v-card-text>
            <v-text-field 
              type="date" 
              v-model="filterDate" 
              label="Seleccionar Fecha"
              bg-color="secondary"
              density="compact"
              hide-details
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

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
