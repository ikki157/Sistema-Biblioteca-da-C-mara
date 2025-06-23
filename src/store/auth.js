// src/store/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  function login(username, password) {
    // Lógica de login simulada. Em um projeto real, faria uma chamada de API.
    if (username === 'bibliotecario' && password === 'senha123') {
      user.value = { name: 'Bibliotecário Autenticado' }
      router.push('/') // Redireciona para o Dashboard após o login
      return true
    }
    return false
  }

  function logout() {
    user.value = null
    router.push('/login') // Redireciona para a página de login
  }

  function verifyPassword(password) {
    // Lógica simulada para confirmar a senha em ações críticas
    return password === 'senha123'
  }

  return { user, isAuthenticated, login, logout, verifyPassword }
})