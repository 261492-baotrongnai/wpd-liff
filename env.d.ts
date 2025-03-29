/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly API_URL: string
  // Add other environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
