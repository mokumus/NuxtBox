// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // GitHub Pages configuration
  ssr: false, // Disable SSR for static site generation
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/NuxtBox/' : '/', // Change 'NuxtBox' to your repo name
    buildAssetsDir: '_nuxt/'
  },
  
  // Static site generation
  nitro: {
    prerender: {
      routes: ['/']
    }
  }
})
