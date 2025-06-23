<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
      <h2 class="h4 mb-0">Pesquisar Acervo</h2>
      <RouterLink to="/" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i> Voltar</RouterLink>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Pesquisar por título, autor, gênero ou código...">
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
            <td colspan="6" class="text-center text-muted">Nenhum livro encontrado.</td>
          </tr>
          <tr v-for="book in filteredBooks" :key="book.id">
            <td>{{ book.code }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book.genre }}</td>
            <td>{{ book.available }} / {{ book.quantity }}</td>
            <td>
              <button @click="goToLoanPage(book.id)" class="btn btn-sm btn-primary me-2" :disabled="book.available === 0">Emprestar</button>
              <button @click="promptForDelete(book.id)" class="btn btn-sm btn-outline-danger">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <PasswordModal v-model="showPasswordModal" @success="handleActualDeletion" />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBookStore } from '@/store/bookStore';
import PasswordModal from '@/components/PasswordModal.vue';

const bookStore = useBookStore();
const router = useRouter();
const searchQuery = ref('');
const showPasswordModal = ref(false);
const bookToDeleteId = ref(null);

// BUSCA CORRIGIDA: Agora inclui o gênero.
const filteredBooks = computed(() => {
  if (!searchQuery.value) return bookStore.books;
  
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return bookStore.books.filter(book => 
    book.title.toLowerCase().includes(lowerCaseQuery) ||
    book.author.toLowerCase().includes(lowerCaseQuery) ||
    book.code.toLowerCase().includes(lowerCaseQuery) ||
    book.genre.toLowerCase().includes(lowerCaseQuery)
  );
});

// FUNÇÃO DO BOTÃO "EMPRESTAR"
const goToLoanPage = (bookId) => {
  router.push(`/registrar-emprestimo/${bookId}`);
};

// FUNÇÕES DO BOTÃO "EXCLUIR"
const promptForDelete = (bookId) => {
  bookToDeleteId.value = bookId;
  showPasswordModal.value = true;
};

const handleActualDeletion = () => {
  if (bookToDeleteId.value) {
    bookStore.deleteBook(bookToDeleteId.value);
    bookToDeleteId.value = null;
  }
};
</script>