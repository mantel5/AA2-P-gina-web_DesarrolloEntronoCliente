<template>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-space-between align-center">
        <h1 class="text-h4">{{ $t('manage_products') }}</h1>
        <div class="d-flex align-center">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Buscar..."
            single-line
            hide-details
            density="compact"
            class="mr-4"
            style="width: 250px"
          ></v-text-field>
          <v-btn color="primary" @click="openDialog()">{{ $t('new_product') }}</v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
    <v-row>
      <v-col>
        <ProductTable 
          :products="filteredProducts" 
          @edit="openDialog" 
          @delete="deleteProduct" 
        />
      </v-col>
    </v-row>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedId ? $t('edit_product') : $t('new_product') }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <form @submit.prevent="save">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="name"
                    :error-messages="nameError"
                    :label="$t('name')"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="price"
                    :error-messages="priceError"
                    :label="$t('price')"
                    type="number"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="stock"
                    :error-messages="stockError"
                    :label="$t('stock')"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="categoryId"
                    :error-messages="categoryIdError"
                    :items="categoryStore.categories"
                    item-title="name"
                    item-value="id"
                    :label="$t('category')"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="image" :label="$t('image_url')"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="description" :label="$t('description')"></v-textarea>
                </v-col>
              </v-row>
            </form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDialog">{{ $t('cancel') }}</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">{{ $t('save') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useProductStore } from '../../stores/product';
import { useCategoryStore } from '../../stores/category';
import ProductTable from '../../components/ProductTable.vue';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2';

const { t } = useI18n();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const dialog = ref(false);
const editedId = ref<number | null>(null);
const search = ref('');

const filteredProducts = computed(() => {
  if (!search.value) return productStore.products;
  const searchTerm = search.value.toLowerCase();
  return productStore.products.filter((product: any) => 
    product.name.toLowerCase().includes(searchTerm)
  );
});

// Validation Schema
const schema = yup.object({
  name: yup.string().required(t('validation_name_required')).min(3, t('validation_name_min')),
  price: yup.number().required(t('validation_price_required')).min(0, t('validation_price_min')),
  stock: yup.number().required(t('validation_stock_required')).min(0, t('validation_stock_min')).integer(t('validation_stock_integer')),
  categoryId: yup.number().required(t('validation_category_required')).nullable(),
  image: yup.string().nullable(),
  description: yup.string().nullable()
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const { value: name, errorMessage: nameError } = useField<string>('name');
const { value: price, errorMessage: priceError } = useField<number>('price');
const { value: stock, errorMessage: stockError } = useField<number>('stock');
const { value: categoryId, errorMessage: categoryIdError } = useField<any>('categoryId');
const { value: image } = useField<string>('image');
const { value: description } = useField<string>('description');

onMounted(() => {
  productStore.fetchProducts();
  categoryStore.fetchCategories();
});

const openDialog = (item?: any) => {
  if (item) {
    editedId.value = item.id;
    name.value = item.name;
    description.value = item.description;
    price.value = item.price;
    stock.value = item.stock;
    image.value = item.image;
    categoryId.value = item.categoryId;
  } else {
    editedId.value = null;
    resetForm();
    price.value = 0;
    stock.value = 0;
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  resetForm();
};

const save = handleSubmit(async (values) => {
  const isEdit = !!editedId.value;
  const actionText = isEdit ? t('edit_product') : t('new_product');
  
  const result = await Swal.fire({
    title: `¿${actionText}?`,
    text: "Confirma para guardar los cambios.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#00E5FF',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, guardar',
    cancelButtonText: 'Cancelar',
    background: '#455A64', // Darker gray (Secondary)
    color: '#ffffff'
  });

  if (result.isConfirmed) {
    try {
      if (editedId.value) {
        await productStore.updateProduct(editedId.value, values);
      } else {
        await productStore.createProduct(values);
      }
      closeDialog();
      Swal.fire({
        title: '¡Guardado!',
        text: 'El producto ha sido guardado correctamente.',
        icon: 'success',
        confirmButtonColor: '#00E5FF',
        background: '#455A64',
        color: '#ffffff'
      });
    } catch (error) {
      console.error('Error saving product:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al guardar el producto.',
        icon: 'error',
        confirmButtonColor: '#00E5FF',
        background: '#455A64',
        color: '#ffffff'
      });
    }
  }
});

const deleteProduct = async (id: number) => {
  const result = await Swal.fire({
    title: t('confirm_delete_product'),
    text: "¡No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#00E5FF',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, borrar',
    cancelButtonText: 'Cancelar',
    background: '#455A64', // Darker gray (Secondary)
    color: '#ffffff'
  });

  if (result.isConfirmed) {
    await productStore.deleteProduct(id);
    Swal.fire({
      title: '¡Borrado!',
      text: 'El producto ha sido eliminado.',
      icon: 'success',
      confirmButtonColor: '#00E5FF',
      background: '#455A64', // Darker gray
      color: '#ffffff'
    });
  }
};
</script>
