<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
      <h2 class="h4 mb-0">Pesquisar Acervo</h2>
      <RouterLink to="/" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-1"></i> Voltar ao Home
      </RouterLink>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Digite para pesquisar por título, autor ou código...">
      </div>

      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Código</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Gênero</th>
            <th>Disponíveis</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredBooks.length === 0">
            <td colspan="5" class="text-center text-muted">Nenhum livro encontrado.</td>
          </tr>
          <tr v-for="book in filteredBooks" :key="book.id">
            <td>{{ book.code }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book.genre }}</td>
            <td>{{ book.available }} / {{ book.quantity }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-2">Emprestar</button>
              <button class="btn btn-sm btn-outline-danger">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useBookStore } from '@/store/bookStore';

const bookStore = useBookStore();
const searchQuery = ref('');

// Computed property que filtra os livros em tempo real
const filteredBooks = computed(() => {
  if (!searchQuery.value) {
    return bookStore.books;
  }
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return bookStore.books.filter(book => 
    book.title.toLowerCase().includes(lowerCaseQuery) ||
    book.author.toLowerCase().includes(lowerCaseQuery) ||
    book.code.toLowerCase().includes(lowerCaseQuery) ||
    book.genre.toLowerCase().includes(lowerCaseQuery)
  );
});
</script>

<style scoped>
  .table {
    vertical-align: middle;
  }
</style>