<template>
  <div>
    <h1 class="h2 mb-4">Dashboard</h1>
    <div class="row g-4">
      
      <div class="col-md-6 col-lg-3">
        <div class="card text-white bg-primary shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title">Total de Exemplares</h5>
                <p class="card-text fs-2 fw-bold">{{ bookStore.totalBookCopies || 0 }}</p>
              </div>
              <i class="bi bi-collection fs-1 opacity-50"></i>
            </div>
          </div>
          <RouterLink to="/pesquisar-livro" class="card-footer-link">
            Ver acervo <i class="bi bi-arrow-right-circle"></i>
          </RouterLink>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="card text-white bg-secondary shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title">Total de Usuários</h5>
                <p class="card-text fs-2 fw-bold">{{ userStore.totalUsers || 0 }}</p>
              </div>
              <i class="bi bi-collection fs-1 opacity-50"></i>
            </div>
          </div>
          <RouterLink to="/gerenciar-usuario" class="card-footer-link">
            Ver Usuários <i class="bi bi-arrow-right-circle"></i>
          </RouterLink>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="card text-white bg-warning shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title">Emprestados Agora</h5>
                <p class="card-text fs-2 fw-bold">{{ loanStore.currentlyLoanedCount || 0 }}</p>
              </div>
              <i class="bi bi-box-arrow-up-right fs-1 opacity-50"></i>
            </div>
          </div>
          <RouterLink to="/historico" class="card-footer-link">
            Ver detalhes <i class="bi bi-arrow-right-circle"></i>
          </RouterLink>
        </div>
      </div>
      
      <div class="col-md-6 col-lg-3">
        <div class="card text-white bg-success shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title">Total de Empréstimos</h5>
                <p class="card-text fs-2 fw-bold">{{ loanStore.totalLoans || 0 }}</p>
              </div>
              <i class="bi bi-graph-up-arrow fs-1 opacity-50"></i>
            </div>
          </div>
          <RouterLink to="/historico" class="card-footer-link">
            Ver histórico <i class="bi bi-arrow-right-circle"></i>
          </RouterLink>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="card text-white bg-info shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title">Devoluções Totais</h5>
                <p class="card-text fs-2 fw-bold">{{ loanStore.totalReturns || 0 }}</p> 
              </div>
              <i class="bi bi-journal-check fs-1 opacity-50"></i>
            </div>
          </div>
          <RouterLink to="/historico" class="card-footer-link">
            Ver histórico <i class="bi bi-arrow-right-circle"></i>
          </RouterLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useBookStore } from '@/store/bookStore';
import { useLoanStore } from '@/store/loanStore';
import { useUserStore } from '@/store/userStore';

const bookStore = useBookStore();
const loanStore = useLoanStore();
const userStore = useUserStore();
</script>

<style scoped>
.card-footer-link {
  display: block;
  padding: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  background-color: rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
}
.card-footer-link:hover {
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
}
</style>