<template>
  <div class="row justify-content-center">
    <div class="col-lg-8">
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h2 class="h4 mb-0">Editar Usuário</h2>
          <RouterLink to="/usuario" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-1"></i> Voltar
          </RouterLink>
        </div>
        <div class="card-body p-4">
          <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

          <form v-if="user && !successMessage" @submit.prevent="promptForPasswordConfirmation">
            <div class="mb-3">
              <label for="userName" class="form-label">Nome do Usuário</label>
              <input type="text" v-model="user.name" class="form-control" id="userName" required>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="userNumIdent" class="form-label">N° de Identificação</label>
                <input type="text" v-model="user.numIdent" class="form-control" id="userNumIdent" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="userDateNasc" class="form-label">Data de Nascimento</label>
                <input type="date" v-model="user.dateNasc" class="form-control" id="userDateNasc" required>
              </div>
            </div>

            <div class="mb-3">
              <label for="userAddress" class="form-label">Endereço</label>
              <input type="text" v-model="user.address" class="form-control" id="userAddress" required>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="userPhone" class="form-label">Telefone</label>
                <input type="text" v-model="user.phone" class="form-control" id="userPhone" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="userEmail" class="form-label">Email</label>
                <input type="email" v-model="user.email" class="form-control" id="userEmail" required>
              </div>
            </div>

            <div class="pt-3 border-top mt-4">
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-check-circle me-2"></i>Salvar Alterações
              </button>
            </div>
          </form>
          
          <div v-else-if="!user && !successMessage" class="alert alert-danger">
            Usuário não encontrado.
          </div>
        </div>
      </div>
    </div>
  </div>

  <PasswordModal v-model="showPasswordModal" @success="handleActualUpdate" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import PasswordModal from '@/components/PasswordModal.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const user = ref(null); 
const showPasswordModal = ref(false);
const successMessage = ref('');

onMounted(() => {
  const userId = parseInt(route.params.id); 
  const foundUser = userStore.getUserById(userId);
  if (foundUser) {
    user.value = { ...foundUser }; 
  }
});

const promptForPasswordConfirmation = () => {
  showPasswordModal.value = true;
};

const handleActualUpdate = () => {
  if (user.value) {
    userStore.editUser(user.value.id, user.value);
    
    successMessage.value = 'Usuário atualizado com sucesso!';
    setTimeout(() => router.push('/usuario'), 2000); 
  }
};
</script>