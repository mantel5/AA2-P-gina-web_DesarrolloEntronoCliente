<template>
  <v-card class="elevation-12">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>Login</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form @submit.prevent="handleLogin">
        <v-text-field
          v-model="username"
          label="Usuario"
          name="username"
          prepend-icon="mdi-account"
          type="text"
          :error-messages="errors.username"
        ></v-text-field>
        <v-text-field
          v-model="password"
          id="password"
          label="Contraseña"
          name="password"
          prepend-icon="mdi-lock"
          type="password"
          :error-messages="errors.password"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="handleLogin" :loading="loading">Entrar</v-btn>
    </v-card-actions>
    <v-alert v-if="apiError" type="error" class="mt-3">{{ apiError }}</v-alert>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

// Validation Schema
const schema = yup.object({
  username: yup.string().required('El usuario es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria')
});

const { handleSubmit, errors } = useForm({
  validationSchema: schema
});

const { value: username } = useField('username');
const { value: password } = useField('password');

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const apiError = ref('');

const handleLogin = handleSubmit(async (values) => {
  loading.value = true;
  apiError.value = '';
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    authStore.login(data.user, data.token);
    router.push('/');
  } catch (err: any) {
    apiError.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>
