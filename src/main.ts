/**
 * Entry point of the Vue.js application.
 *
 * This file imports the necessary dependencies, including global styles,
 * the Vue application instance, the main application component, and the router.
 * It then creates and mounts the Vue application to the DOM element with the ID `#app`.
 *
 * Dependencies:
 * - `./assets/main.css`: Global CSS styles for the application.
 * - `vue`: Vue.js framework for building user interfaces.
 * - `./App.vue`: The root component of the application.
 * - `./router`: The router instance for managing application routes.
 *
 * Steps:
 * 1. Import global styles and required modules.
 * 2. Create the Vue application instance using `createApp`.
 * 3. Use the router instance with the application.
 * 4. Mount the application to the DOM element with the ID `#app`.
 */
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ui from '@nuxt/ui/vue-plugin'

createApp(App).use(router).use(ui).mount('#app')
