<template>
  <v-card class="elevation-12">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>Login</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form @submit.prevent="handleLogin">
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
      </v-form>
    </v-card-text>
    <v-card-actions class="d-flex flex-column">
      <v-btn type="submit" color="primary" block :loading="loading" @click="handleLogin">{{ $t('login') }}</v-btn>
      <v-btn variant="text" color="secondary" class="mt-2" to="/auth/register">
        ¿No tienes cuenta? Regístrate aquí
      </v-btn>
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
  console.log('Submitting login form...', values);
  try {
    await authStore.login(values);
    console.log('Login successful, redirecting to home...');
    router.push('/');
  } catch (err: any) {
    console.error('Login failed in view:', err);
    apiError.value = err.message || 'Error al iniciar sesión. Revisa la consola.';
  } finally {
    loading.value = false;
  }
});
</script>
