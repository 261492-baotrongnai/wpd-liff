/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly VITE_API_URL: string
  readonly VITE_LIFF_ID: string
  readonly VITE_LIFF_ID_2: string
  readonly VITE_LIFF_ID_ACHIEVEMENT: string
  readonly VITE_SECRET: string
  // Add other environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
