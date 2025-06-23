<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container-fluid">
        <RouterLink to="/" class="navbar-brand d-flex align-items-center">
          <img src="@/assets/logo-camara.svg" alt="Logo Câmara" width="30" height="24" class="d-inline-block align-text-top me-2">
          Sistema da Biblioteca
        </RouterLink>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink to="/registrar-livro" class="nav-link">Registrar Livro</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/pesquisar-livro" class="nav-link">Pesquisar/Excluir</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/registrar-emprestimo" class="nav-link">Empréstimo</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/registrar-devolucao" class="nav-link">Devolução</RouterLink>
            </li>
             <li class="nav-item">
              <RouterLink to="/historico" class="nav-link">Histórico</RouterLink>
            </li>
          </ul>
          <button @click="auth.logout()" class="btn btn-outline-danger">
            <i class="bi bi-box-arrow-right me-1"></i> Sair
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/store/auth';
const auth = useAuthStore();
</script>

<style scoped>
.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  color: #0d6efd !important; /* Cor primária do Bootstrap */
  font-weight: 500;
}
</style>