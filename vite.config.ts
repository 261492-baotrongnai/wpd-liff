import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueRouter from 'unplugin-vue-router/vite'
import ui from '@nuxt/ui/vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({}) => {
  return {
    plugins: [
      vue(),
      vueDevTools(),
      VueRouter({}),
      ui({
        colorMode: false,
        ui: {
          colors: {},
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
            color: {
              neutral: 'black',
            },
          },
        },
        theme: {
          colors: ['neutral', 'primary', 'secondary', 'info', 'success', 'warning', 'error'],
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
      allowedHosts: true,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
