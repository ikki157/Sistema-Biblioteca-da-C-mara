<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2">Dashboard</h1>
      <span class="text-muted">Bem-vindo(a), Bibliotecário(a)!</span>
    </div>

    <div class="row g-4">
      
      <div class="col-md-6 col-lg-3">
        <div class="card text-white bg-primary shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title">Total de Livros</h5>
                <p class="card-text fs-2 fw-bold">1.250</p>
              </div>
              <i class="bi bi-book-half fs-1 opacity-50"></i>
            </div>
          </div>
          <RouterLink to="/pesquisar-livro" class="card-footer text-white text-decoration-none">
            Ver detalhes <i class="bi bi-arrow-right-circle"></i>
          </RouterLink>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="card text-white bg-warning shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title">Livros Emprestados</h5>
                <p class="card-text fs-2 fw-bold">78</p>
              </div>
              <i class="bi bi-arrow-up-right-square fs-1 opacity-50"></i>
            </div>
          </div>
          <RouterLink to="/historico?status=emprestado" class="card-footer text-white text-decoration-none">
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
                <p class="card-text fs-2 fw-bold">4.321</p>
              </div>
              <i class="bi bi-graph-up-arrow fs-1 opacity-50"></i>
            </div>
          </div>
          <RouterLink to="/historico" class="card-footer text-white text-decoration-none">
            Ver relatórios <i class="bi bi-arrow-right-circle"></i>
          </RouterLink>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="card text-white bg-info shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title">Devoluções Hoje</h5>
                <p class="card-text fs-2 fw-bold">12</p>
              </div>
              <i class="bi bi-calendar-check fs-1 opacity-50"></i>
            </div>
          </div>
           <RouterLink to="/historico?filtro=hoje" class="card-footer text-white text-decoration-none">
            Ver detalhes <i class="bi bi-arrow-right-circle"></i>
          </RouterLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
// Os dados dos cards são estáticos por enquanto. Em um projeto real,
// eles viriam de uma chamada de API, provavelmente no hook onMounted.
</script>

<style scoped>
.card-footer {
  transition: background-color 0.2s;
}
.card-footer:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>