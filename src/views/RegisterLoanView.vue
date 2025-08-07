<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
      <h2 class="h4 mb-0">Registrar Empréstimo</h2>
      <RouterLink to="/pesquisar-livro" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i> Voltar</RouterLink>
    </div>
    <div class="card-body p-4">
      <div v-if="selectedUser" class="card mb-4">
        <div class="card-body bg-light">
          <h5 class="card-title">Empréstimo para:</h5>
          <p class="card-text fs-4">{{ selectedUser.name }}</p>
          <p class="card-text text-muted">{{ selectedUser.email }} | Nº de Identificação: {{ selectedUser.numIdent }}</p>
        </div>
      </div>
    

        <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

        <form @submit.prevent="promptForPasswordConfirmation" v-if="!successMessage">

            <div class="mb-3">
              <label for="bookSearch" class="form-label">Pesquisar Livro</label>
              <input 
                type="text" 
                v-model="bookSearchQuery" 
                @input="selectedBook = null" class="form-control" 
                id="bookSearch" 
                placeholder="Digite o título do livro..."
              >
              <ul class="list-group mt-1" v-if="bookSearchQuery && !selectedBook">
                <li 
                  class="list-group-item list-group-item-action" 
                  v-for="book in filteredBooks" 
                  :key="book.id" 
                  @click="selectBook(book)"
                >
                  {{ book.title }} (Autor: {{ book.author }})
                </li>
              </ul>
            </div>


            <div class="mb-3">
              <label for="dueDate" class="form-label">Data de Devolução:</label>
              <input type="date" v-model="dueDate" class="form-control" id="dueDate" required />
            </div>

          <button type="submit" class="btn btn-primary">Confirmar Empréstimo</button>
        </form>
      </div>
    </div>

  <PasswordModal v-model="showPasswordModal" @success="handleLoan" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useBookStore } from '@/store/bookStore';
import { useLoanStore } from '@/store/loanStore';
import { useUserStore } from '@/store/userStore';
import { useToast } from 'vue-toastification';
import PasswordModal from '@/components/PasswordModal.vue';

const route = useRoute();
const bookStore = useBookStore();
const loanStore = useLoanStore();
const userStore = useUserStore();
const toast = useToast();
const router = useRouter();
const searchQuery = ref('');


const book = ref(null);
const selectUserId = ref('');
const selectedUser = ref(null);
const bookSearchQuery = ref('');
const selectedBook = ref(null);
const showPasswordModal = ref(false);
const successMessage = ref('');
const bookId = parseInt(route.params.id);
const dueDate = ref('');
const showUsersList = ref(true);



const promptForPasswordConfirmation = () => {
  showPasswordModal.value = true;
};

const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return [];
  }
  
  return userStore.users.filter(user => {
    return user.name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

function selectUser (user) {
  selectUserId.value = user.id;
  searchQuery.value = user.name; 

  showUsersList.value = false;
}

const filteredBooks = computed(() => {
  if (!bookSearchQuery.value) return [];
  const q = bookSearchQuery.value.toLowerCase();
  return bookStore.books.filter(book => book.available > 0 && book.title.toLowerCase().includes(q));
}); 

function selectBook(book) {
  selectedBook.value = book;
  bookSearchQuery.value = book.title; 
}
onMounted(() => {
  const userId = parseInt(route.params.id);
  if (userId) {
    selectedUser.value = userStore.getUserById(userId);
  }

  if (!selectedUser.value) {
    toast.error('Usuário não encontrado.');
    router.push({ name: 'user-management' });
  }

  const defaultDueDate = new Date();
  defaultDueDate.setDate(defaultDueDate.getDate() + 14); 
  dueDate.value = defaultDueDate.toISOString().split('T')[0];
});

const handleLoan = () => {

 if (selectedUser.value && selectedBook.value) {
    loanStore.registerLoan(selectedBook.value, selectedUser.value, dueDate.value);
    toast.success(`Empréstimo para "${selectedUser.value.name}" registrado com sucesso!`);
    router.push({ name: 'user-management' });
  } else {
    toast.error('Erro ao registrar empréstimo. Verifique os dados do livro ou do Usuário.');
  }
};

</script>

<style scoped>
  .list-group-item:hover {
    background-color: #f0f0f0; 
    cursor: pointer;       
    transition: background-color 0.2s ease-in-out;
  }
</style>