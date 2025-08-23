import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  
  
  const user = ref(null);
  const isAuthenticated = computed(() => !!user.value);

  function login(username, password) {
    if (username === 'bibliotecario' && password === 'senha123') {
      user.value = { name: 'Bibliotecário Autenticado' };
      
      return true;
    }
    return false;
  }

  function logout() {
    user.value = null;
    
  }
  
  function verifyPassword(password) {
    return password === 'senha123';
  }

  //função de resetar temporario
  function $reset() {
    user.value = null;
  }
  //apagar depois

  return { user, isAuthenticated, login, logout, verifyPassword, $reset }
})