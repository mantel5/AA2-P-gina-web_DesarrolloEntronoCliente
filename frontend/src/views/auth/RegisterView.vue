<template>
  <v-card class="elevation-12">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>Registro</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form @submit.prevent="handleRegister">
        <v-text-field
          v-model="username"
          :label="$t('username')"
          name="username"
          prepend-icon="mdi-account"
          type="text"
          :error-messages="errors.username"
        ></v-text-field>
        <v-text-field
          v-model="password"
          id="password"
          :label="$t('password')"
          name="password"
          prepend-icon="mdi-lock"
          type="password"
          :error-messages="errors.password"
        ></v-text-field>
        <v-text-field
          v-model="confirmPassword"
          id="confirmPassword"
          :label="$t('confirm_password')"
          name="confirmPassword"
          prepend-icon="mdi-lock-check"
          type="password"
          :error-messages="errors.confirmPassword"
        ></v-text-field>
        <v-btn type="submit" color="primary" block class="mt-4" :loading="loading">{{ $t('register') }}</v-btn>
      </v-form>
    </v-card-text>
    <v-card-actions>
       <!-- Button moved safely inside form -->
    </v-card-actions>
    <v-alert v-if="apiError" type="error" class="mt-3">{{ apiError }}</v-alert>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

// ... (other imports)

// Validation Schema
const schema = yup.object({
  username: yup.string().required('El usuario es obligatorio').min(3, 'Mínimo 3 caracteres'),
  password: yup.string().required('La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña')
});

const { handleSubmit, errors } = useForm({
  validationSchema: schema
});

const { value: username } = useField('username');
const { value: password } = useField('password');
const { value: confirmPassword } = useField('confirmPassword');

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const apiError = ref('');

const handleRegister = handleSubmit(async (values) => {
  loading.value = true;
  apiError.value = '';
  try {
    await authStore.register({ username: values.username, password: values.password });
    router.push('/auth/login');
  } catch (err: any) {
    apiError.value = err.message || 'Error al registrarse';
  } finally {
    loading.value = false;
  }
});
</script>
