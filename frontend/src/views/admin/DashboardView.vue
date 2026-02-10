<template>
  <div>
    <h1>Dashboard</h1>
    <v-row class="mt-4">
      <v-col cols="12" md="4">
        <v-card color="info" dark>
          <v-card-title>Productos</v-card-title>
          <v-card-text class="text-h4">0</v-card-text>
          <v-card-actions>
            <v-btn to="/admin/products" variant="text">Gestionar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card color="success" dark>
          <v-card-title>Categorías</v-card-title>
          <v-card-text class="text-h4">0</v-card-text>
          <v-card-actions>
            <v-btn to="/admin/categories" variant="text">Gestionar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
