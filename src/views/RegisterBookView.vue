<template>
  <div class="row justify-content-center">
    <div class="col-lg-8">
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h2 class="h4 mb-0">Registrar Novo Livro</h2>
          <RouterLink to="/" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-1"></i> Voltar ao Home
          </RouterLink>
        </div>
        <div class="card-body p-4">
          <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

          <form @submit.prevent="promptForPasswordConfirmation">
            <div class="mb-3">
              <label for="bookTitle" class="form-label">Título do Livro</label>
              <input type="text" v-model="book.title" class="form-control" id="bookTitle" required>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="bookAuthor" class="form-label">Autor</label>
                <input type="text" v-model="book.author" class="form-control" id="bookAuthor" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="bookGenre" class="form-label">Gênero</label>
                <input type="text" v-model="book.genre" class="form-control" id="bookGenre" required>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="bookCode" class="form-label">Código / ISBN</label>
                <input type="text" v-model="book.code" class="form-control" id="bookCode" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="bookQuantity" class="form-label">Quantidade</label>
                <input type="number" v-model.number="book.quantity" class="form-control" id="bookQuantity" min="1" required>
              </div>
            </div>

            <div class="pt-3 border-top mt-4">
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-check-circle me-2"></i>Registrar Livro
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <PasswordModal v-model="showPasswordModal" @success="handleActualRegistration" />
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useBookStore } from '@/store/bookStore'; // Importa o bookStore
import PasswordModal from '@/components/PasswordModal.vue';

const bookStore = useBookStore(); // Inicializa o store

const book = ref({
  title: '',
  author: '',
  genre: '', // Campo adicionado
  code: '',  // Campo adicionado
  quantity: 1
});

const showPasswordModal = ref(false);
const successMessage = ref('');

const promptForPasswordConfirmation = () => {
  showPasswordModal.value = true;
};

const handleActualRegistration = () => {
  // Chama a ação do store para registrar o livro
  bookStore.registerBook(book.value);
  
  successMessage.value = `Sucesso! ${book.value.quantity} cópia(s) de "${book.value.title}" foram registradas.`;
  
  // Limpa o formulário
  book.value = { title: '', author: '', genre: '', code: '', quantity: 1 };

  // Oculta a mensagem de sucesso após alguns segundos
  setTimeout(() => {
    successMessage.value = '';
  }, 5000);
};
</script>