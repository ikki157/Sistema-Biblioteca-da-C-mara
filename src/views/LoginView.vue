<template>
  <div class="row justify-content-center align-items-center" style="min-height: 80vh;">
    <div class="col-md-6 col-lg-4">
      <div class="card shadow-sm border-0">
        <div class="card-body p-4">
          <div class="text-center mb-4">
            <h1 class="h3 mb-3 fw-normal">Sistema da Biblioteca</h1>
            <p class="text-muted">Por favor, faça o login para continuar</p>
          </div>
          <form @submit.prevent="handleLogin">
            <div class="form-floating mb-3">
              <input 
                type="text" 
                class="form-control" 
                id="username" 
                placeholder="Usuário" 
                v-model="username"
                required
              >
              <label for="username">Nome de usuário</label>
            </div>
            <div class="form-floating mb-3">
              <input 
                type="password" 
                class="form-control" 
                id="password" 
                placeholder="Senha"
                v-model="password"
                required
              >
              <label for="password">Senha</label>
            </div>
            
            <div v-if="loginError" class="alert alert-danger py-2" role="alert">
              Usuário ou senha inválidos. Tente novamente.
            </div>

            <button class="w-100 btn btn-lg btn-primary" type="submit">
              <i class="bi bi-box-arrow-in-right me-2"></i>Entrar
            </button>
          </form>
          <p class="mt-4 mb-1 text-muted text-center">&copy; {{ new Date().getFullYear() }} Câmara Municipal</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router'; // IMPORTAMOS o useRouter aqui no componente

const auth = useAuthStore();
const router = useRouter(); // INICIAMOS o router aqui

const username = ref('bibliotecario');
const password = ref('senha123');
const loginError = ref(false);

const handleLogin = () => {
  loginError.value = false;
  
  // Chama a ação de login do store
  const success = auth.login(username.value, password.value);
  
  // Se o login for bem-sucedido (retornar true)
  if (success) {
    // O COMPONENTE agora é responsável por redirecionar
    router.push('/');
  } else {
    // Se não, exibe a mensagem de erro
    loginError.value = true;
  }
};
</script>