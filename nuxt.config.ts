import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@pinia/nuxt', '@nuxt/eslint'],
  css: ['~/assets/styles/main.scss', '~/assets/styles/normalize.scss'],

  vite: {
    server: {
      allowedHosts: ['dev.naimy.by'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          // переменные и миксины автоматически доступны во всех .vue файлах
          additionalData: `@use "~/assets/styles/_variables.scss" as *;`,
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      apiBase: 'https://api.naimy.by',
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  devServer: {
    url: 'https://dev.naimy.by',
  },

  devtools: { enabled: true },

  imports: {
    autoImport: false,
  },

  alias: {
    '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
  },
});
