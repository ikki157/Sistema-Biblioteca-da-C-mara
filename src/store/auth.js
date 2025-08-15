// src/store/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// REMOVEMOS o import do useRouter daqui.

export const useAuthStore = defineStore('auth', () => {
  // REMOVEMOS a chamada const router = useRouter() daqui.
  
  const user = ref(null);
  const isAuthenticated = computed(() => !!user.value);

  // Ação de Login (Modificada)
  function login(username, password) {
    if (username === 'bibliotecario' && password === 'senha123') {
      user.value = { name: 'Bibliotecário Autenticado' };
      // Apenas retorna true. A responsabilidade de redirecionar saiu daqui.
      return true;
    }
    // Se o login falhar, retorna false.
    return false;
  }

  // Ação de Logout (Modificada)
  function logout() {
    user.value = null;
    // O redirecionamento aqui no logout pode ser feito no componente que chama a ação,
    // como o AppHeader.vue, para manter o padrão.
  }
  
  function verifyPassword(password) {
    return password === 'senha123';
  }

  return { user, isAuthenticated, login, logout, verifyPassword }
})