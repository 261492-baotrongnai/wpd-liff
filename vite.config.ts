import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueRouter from 'unplugin-vue-router/vite'
import ui from '@nuxt/ui/vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue(),
      vueDevTools(),
      VueRouter({}),
      ui({
        ui: {
          separator: {
            compoundVariants: [
              {
                orientation: 'horizontal',
                size: 'xs',
                class: {
                  border: 'border-t-[0.1px]',
                },
              },
              {
                orientation: 'horizontal',
                size: 'sm',
                class: {
                  border: 'border-t-[2px]',
                },
              },
              {
                orientation: 'horizontal',
                size: 'md',
                class: {
                  border: 'border-t-[3px]',
                },
              },
              {
                orientation: 'horizontal',
                size: 'lg',
                class: {
                  border: 'border-t-[4px]',
                },
              },
              {
                orientation: 'horizontal',
                size: 'xl',
                class: {
                  border: 'border-t-[5px]',
                },
              },
              {
                orientation: 'vertical',
                size: 'xs',
                class: {
                  border: 'border-s',
                },
              },
              {
                orientation: 'vertical',
                size: 'sm',
                class: {
                  border: 'border-s-[2px]',
                },
              },
              {
                orientation: 'vertical',
                size: 'md',
                class: {
                  border: 'border-s-[3px]',
                },
              },
              {
                orientation: 'vertical',
                size: 'lg',
                class: {
                  border: 'border-s-[4px]',
                },
              },
              {
                orientation: 'vertical',
                size: 'xl',
                class: {
                  border: 'border-s-[5px]',
                },
              },
            ],
            defaultVariants: {
              color: 'neutral',
              size: 'xs',
              type: 'solid',
            },
          },
        },
      }),
      tailwindcss(),
    ],
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://localhost:8000/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      logLevel: 'debug',
      allowedHosts: ['29b2-171-97-207-62.ngrok-free.app'],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // define: {
    //   'process.env': env,
    // },
  }
})
