// @ts-ignore prevents the editor from reporting the "no exported member" error.
// The code will run because the compiler knows how to resolve it at build time.
// @ts-ignore

import { defineNuxtConfig } from 'nuxt/config'           
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~~/assets/css/style.css'],
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/hints',
    '@nuxt/eslint'
  ]
})