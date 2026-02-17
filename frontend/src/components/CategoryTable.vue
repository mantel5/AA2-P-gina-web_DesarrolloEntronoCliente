<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">ID</th>
        <th class="text-left">Nombre</th>
        <th class="text-left">Descripción</th>
        <th class="text-right">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="category in categories" :key="category.id">
        <td>{{ category.id }}</td>
        <td>{{ category.name }}</td>
        <td>{{ category.description }}</td>
        <td class="text-right">
          <v-btn icon="mdi-pencil" size="small" color="info" class="mr-2" @click="$emit('edit', category)"></v-btn>
          <v-btn icon="mdi-delete" size="small" color="error" @click="$emit('delete', category.id)"></v-btn>
        </td>
      </tr>
      <tr v-if="categories.length === 0">
        <td colspan="4" class="text-center">No hay categorías</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{
  categories: any[];
}>();

defineEmits<{
  (e: 'edit', category: any): void;
  (e: 'delete', id: number): void;
}>();
</script>
