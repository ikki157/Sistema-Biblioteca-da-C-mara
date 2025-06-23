// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth' // Importe o store

// Importe suas views
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import RegisterBookView from '../views/RegisterBookView.vue'
// ... importe outras views conforme as cria

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/registrar-livro', name: 'register-book', component: RegisterBookView, meta: { requiresAuth: true } },
    // ... defina outras rotas aqui, sempre com 'meta: { requiresAuth: true }'
  ]
})

// "Guarda de Navegação": Roda antes de cada mudança de rota
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // Se a rota exige autenticação e o usuário NÃO está logado
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login' }) // Redireciona para a página de login
  } else {
    next() // Permite a navegação
  }
})

export default router