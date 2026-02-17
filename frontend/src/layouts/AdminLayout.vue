<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app color="background">
      <v-list>
        <v-list-item
          :title="authStore.user?.username || 'Admin'"
          :subtitle="$t('administrator')"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav color="primary">
        <v-list-item prepend-icon="mdi-view-dashboard" :title="$t('dashboard')" to="/admin/dashboard"></v-list-item>
        <v-list-item prepend-icon="mdi-shoe-sneaker" :title="$t('products')" to="/admin/products"></v-list-item>
        <v-list-item prepend-icon="mdi-tag-multiple" :title="$t('categories')" to="/admin/categories"></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="error" @click="handleLogout">
            {{ $t('logout') }}
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ $t('admin_title') }}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const drawer = ref(true);
const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
};
</script>

<style scoped>
:deep(.v-list-item--active .v-list-item-title) {
  color: #000000 !important;
  font-weight: bold;
}
</style>
