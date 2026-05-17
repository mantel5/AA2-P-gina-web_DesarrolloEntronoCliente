<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useProductStore } from '../stores/product';
import { useCategoryStore } from '../stores/category';
import { useCartStore } from '../stores/cart';

const { t } = useI18n();

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const cartStore = useCartStore();
const search = ref('');

onMounted(async () => {
  await Promise.all([
    productStore.fetchProducts(),
    categoryStore.fetchCategories()
  ]);
});

const filteredProducts = computed(() => {
  let products = productStore.products;
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    products = products.filter((p: any) => p.name.toLowerCase().includes(searchTerm));
  }
  return products;
});

const getCategoryName = (categoryId: number) => {
  const category = categoryStore.categories.find((c: any) => c.id === categoryId);
  return category ? category.name : 'Unknown';
};
</script>

<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 text-primary">{{ $t('shop_title') }}</h1>
      <div class="d-flex ga-3 align-center">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/">{{ $t('shop_go_home') }}</v-btn>
        <v-btn to="/my-orders" variant="outlined" prepend-icon="mdi-package-variant-closed">
          {{ $t('shop_my_orders') }}
        </v-btn>
        <v-btn to="/cart" color="primary" variant="flat">
          <v-badge
            v-if="cartStore.itemCount > 0"
            :content="cartStore.itemCount"
            color="error"
            floating
          >
            <v-icon>mdi-cart</v-icon>
          </v-badge>
          <v-icon v-else>mdi-cart</v-icon>
          <span class="ml-2">{{ $t('shop_cart_btn') }}</span>
        </v-btn>
      </div>
    </div>

    <!-- Barra de búsqueda -->
    <v-row>
      <v-col cols="12" md="6" lg="4">
        <v-text-field
          v-model="search"
          :label="$t('shop_search_placeholder')"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
          class="mb-6"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row v-if="productStore.loading">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else-if="filteredProducts.length === 0">
      <v-col cols="12" class="text-center py-12">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-shoe-sneaker</v-icon>
        <h3 class="text-h6 text-grey">{{ $t('shop_no_results') }}</h3>
      </v-col>
    </v-row>

    <!-- Grid de productos -->
    <v-row v-else>
      <v-col 
        v-for="product in filteredProducts" 
        :key="product.id"
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card class="h-100 d-flex flex-column hover-card">
          <v-img
            :src="product.image || 'https://via.placeholder.com/300x300?text=No+Image'"
            height="250"
            cover
            class="bg-grey-lighten-2"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular indeterminate color="grey-lighten-4"></v-progress-circular>
              </div>
            </template>
          </v-img>

          <v-card-item>
            <div class="text-overline text-secondary mb-1">
              {{ getCategoryName(product.categoryId) }}
            </div>
            <v-card-title class="text-h6 font-weight-bold" style="white-space: normal; line-height: 1.2;">
              {{ product.name }}
            </v-card-title>
            <div class="text-subtitle-1 text-primary font-weight-bold mt-2">
              {{ product.price }} €
            </div>
          </v-card-item>

          <v-card-text class="pt-0 text-truncate text-medium-emphasis flex-grow-1">
            {{ product.description || $t('shop_no_description') }}
          </v-card-text>

          <v-card-actions class="px-4 pb-4 mt-auto">
            <v-btn 
              color="primary" 
              variant="flat" 
              block 
              prepend-icon="mdi-cart-plus"
              :disabled="product.stock <= 0"
              @click="cartStore.addToCart({ productId: product.id, productName: product.name, unitPrice: product.price, image: product.image })"
            >
              {{ product.stock > 0 ? $t('shop_add_to_cart') : $t('shop_out_of_stock') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.hover-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15) !important;
}
</style>
