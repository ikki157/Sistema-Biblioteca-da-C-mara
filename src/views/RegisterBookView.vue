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
          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

          <form @submit.prevent="promptForPasswordConfirmation">
            <div class="mb-3">
              <label for="bookTitle" class="form-label">Título do Livro</label>
              <input type="text" v-model="book.title" class="form-control" id="bookTitle" required>
            </div>
            
            <div class="row">
              <div class="col-md-8 mb-3">
                <label for="bookAuthor" class="form-label">Autor</label>
                <input type="text" v-model="book.author" class="form-control" id="bookAuthor" required>
              </div>
              <div class="col-md-4 mb-3">
                <label for="bookQuantity" class="form-label">Quantidade</label>
                <input type="number" v-model.number="book.quantity" class="form-control" id="bookQuantity" min="1" required>
              </div>
            </div>

            <div class="pt-3 border-top mt-4">
              <button type="submit" class="btn btn-primary" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <i v-else class="bi bi-check-circle me-2"></i>
                Registrar Livro
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
import api from '@/services/api.js'; // Importa nosso serviço de API
import PasswordModal from '@/components/PasswordModal.vue';

// Adicionamos 'quantity' ao nosso objeto
const book = ref({
  title: '',
  author: '',
  quantity: 1 // Valor inicial de 1
});

const showPasswordModal = ref(false);
const isLoading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const promptForPasswordConfirmation = () => {
  showPasswordModal.value = true;
};

// Função que agora chama a API de verdade
const handleActualRegistration = async () => {
  isLoading.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    // Chama a função do nosso serviço de API
    await api.registerBook(book.value);
    
    successMessage.value = `Sucesso! ${book.value.quantity} cópia(s) de "${book.value.title}" foram registradas.`;
    
    // Limpa o formulário
    book.value = { title: '', author: '', quantity: 1 };

  } catch (error) {
    // Se o backend retornar um erro, ele será exibido aqui
    errorMessage.value = 'Falha ao registrar o livro. Tente novamente.';
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>