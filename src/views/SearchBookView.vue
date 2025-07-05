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
            <tr v-if="!filteredBooks.length">
              <td colspan="6" class="text-center text-muted py-4">Nenhum livro encontrado.</td>
            </tr>
            <tr v-for="book in filteredBooks" :key="book.id">
              <td>{{ book.code }}</td>
              <td>{{ book.title }}</td>
              <td>{{ book.author }}</td>
              <td>{{ book.genre }}</td>
              <td>{{ book.available }} / {{ book.quantity }}</td>
              <td class="text-center">
               <button @click="goToLoanPage(book.id)" class="btn btn-primary btn-sm me-2">Emprestar</button>
              
               <div v-if="getActiveLoansForBook(book.id).length > 0">
                 <ul class="list-group list-group-flush mt-2">
                   <li
                     v-for="loan in getActiveLoansForBook(book.id)"
                     :key="loan.loanId"
                     class="list-group-item d-flex justify-content-between align-items-center p-1"
                   >
                        <span>Emprestado para: {{ loan.user.name }}</span>
                        <button @click="goToReturnPage(loan.loanId)" class="btn btn-success btn-sm">
                          Devolver
                        </button>
                      </li>
                    </ul>
                  </div>

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
  return bookStore.books.filter(book => 
    book.title.toLowerCase().includes(lowerCaseQuery) ||
    book.author.toLowerCase().includes(lowerCaseQuery) ||
    book.code.toLowerCase().includes(lowerCaseQuery) ||
    book.genre.toLowerCase().includes(lowerCaseQuery)
  );
});

const goToLoanPage = (bookId) => {
  console.log('Função goToLoanPage chamada com o ID do livro:', bookId);
  router.push({ name: 'register-loan', params: { id: bookId } });
};

const goToReturnPage = (bookId) => {
  console.log('Tentando ir para a página de devolução com o ID de empréstimo:', loanId);
  const activeLoan = loanStore.history.find(e => e.book.id === bookId && !loanStore.history.some(r => r.loanId === e.loanId && r.type === 'Devolução'));
  if (activeLoan) {
    router.push({ name: 'register-return', params: { loanId: activeLoan.loanId } });
  } else {
    alert('Não foi encontrado um empréstimo ativo para este livro.');
  }
};

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

const getActiveLoans = (bookId) => {
  const returnedLoanIds = new Set(loanStore.history
    .filter(event => event.type === 'Devolução')
    .map(event => event.loanId));

  return loanStore.history.filter(event => event.type === 'Empréstimo' && event.book.id === bookId && !returnedLoanIds.has(event.loanId));
};
</script>

<style scoped>
  .table {
    vertical-align: middle;
  }
</style>