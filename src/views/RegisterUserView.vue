<template>
  <div class="row justify-content-center">
    <div class="col-lg-8">
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h2 class="h4 mb-0">Registrar Novo Usuário</h2>
          <RouterLink to="/usuario" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-1"></i> Voltar
          </RouterLink>
        </div>
        <div class="card-body p-4">
          <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

          <form @submit.prevent="promptForPasswordConfirmation">
            <div class="mb-3">
              <label for="userName" class="form-label">Nome do Usuário</label>
              <input type="text" v-model="user.name" class="form-control" placeholder="Digite o nome do usuário" id="userName" required>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="userNumIdent" class="form-label">N° de Identificação</label>
                <input type="text" v-model="user.numIdent" class="form-control" placeholder="Digite o número de identificação(CPF, RG...)" id="userNumIdent" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="userDateNasc" class="form-label">Data de Nascimento</label>
                <input type="date" v-model="user.dateNasc" class="form-control" placeholder="Selecione a data de nascimento" id="userDateNasc" required>
              </div>
            </div>

            
              <div class="mb-3">
                <label for="userAddress" class="form-label">Endereço</label>
                <input type="text" v-model="user.address" class="form-control" placeholder="Digite o endereço" id="userAddress" required>
              </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="userPhone" class="form-label">Telefone</label>
                <input type="text" v-model="user.phone" class="form-control" placeholder="Digite o telefone" id="userPhone" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="userEmail" class="form-label">Email</label>
                <input type="text" v-model="user.email" class="form-control" placeholder="Digite o email" id="userEmail" required>
              </div>
            </div>

            <div class="pt-3 border-top mt-4">
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-check-circle me-2"></i>Registrar Usuário
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
import { useUserStore } from '@/store/userStore';
import PasswordModal from '@/components/PasswordModal.vue';

const userStore = useUserStore(); // Inicializa o store

const user = ref({
  name: '',
  numIdent: '',
  dateNasc: '',
  address: '',
  phone: '',
  email: ''
});

const showPasswordModal = ref(false);
const successMessage = ref('');

const promptForPasswordConfirmation = () => {
  showPasswordModal.value = true;
};

const handleActualRegistration = () => {

  userStore.registerUser(user.value);

  successMessage.value = `Sucesso! Usuário "${user.value.name}" foi registrado.`;

  
  user.value = { name: '', numIdent: '', dateNasc: '', address: '', phone: '', email: '' };

  
  setTimeout(() => {
    successMessage.value = '';
  }, 5000);
};
</script>