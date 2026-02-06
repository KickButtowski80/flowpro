import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  // ✅ CSS imports - correct path
  css: ['~/assets/css/style.css'],

  // ✅ Development tools
  devtools: { enabled: true },

  // ✅ Modules
  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/hints',
    '@nuxt/eslint'
  ],

  // ✅ @nuxt/ui configuration
  ui: {
    fonts: true
  },

  // ✅ Vite configuration for development
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 100
      }
    }
  }
})