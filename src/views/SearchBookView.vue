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

      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-light">
            <tr>
              <th>Código</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Gênero</th>
              <th>Disponíveis</th>
              <th class="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredBooks.length === 0">
              <td colspan="6" class="text-center text-muted py-4">Nenhum livro encontrado.</td>
            </tr>
            <tr v-for="book in filteredBooks" :key="book.id">
              <td>{{ book.code }}</td>
              <td>{{ book.title }}</td>
              <td>{{ book.author }}</td>
              <td>{{ book.genre }}</td>
              <td>{{ book.available }} / {{ book.quantity }}</td>
              <td class="text-center">
                <button 
                  @click="goToLoanPage(book.id)" 
                  class="btn btn-sm btn-primary me-2" 
                  :disabled="book.available === 0" 
                  title="Emprestar Livro">
                  <i class="bi bi-box-arrow-up-right"></i> Emprestar
                </button>
                
                <button 
                  v-if="book.loanedOut > 0" 
                  @click="goToReturnPage(book.id)" 
                  class="btn btn-sm btn-success me-2" 
                  title="Devolver Livro">
                  <i class="bi bi-box-arrow-down-left"></i> Devolver
                </button>

                <button 
                  @click="promptForDelete(book.id)" 
                  class="btn btn-sm btn-outline-danger" 
                  :disabled="book.loanedOut > 0"
                  :title="book.loanedOut > 0 ? 'Livro com cópias emprestadas não pode ser excluído' : 'Excluir Livro'">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <PasswordModal v-model="showPasswordModal" @success="handleActualDeletion" />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useBookStore } from '@/store/bookStore';
import { useLoanStore } from '@/store/loanStore';
import PasswordModal from '@/components/PasswordModal.vue';

const bookStore = useBookStore();
const loanStore = useLoanStore();
const router = useRouter();

const searchQuery = ref('');
const showPasswordModal = ref(false);
const bookToDeleteId = ref(null);

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

const goToLoanPage = (bookId) => {
  router.push(`/registrar-emprestimo/${bookId}`);
};

const goToReturnPage = (bookId) => {
  const activeLoan = loanStore.history.find(e => e.book.id === bookId && !loanStore.history.some(r => r.loanId === e.loanId && r.type === 'Devolução'));
  if (activeLoan) {
    router.push(`/registrar-devolucao/${activeLoan.loanId}`);
  } else {
    alert('Não foi encontrado um empréstimo ativo para este livro.');
  }
};

// FUNÇÃO DE EXCLUSÃO MODIFICADA
const promptForDelete = (bookId) => {
  // Busca o livro no nosso "banco de dados"
  const book = bookStore.getBookById(bookId);

  // Verificação de segurança: se o livro tiver cópias emprestadas, exibe um alerta e para a execução.
  if (book && book.loanedOut > 0) {
    alert('Ação não permitida: Este livro possui cópias emprestadas e não pode ser excluído.');
    return; 
  }

  // Se a verificação passar, continua o fluxo normal para abrir o modal de senha.
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

<style scoped>
  .table {
    vertical-align: middle;
  }
</style>