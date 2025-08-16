// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistentedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistentedstate)
app.use(pinia)
app.use(router)
app.use(Toast)
app.mount('#app')


import 'bootstrap/dist/js/bootstrap.bundle.min.js'