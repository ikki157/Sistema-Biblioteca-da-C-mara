<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
      <h2 class="h4 mb-0">Registrar Empréstimo</h2>
      <RouterLink to="/" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-1"></i> Voltar ao Home
      </RouterLink>
    </div>
    <div class="card-body">
      <form>
        <div class="mb-3">
          <label for="bookCode" class="form-label">Código do Livro</label>
          <input type="text" class="form-control" id="bookCode" placeholder="Insira o código ou ISBN do livro">
        </div>
        <div class="mb-3">
          <label for="userName" class="form-label">Nome do Leitor</label>
          <input type="text" class="form-control" id="userName" placeholder="Insira o nome de quem está pegando o livro">
        </div>
        <button type="submit" class="btn btn-primary">Confirmar Empréstimo</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>