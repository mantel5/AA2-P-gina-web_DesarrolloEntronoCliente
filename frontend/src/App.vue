<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Gestión Comercial</v-toolbar-title>
      <v-spacer></v-spacer>
      
      <!-- Theme Switcher -->
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <!-- Locale Switcher -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props">
            {{ currentLocale.toUpperCase() }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="changeLocale('es')">
            <v-list-item-title>Español</v-list-item-title>
          </v-list-item>
          <v-list-item @click="changeLocale('en')">
            <v-list-item-title>English</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import AppFooter from './components/AppFooter.vue';

const theme = useTheme();
const { locale } = useI18n();

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'sneakerLight' : 'sneakerDark';
};

const currentLocale = computed(() => locale.value);

const changeLocale = (lang: string) => {
  locale.value = lang;
};
</script>

<style>
/* Global override for SweetAlert2 z-index */
.swal2-container {
  z-index: 9999 !important;
}
</style>
