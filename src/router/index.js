import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import RegisterBookView from '../views/RegisterBookView.vue'

// Importe as novas views
import SearchBookView from '../views/SearchBookView.vue'
import RegisterLoanView from '../views/RegisterLoanView.vue'
import RegisterReturnView from '../views/RegisterReturnView.vue'
import HistoryView from '../views/HistoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/registrar-livro', name: 'register-book', component: RegisterBookView, meta: { requiresAuth: true } },
    
    // Adicione as rotas para as novas views
    { path: '/pesquisar-livro', name: 'search-book', component: SearchBookView, meta: { requiresAuth: true } },
    { path: '/registrar-emprestimo/:id', name: 'register-loan', component: () => import('../views/RegisterLoanView.vue'), meta: { requiresAuth: true } },
    { path: '/registrar-devolucao', name: 'register-return', component: RegisterReturnView, meta: { requiresAuth: true } },
    { path: '/historico', name: 'history', component: HistoryView, meta: { requiresAuth: true } }
  ]
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
})

export default router