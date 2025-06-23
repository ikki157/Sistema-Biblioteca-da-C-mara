<template>
  <div class="row justify-content-center">
    <div class="col-lg-8">
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white py-3">
          <h2 class="h4 mb-0">Registrar Novo Livro</h2>
        </div>
        <div class="card-body p-4">
          <form @submit.prevent="promptForPasswordConfirmation">
            
            <div class="mb-3">
              <label for="bookTitle" class="form-label">Título do Livro</label>
              <input type="text" v-model="book.title" class="form-control" id="bookTitle" placeholder="Ex: O Pequeno Príncipe" required>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="bookAuthor" class="form-label">Autor</label>
                <input type="text" v-model="book.author" class="form-control" id="bookAuthor" placeholder="Ex: Antoine de Saint-Exupéry" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="bookGenre" class="form-label">Gênero</label>
                <input type="text" v-model="book.genre" class="form-control" id="bookGenre" placeholder="Ex: Fábula, Ficção" required>
              </div>
            </div>

            <div class="mb-3">
              <label for="bookIsbn" class="form-label">ISBN (Opcional)</label>
              <input type="text" v-model="book.isbn" class="form-control" id="bookIsbn" placeholder="Ex: 978-3-16-148410-0">
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
import PasswordModal from '@/components/PasswordModal.vue'; // Importa o modal

// Objeto reativo para guardar os dados do formulário
const book = ref({
  title: '',
  author: '',
  genre: '',
  isbn: ''
});

// Controla a exibição do modal de senha
const showPasswordModal = ref(false);

// 1º Passo do fluxo: Chamado pelo botão 'Registrar'. Apenas abre o modal.
const promptForPasswordConfirmation = () => {
  showPasswordModal.value = true;
};

// 2º Passo do fluxo: Chamado pelo evento 'success' do modal.
const handleActualRegistration = () => {
  // A senha já foi validada dentro do modal.
  // Agora podemos executar a lógica de negócio com segurança.
  
  // Em um projeto real, aqui você faria a chamada para a API:
  // Ex: api.registerBook(book.value).then(...)
  
  console.log('Senha confirmada! Registrando o livro:', book.value);
  
  // Fornece feedback ao usuário
  alert(`Livro "${book.value.title}" registrado com sucesso!`);
  
  // Limpa o formulário para o próximo registro
  book.value = { title: '', author: '', genre: '', isbn: '' };
};
</script>