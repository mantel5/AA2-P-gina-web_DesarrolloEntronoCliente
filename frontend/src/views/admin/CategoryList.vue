<template>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-space-between align-center">
        <h1>{{ $t('manage_categories') }}</h1>
        <v-btn color="primary" @click="openDialog()">{{ $t('new_category') }}</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <CategoryTable 
          :categories="categoryStore.categories" 
          @edit="openDialog" 
          @delete="deleteCategory" 
        />
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedId ? $t('edit_category') : $t('new_category') }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <form @submit.prevent="save">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="name"
                    :error-messages="nameError"
                    :label="$t('name')"
                    required
                  ></v-text-field>
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
import { ref, onMounted } from 'vue';
import { useCategoryStore } from '../../stores/category';
import CategoryTable from '../../components/CategoryTable.vue';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2';

const { t } = useI18n();
const categoryStore = useCategoryStore();
const dialog = ref(false);
const editedId = ref<number | null>(null);

// Validation Schema
const schema = yup.object({
  name: yup.string().required(t('validation_name_required')).min(3, t('validation_name_min')),
  description: yup.string().nullable()
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const { value: name, errorMessage: nameError } = useField<string>('name');
const { value: description } = useField<string>('description');

onMounted(() => {
  categoryStore.fetchCategories();
});

const openDialog = (item?: any) => {
  if (item) {
    editedId.value = item.id;
    name.value = item.name;
    description.value = item.description;
  } else {
    editedId.value = null;
    resetForm();
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  resetForm();
};

const save = handleSubmit(async (values) => {
  const isEdit = !!editedId.value;
  const actionText = isEdit ? t('edit_category') : t('new_category');

  const result = await Swal.fire({
    title: `¿${actionText}?`,
    text: "Confirma para guardar los cambios.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#00E5FF',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, guardar',
    cancelButtonText: 'Cancelar',
    background: '#455A64', // Darker gray
    color: '#ffffff'
  });

  if (result.isConfirmed) {
    try {
      if (editedId.value) {
        await categoryStore.updateCategory(editedId.value, values);
      } else {
        await categoryStore.createCategory(values);
      }
      closeDialog();
      Swal.fire({
        title: '¡Guardada!',
        text: 'La colección ha sido guardada correctamente.',
        icon: 'success',
        confirmButtonColor: '#00E5FF',
        background: '#455A64',
        color: '#ffffff'
      });
    } catch (error) {
      console.error('Error saving category:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al guardar la colección.',
        icon: 'error',
        confirmButtonColor: '#00E5FF',
        background: '#455A64',
        color: '#ffffff'
      });
    }
  }
});



// ... existing code ...

const deleteCategory = async (id: number) => {
  const result = await Swal.fire({
    title: t('confirm_delete_category'),
    text: "¡No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#00E5FF',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, borrar',
    cancelButtonText: 'Cancelar',
    background: '#455A64',
    color: '#ffffff'
  });

  if (result.isConfirmed) {
    await categoryStore.deleteCategory(id);
    Swal.fire({
      title: '¡Borrada!',
      text: 'La colección ha sido eliminada.',
      icon: 'success',
      confirmButtonColor: '#00E5FF',
      background: '#455A64',
      color: '#ffffff'
    });
  }
};
</script>
