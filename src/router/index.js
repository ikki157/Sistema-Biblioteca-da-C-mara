import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import RegisterBookView from '../views/RegisterBookView.vue'

import SearchBookView from '../views/SearchBookView.vue'
import RegisterLoanView from '../views/RegisterLoanView.vue'
import RegisterReturnView from '../views/RegisterReturnView.vue'
import HistoryView from '../views/HistoryView.vue'
import UserManagementView from '@/views/UserManagementView.vue'
import RegisterUserView from '@/views/RegisterUserView.vue'
import EditUserView from '@/views/EditUserView.vue'
import EditBookView from '@/views/EditBookView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/registrar-livro', name: 'register-book', component: RegisterBookView, meta: { requiresAuth: true } },
    { path: '/registrar-usuario', name: 'register-user', component: RegisterUserView, meta: { requiresAuth: true } },
    { path: '/pesquisar-livro', name: 'search-book', component: SearchBookView, meta: { requiresAuth: true } },
    { path: '/registrar-emprestimo/:id', name: 'register-loan', component: () => import('../views/RegisterLoanView.vue'), meta: { requiresAuth: true } },
    { path: '/registrar-devolucao/:loanId', name: 'register-return', component: () => import('../views/RegisterReturnView.vue'), meta: { requiresAuth: true } },
    { path: '/historico', name: 'history', component: HistoryView, meta: { requiresAuth: true } },
    { path: '/gerenciar-usuario', name: 'user-management', component: UserManagementView, meta: { requiresAuth: true } },
    { path: '/editar-usuario/:id', name: 'edit-user', component: EditUserView, meta: { requiresAuth: true } },
    { path: '/editar-livro/:id', name: 'edit-book', component: EditBookView, meta: { requiresAuth: true } },
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