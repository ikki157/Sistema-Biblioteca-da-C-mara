// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Importe o CSS do Bootstrap e dos Ícones para uso global
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

// Importe o JavaScript do Bootstrap no final.
// Ele é necessário para componentes interativos como o menu responsivo e modais.
import 'bootstrap/dist/js/bootstrap.bundle.min.js'