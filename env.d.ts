/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

interface ImportMetaEnv {
  BASE_URL: string
  readonly VITE_API_URL: string
  readonly VITE_LIFF_ID: string
  readonly VITE_LIFF_ID_2: string
  readonly VITE_LIFF_ID_ACHIEVEMENT: string
  readonly VITE_LIFF_ID_USER_CLASSIFICATION: string
  readonly VITE_LIFF_IF_PROGRESS: string
  readonly VITE_PRODUCTION: boolean
  // Add other environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
