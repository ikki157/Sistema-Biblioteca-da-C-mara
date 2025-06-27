<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
      <h2 class="h4 mb-0">Gerenciamento de Usuários</h2>
      <div>
        <RouterLink to="/registrar-usuario" class="btn btn-primary me-2">
            <i class="bi bi-plus-circle me-1"></i> Adicionar Usuário
        </RouterLink>
        <RouterLink to="/" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i> Voltar</RouterLink>
      </div>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Pesquisar usuários...">
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-light">
            <tr>
              <th>Nome</th>
              <th>Nº de Identificação</th>
              <th>Data de Nascimento</th>
              <th>Endereço</th>
              <th>Telefone</th>
              <th>Email</th>
              <th class="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!filteredUsers.length">
              <td colspan="6" class="text-center text-muted py-4">Nenhum usuário encontrado.</td>
            </tr>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.numIdent }}</td>
              <td>{{ user.dateNasc }}</td>
              <td>{{ user.address }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.email }}</td>
              <td class="text-center">
                <button class="btn btn-sm btn-outline-primary me-2" title="Editar Usuário" @click="$router.push({ name: 'edit-user', params: { id: user.id } })">
                  <i class="bi bi-pencil"></i>
                </button>
                <button 
                  @click="promptForDelete(user.id)" 
                  class="btn btn-sm btn-outline-danger"
                  :title="hasActiveLoan(user) ? 'Usuário com empréstimos ativos não pode ser excluído' : 'Excluir Usuário'"
                  :disabled="hasActiveLoan(user)">
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
import { RouterLink } from 'vue-router';
import { useUserStore } from '@/store/userStore'; 
import { useLoanStore } from '@/store/loanStore';
import PasswordModal from '@/components/PasswordModal.vue'; 

const userStore = useUserStore();
const loanStore = useLoanStore();

const searchQuery = ref('');
const showPasswordModal = ref(false);
const userToDeleteId = ref(null);

const filteredUsers = computed(() => {
  if (!searchQuery.value) return userStore.users;
  const q = searchQuery.value.toLowerCase();
  return userStore.users.filter(user => 
    user.name.toLowerCase().includes(q) ||
    user.address?.toLowerCase().includes(q) ||
    String(user.phone).toLowerCase().includes(q) ||
    user.email.toLowerCase().includes(q) ||
    String(user.numIdent).toLowerCase().includes(q) ||
    String(user.dateNasc).toLowerCase().includes(q)
  );
});

// A função de verificação agora recebe o objeto 'user' inteiro
const hasActiveLoan = (user) => {
  if (!user) return false;
  const activeLoans = new Set();
  loanStore.history.forEach(event => {
    if (event.readerName === user.name) {
      if (event.type === 'Empréstimo') activeLoans.add(event.loanId);
      else if (event.type === 'Devolução') activeLoans.delete(event.loanId);
    }
  });
  return activeLoans.size > 0;
};

const promptForDelete = (userId) => {
  const user = userStore.getUserById(userId);
  if (hasActiveLoan(user)) {
    alert('Ação não permitida: Este usuário possui empréstimos ativos e não pode ser excluído.');
    return;
  }
  userToDeleteId.value = userId;
  showPasswordModal.value = true;
};

const handleActualDeletion = () => {
  if (userToDeleteId.value) {
    const user = userStore.getUserById(userToDeleteId.value);
    if (user) {
      // 1. Primeiro, registra a exclusão no histórico
      loanStore.logUserDeletion(user);
      // 2. Depois, remove o usuário do acervo
      userStore.deleteUser(userToDeleteId.value);
    }
    userToDeleteId.value = null;
  }
};
</script>

<style scoped>
  .table {
    vertical-align: middle;
  }
</style>