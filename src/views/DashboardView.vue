<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2">Dashboard</h1>
    </div>
    
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <p>Buscando dados...</p>
    </div>
    
    <div v-else class="row g-4">
      <div class="col-md-6 col-lg-3">
        <div class="card text-white bg-primary shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">Total de Livros</h5>
            <p class="card-text fs-2 fw-bold">{{ stats.totalBooks }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="card text-white bg-warning shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">Livros Emprestados</h5>
            <p class="card-text fs-2 fw-bold">{{ stats.loanedBooks }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api.js';

const loading = ref(true);
const stats = ref({
  totalBooks: 0,
  loanedBooks: 0,
  totalLoans: 0,
  returnsToday: 0
});

// onMounted é um "gancho" do Vue que roda assim que o componente é criado
onMounted(async () => {
  try {
    const response = await api.getDashboardStats();
    stats.value = response.data;
  } catch (error) {
    console.error("Falha ao buscar estatísticas do dashboard:", error);
    // Você pode adicionar uma mensagem de erro na tela aqui
  } finally {
    loading.value = false;
  }
});
</script>