// Styles
import '@mdi/font/css/materialdesignicons.css'
// @ts-ignore
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'sneakerLight',
    themes: {
      sneakerLight: {
        dark: false,
        colors: {
          background: '#CFD8DC', // Gris Azulado Medio (Blue Grey Lighten-4)
          surface: '#FFFFFF',
          primary: '#00E5FF', // Turquesa Neón
          secondary: '#455A64', // Gris intermedio para contraste
          error: '#D50000',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
      sneakerDark: {
        dark: true,
        colors: {
          background: '#000000', // Negro Puro
          surface: '#121212', // Gris muy oscuro para tarjetas
          primary: '#00E5FF', // Turquesa Neón
          secondary: '#B0BEC5',
        },
      },
    },
  },
})
