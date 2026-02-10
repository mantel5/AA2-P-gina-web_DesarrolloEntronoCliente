<template>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-space-between align-center">
        <h1>Gestión de Categorías</h1>
        <v-btn color="primary" @click="openDialog()">Nueva Categoría</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
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
            <tr v-for="category in categoryStore.categories" :key="category.id">
              <td>{{ category.id }}</td>
              <td>{{ category.name }}</td>
              <td>{{ category.description }}</td>
              <td class="text-right">
                <v-btn icon="mdi-pencil" size="small" color="info" class="mr-2" @click="openDialog(category)"></v-btn>
                <v-btn icon="mdi-delete" size="small" color="error" @click="deleteCategory(category.id)"></v-btn>
              </td>
            </tr>
            <tr v-if="categoryStore.categories.length === 0">
              <td colspan="4" class="text-center">No hay categorías</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedId ? 'Editar Categoría' : 'Nueva Categoría' }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedItem.name" label="Nombre" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="editedItem.description" label="Descripción"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useCategoryStore } from '../../stores/category';

const categoryStore = useCategoryStore();
const dialog = ref(false);
const editedId = ref<number | null>(null);
const editedItem = reactive({
  name: '',
  description: ''
});

onMounted(() => {
  categoryStore.fetchCategories();
});

const openDialog = (item?: any) => {
  if (item) {
    editedId.value = item.id;
    editedItem.name = item.name;
    editedItem.description = item.description;
  } else {
    editedId.value = null;
    editedItem.name = '';
    editedItem.description = '';
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const save = async () => {
  if (editedId.value) {
    await categoryStore.updateCategory(editedId.value, editedItem);
  } else {
    await categoryStore.createCategory(editedItem);
  }
  closeDialog();
};

const deleteCategory = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
    await categoryStore.deleteCategory(id);
  }
};
</script>
