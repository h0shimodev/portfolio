// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // 環境変数 NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY が自動で入ります
  runtimeConfig: {
    public: {
      web3formsAccessKey: '',
    },
  },

  // 任意: 全ページを事前生成して静的ファイルとして配信
  // (フォームはブラウザから直接送信するので、サーバー処理は不要です)
  routeRules: {
    '/**': { prerender: true },
  },

  nitro: {
    preset: 'cloudflare_module',

    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },

  modules: ['nitro-cloudflare-dev', '@nuxt/eslint'],
})
