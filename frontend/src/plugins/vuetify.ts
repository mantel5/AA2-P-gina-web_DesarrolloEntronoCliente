import '@mdi/font/css/materialdesignicons.css'
// @ts-ignore
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'sneakerLight',
    themes: {
      sneakerLight: {
        dark: false,
        colors: {
          background: '#CFD8DC',
          surface: '#FFFFFF',
          primary: '#00E5FF',
          secondary: '#455A64',
          error: '#D50000',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
      sneakerDark: {
        dark: true,
        colors: {
          background: '#000000',
          surface: '#121212',
          primary: '#00E5FF',
          secondary: '#B0BEC5',
        },
      },
    },
  },
})
