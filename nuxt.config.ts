// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify';
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false, // Enable static site generation
  app: {
    baseURL: '/medshifts/', // GitHub Pages subdirectory
    buildAssetsDir: '/_nuxt/' // Ensure correct asset paths
  },
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  build:{
    transpile: ['vuetify'],
  },
  css: ['~/assets/css/main.scss'],
  modules: [
    '@pinia/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
