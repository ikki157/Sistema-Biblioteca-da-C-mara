<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
      <h2 class="h4 mb-0">Histórico de Movimentações</h2>
      <RouterLink to="/" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-1"></i> Voltar ao Home
      </RouterLink>
    </div>
    <div class="card-body">
      <p class="text-center text-muted">Nenhuma movimentação registrada ainda.</p>
      </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>