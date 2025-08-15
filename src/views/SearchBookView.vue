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
              <th class="img-book">Foto</th>
              <th>Título</th>
              <th class="text-center">Disponíveis</th>
              <th class="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!filteredBooks.length">
              <td colspan="4" class="text-center text-muted py-4">Nenhum livro encontrado.</td>
            </tr>
            <tr v-for="book in filteredBooks" :key="book.id">
              <td>
                <img :src="book.bookImage" v-if="book.bookImage" alt="Capa do livro" class="img-fluid rounded img-book">
                <div v-else class="text-muted text-center">
                  <i class="bi bi-image-alt fs-4"></i>
                </div>
              </td>
              <td>{{ book.title }}</td>
              <td class="text-center">{{ book.available }} / {{ book.quantity }}</td>
              <td class="text-center align-middle">
                  <button @click="$router.push({ name: 'edit-book', params: { id: book.id } })" class="btn btn-primary btn-sm me-2">
                    Editar
                  </button>
                  <button @click="promptForDelete(book.id)" class="btn btn-danger btn-sm me-2" :disabled="book.loanedOut > 0">
                    Excluir
                  </button>

                <div v-if="getActiveLoansForBook(book.id).length > 0" class="mt-2 border-top pt-2">
                  <small class="d-block mb-1 fw-bold">Empréstimos Ativos:</small>
                  
                  <div 
                    v-for="loan in getActiveLoansForBook(book.id)" 
                    :key="loan.loanId" 
                    class="d-flex justify-content-around align-items-center mb-1"
                  >
                    <span>Com: {{ loan.user.name }}</span><br />
                    <small class="text-muted">Até: {{ loan.dueDate }}</small>
                  </div>
                </div>
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
import PasswordModal from '@/components/PasswordModal.vue'; // Importa o componente do modal

const bookStore = useBookStore();
const loanStore = useLoanStore();
const router = useRouter();

const searchQuery = ref('');
const showPasswordModal = ref(false);
const bookToDeleteId = ref(null);

const filteredBooks = computed(() => {
  if (!searchQuery.value) return bookStore.books;
  
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return bookStore.books.filter(book => {

  return Object.keys(book).some(key => {
      const value = book[key];
      if (value !== null && value !== undefined) {
        return String(value).toLowerCase().includes(lowerCaseQuery);
      }
      return false;
    });
  });
});

const promptForDelete = (bookId) => {
  const book = bookStore.getBookById(bookId);

  if (book && book.loanedOut > 0) {
    alert('Ação não permitida: Este livro possui cópias emprestadas e não pode ser excluído.');
    return; 
  }

  bookToDeleteId.value = bookId;
  showPasswordModal.value = true;
};

const handleActualDeletion = () => {
  console.log('3. Sinal "success" recebido! A página vai executar a exclusão.');
  
  if (bookToDeleteId.value) {
    bookStore.deleteBook(bookToDeleteId.value);
    bookToDeleteId.value = null;
  }
};

const getActiveLoansForBook = (bookId) => {
  const returnedLoanIds = new Set(loanStore.history
    .filter(event => event.type === 'Devolução')
    .map(event => event.loanId));

  return loanStore.history.filter(event => event.type === 'Empréstimo' && event.book.id === bookId && !returnedLoanIds.has(event.loanId));
};

</script>

<style scoped>
  .table { vertical-align: middle; }

  .img-book { width: 100px; height: auto; object-fit: cover; }
</style>