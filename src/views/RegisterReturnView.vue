<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
      <h2 class="h4 mb-0">Registrar Devolução</h2>
      <RouterLink to="/" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-1"></i> Voltar ao Home
      </RouterLink>
    </div>
    <div class="card-body">
      <form>
        <div class="mb-3">
          <label for="bookCode" class="form-label">Código do Livro</label>
          <input type="text" class="form-control" id="bookCode" placeholder="Insira o código ou ISBN do livro a ser devolvido">
        </div>
        <button type="submit" class="btn btn-primary">Confirmar Devolução</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>