<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
      <h2 class="h4 mb-0">Registrar Empréstimo</h2>
      <RouterLink to="/pesquisar-livro" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i> Voltar</RouterLink>
    </div>
    <div class="card-body p-4">
      <div v-if="book">
        <div class="alert alert-info">
          <h5 class="alert-heading">{{ book.title }}</h5>
          <p><strong>Autor:</strong> {{ book.author }}</p>
          <p><strong>Código:</strong> {{ book.code }}</p>
          <p class="mb-0"><strong>Cópias disponíveis:</strong> {{ book.available }}</p>
        </div>

        <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

        <form @submit.prevent="promptForPasswordConfirmation" v-if="!successMessage">
          <div class="mb-3">

            <label for="readerSelect" class="form-label">Selecione o Leitor:</label>
            <select v-model="selectUserId" class="form-select" id="readerSelect" required>
              <option disabled value="">-- Por favor, escolha um leitor --</option>
              <option v-for="user in userStore.users" :key="user.id" :value="user.id">
                {{ user.name }} ({{ user.email }})
              </option>
            </select>

            <div>
              <label for="dueDate" class="form-label">Data de Devolução:</label>
              <input type="date" v-model="dueDate" class="form-control" id="dueDate" required />
            </div>

          </div>
          <button type="submit" class="btn btn-primary">Confirmar Empréstimo</button>
        </form>
      </div>
      <div v-else class="alert alert-danger">
        Livro não encontrado ou indisponível para empréstimo.
      </div>
    </div>
  </div>

  <PasswordModal v-model="showPasswordModal" @success="handleLoanRegistration" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
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

const book = ref(null);
const selectUserId = ref('');
const showPasswordModal = ref(false);
const successMessage = ref('');
const bookId = parseInt(route.params.id);
const dueDate = ref('');

const promptForPasswordConfirmation = () => {
  showPasswordModal.value = true;
};

onMounted(() => {
  const bookId = parseInt(route.params.id);
  book.value = bookStore.getBookById(bookId);
  const defaultDueDate = new Date();
  defaultDueDate.setDate(defaultDueDate.getDate() + 14);
  dueDate.value = defaultDueDate.toISOString().split('T')[0]; 
});

const handleLoanRegistration = () => {

  if (!selectUserId.value) {
    toast.error('Por favor, selecione um leitor.');
    return;
  }

  const bookToLoan = bookStore.getBookById(bookId);
  const userToLoan = userStore.getUserById(selectUserId.value);

  if (bookToLoan && userToLoan) {
    loanStore.registerLoan(bookToLoan, userToLoan, dueDate.value);
    toast.success(`Empréstimo registrado! Devolver até ${new Date(dueDate.value).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}.`);
    router.push('/pesquisar-livro');
  } else {
    toast.error('Erro ao registrar empréstimo. Verifique os dados do livro ou do Usuário.');
  }

};
</script>