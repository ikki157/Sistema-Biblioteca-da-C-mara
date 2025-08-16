<template>
  <div class="row justify-content-center">
    <div class="col-lg-8">
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h2 class="h4 mb-0">Registrar Novo Livro</h2>
          <RouterLink to="/" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-1"></i> Voltar
          </RouterLink>
        </div>
        <div class="card-body p-4">

          <form @submit.prevent="promptForPasswordConfirmation">
            <div class="mb-3">
              <label for="bookImage" class="form-label">Imagem do Livro</label>
              <input type="file" @change="handleImageUpload" class="form-control" id="bookImage" accept="image/*">
              <div v-if="book.bookImage" class="mt-3">
                <img :src="book.bookImage" alt="Pré-visualização da imagem" class="img-thumbnail" style="max-height: 200px;">
              </div>
            </div>

            <div class="mb-3">
              <label for="bookTitle" class="form-label">Título do Livro</label>
              <input type="text" v-model="book.title" class="form-control" placeholder="Digite o título do livro" id="bookTitle" required>
            </div>
            
            <div class="mb-3">
              <label for="bookSubtitle" class="form-label">Subtítulo</label>
              <input type="text" v-model="book.subtitle" class="form-control" placeholder="Digite o subtítulo do livro" id="bookSubtitle">
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="bookAuthor" class="form-label">Autor</label>
                <input type="text" v-model="book.author" class="form-control" placeholder="Digite o autor do livro" id="bookAuthor" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="bookGenre" class="form-label">Gênero</label>
                <input type="text" v-model="book.genre" class="form-control" placeholder="Digite o gênero do livro" id="bookGenre" required>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="bookPublisher" class="form-label">Editora</label>
                <input type="text" v-model="book.publisher" class="form-control" placeholder="Digite a editora" id="bookPublisher">
              </div>
              <div class="col-md-6 mb-3">
                <label for="bookPublicationPlace" class="form-label">Local de Publicação</label>
                <input type="text" v-model="book.publicationPlace" class="form-control" placeholder="Digite o local de publicação" id="bookPublicationPlace">
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="bookYear" class="form-label">Ano de Publicação</label>
                <input type="number" v-model.number="book.publicationYear" class="form-control" placeholder="Ano" id="bookYear">
              </div>
              <div class="col-md-6 mb-3">
                <label for="bookEdition" class="form-label">Edição</label>
                <input type="text" v-model="book.edition" class="form-control" placeholder="Ex: 1ª Edição" id="bookEdition">
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="bookCdd" class="form-label">CDD</label>
                <input type="text" v-model="book.cdd" class="form-control" placeholder="Número CDD" id="bookCdd">
              </div>
              <div class="col-md-6 mb-3">
                <label for="bookCutter" class="form-label">Cutter</label>
                <input type="text" v-model="book.cutter" class="form-control" placeholder="Número Cutter" id="bookCutter">
              </div>
            </div>
            
            <div class="mb-3">
              <label for="bookTopicSubject" class="form-label">Assunto Tópico</label>
              <input type="text" v-model="book.topicSubject" class="form-control" placeholder="Assunto(s) ou tópico(s)" id="bookTopicSubject">
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="bookLanguage" class="form-label">Idioma</label>
                <input type="text" v-model="book.language" class="form-control" placeholder="Ex: Português" id="bookLanguage">
              </div>
              <div class="col-md-6 mb-3">
                <label for="bookCollectionSeries" class="form-label">Série / Coleção</label>
                <input type="text" v-model="book.collectionSeries" class="form-control" placeholder="Série ou Coleção" id="bookCollectionSeries">
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="bookAcquisitionType" class="form-label">Tipo de Aquisição</label>
                <select v-model="book.acquisitionType" class="form-control" id="bookAcquisitionType">
                  <option value="Compra">Compra</option>
                  <option value="Doação">Doação</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label for="bookMaterialType" class="form-label">Material</label>
                <select v-model="book.materialType" class="form-control" id="bookMaterialType">
                  <option value="Livro">Livro</option>
                  <option value="Folheto">Folheto</option>
                  <option value="Periódico">Periódico</option>
                  <option value="E-book">E-book</option>
                </select>
              </div>
            </div>

              <div class="col-md-6 mb-3">
                <label for="systemId" class="form-label">Código do Sistema</label>
                <div class="input-group">
                  <input type="text" v-model="book.systemId" class="form-control" placeholder="Clique em Gerar Código" id="systemId" required>
                  <button type="button" class="btn btn-outline-primary" @click="generateRandomSystemId">
                    Gerar Código
                  </button>
                </div>
              </div>
            

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="bookCode" class="form-label">ISBN / ISSN</label>
                <input type="text" v-model="book.code" class="form-control" placeholder="Digite o código / ISBN" id="bookCode" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="bookQuantity" class="form-label">Quantidade</label>
                <input type="number" v-model.number="book.quantity" class="form-control" placeholder="Digite a quantidade" id="bookQuantity" min="1" required>
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
import { useBookStore } from '@/store/bookStore'; 
import { useToast } from 'vue-toastification';
import PasswordModal from '@/components/PasswordModal.vue';

const bookStore = useBookStore(); 
const toast = useToast();

const book = ref({
title: '',
  subtitle: '',
  author: '',
  genre: '', 
  publisher: '',
  publicationPlace: '',
  publicationYear: null,
  cdd: '',
  cutter: '',
  edition: '',
  topicSubject: '',
  language: '',
  acquisitionType: 'Compra',
  collectionSeries: '',
  materialType: 'Livro',
  code: '',  
  systemId: '',
  quantity: 1,
  bookImage: ''
});

const showPasswordModal = ref(false);
const successMessage = ref('');

const promptForPasswordConfirmation = () => {
  showPasswordModal.value = true;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    book.value.bookImage = e.target.result;
  };
  reader.readAsDataURL(file);
};

const generateRandomSystemId = () => {
  const existingIds = bookStore.systemIds;
  let newId = '';

  while (true) {
    const min = 10000;
    const max = 99999;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    const generatedId = String(randomNum);

    if (existingIds && !existingIds.has(generatedId)) {
      newId = generatedId;
      break;
    }
  }

  book.value.systemId = newId;
  toast.success('Código único do sistema gerado com sucesso!');
};

const handleActualRegistration = () => {
  bookStore.registerBook(book.value);

  toast.success(`Sucesso! ${book.value.quantity} cópia(s) de "${book.value.title}" foram registradas.`);

  book.value = {
    title: '',
    subtitle: '',
    author: '',
    genre: '', 
    publisher: '',
    publicationPlace: '',
    publicationYear: null,
    cdd: '',
    cutter: '',
    edition: '',
    topicSubject: '',
    language: '',
    acquisitionType: 'Compra',
    collectionSeries: '',
    materialType: 'Livro',
    code: '',
    systemId: '',
    quantity: 1,
    bookImage: ''
  };

  setTimeout(() => {
    successMessage.value = '';
  }, 5000);
};
</script>