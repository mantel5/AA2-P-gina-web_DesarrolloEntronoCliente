<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">ID</th>
        <th class="text-left">Imagen</th>
        <th class="text-left">Nombre</th>
        <th class="text-left">Precio</th>
        <th class="text-left">Stock</th>
        <th class="text-left">Categoría</th>
        <th class="text-right">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="product in products" :key="product.id">
        <td>{{ product.id }}</td>
        <td>
          <v-img :src="product.image || 'https://via.placeholder.com/50'" width="50" height="50" cover></v-img>
        </td>
        <td>{{ product.name }}</td>
        <td>{{ product.price }}€</td>
        <td>{{ product.stock }}</td>
        <td>{{ product.categoryName || 'S/C' }}</td>
        <td class="text-right">
          <v-btn icon="mdi-pencil" size="small" color="info" class="mr-2" @click="$emit('edit', product)"></v-btn>
          <v-btn icon="mdi-delete" size="small" color="error" @click="$emit('delete', product.id)"></v-btn>
        </td>
      </tr>
      <tr v-if="products.length === 0">
        <td colspan="7" class="text-center">No hay productos</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">

defineProps<{
  products: any[];
}>();

defineEmits<{
  (e: 'edit', product: any): void;
  (e: 'delete', id: number): void;
}>();
</script>
