<template>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-space-between align-center">
        <h1>Gestión de Productos</h1>
        <v-btn color="primary" @click="openDialog()">Nuevo Producto</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
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
            <tr v-for="product in productStore.products" :key="product.id">
              <td>{{ product.id }}</td>
              <td>
                <v-img :src="product.image || 'https://via.placeholder.com/50'" width="50" height="50" cover></v-img>
              </td>
              <td>{{ product.name }}</td>
              <td>{{ product.price }}€</td>
              <td>{{ product.stock }}</td>
              <td>{{ product.categoryName || 'S/C' }}</td>
              <td class="text-right">
                <v-btn icon="mdi-pencil" size="small" color="info" class="mr-2" @click="openDialog(product)"></v-btn>
                <v-btn icon="mdi-delete" size="small" color="error" @click="deleteProduct(product.id)"></v-btn>
              </td>
            </tr>
            <tr v-if="productStore.products.length === 0">
              <td colspan="7" class="text-center">No hay productos</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedId ? 'Editar Producto' : 'Nuevo Producto' }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.name" label="Nombre" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.price" label="Precio" type="number" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.stock" label="Stock" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.categoryId"
                  :items="categoryStore.categories"
                  item-title="name"
                  item-value="id"
                  label="Categoría"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.image" label="URL Imagen"></v-text-field>
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
import { useProductStore } from '../../stores/product';
import { useCategoryStore } from '../../stores/category';

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const dialog = ref(false);
const editedId = ref<number | null>(null);
const editedItem = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  image: '',
  categoryId: null as number | null
});

onMounted(() => {
  productStore.fetchProducts();
  categoryStore.fetchCategories();
});

const openDialog = (item?: any) => {
  if (item) {
    editedId.value = item.id;
    editedItem.name = item.name;
    editedItem.description = item.description;
    editedItem.price = item.price;
    editedItem.stock = item.stock;
    editedItem.image = item.image;
    editedItem.categoryId = item.categoryId;
  } else {
    editedId.value = null;
    editedItem.name = '';
    editedItem.description = '';
    editedItem.price = 0;
    editedItem.stock = 0;
    editedItem.image = '';
    editedItem.categoryId = null;
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const save = async () => {
  if (editedId.value) {
    await productStore.updateProduct(editedId.value, editedItem);
  } else {
    await productStore.createProduct(editedItem);
  }
  closeDialog();
};

const deleteProduct = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    await productStore.deleteProduct(id);
  }
};
</script>
