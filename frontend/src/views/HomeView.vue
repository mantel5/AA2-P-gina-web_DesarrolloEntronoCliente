<script setup lang="ts">
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
</script>
<template>
  <v-container class="fill-height d-flex flex-column justify-center align-center">
    <h1 class="text-h2 mb-4 text-primary">SneakerDrop</h1>
    <p class="text-h5 mb-8 text-medium-emphasis">{{ $t('home_subtitle') }}</p>
    
    <!-- User Logged In -->
    <div v-if="authStore.user" class="text-center">
      <h2 class="text-h5 mb-6">Hola, {{ authStore.user.username }}</h2>
      <div class="d-flex gap-4 justify-center">
        <v-btn
          color="primary"
          size="x-large"
          variant="flat"
          to="/admin/dashboard"
          class="mr-4"
          prepend-icon="mdi-view-dashboard"
        >
          {{ $t('dashboard') }}
        </v-btn>
        
        <v-btn
          color="error"
          size="x-large"
          variant="tonal"
          @click="authStore.logout"
          prepend-icon="mdi-logout"
        >
          {{ $t('logout') }}
        </v-btn>
      </div>
    </div>

    <!-- User NOT Logged In -->
    <div v-else class="d-flex gap-4">
      <v-btn
        color="primary"
        size="x-large"
        variant="flat"
        to="/auth/login"
        class="mr-4"
        prepend-icon="mdi-login"
      >
        {{ $t('login') }}
      </v-btn>
      
      <v-btn
        color="secondary"
        size="x-large"
        variant="tonal"
        to="/auth/register"
        prepend-icon="mdi-account-plus"
      >
        {{ $t('register') }}
      </v-btn>
    </div>
  </v-container>
</template>
