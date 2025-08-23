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
              <td class="text-center align-middle">
                <button class="btn btn-sm btn-outline-primary me-2" title="Editar Usuário" @click="$router.push({ name: 'edit-user', params: { id: user.id } })">
                  <i class="bi bi-pencil"></i>
                </button>

                <button  @click="promptForDelete(user.id)" class="btn btn-sm btn-outline-danger me-2" :title="userHasActiveLoan(user) ? 'Usuário com empréstimos ativos não pode ser excluído' : 'Excluir Usuário'" :disabled="userHasActiveLoan(user)">
                  <i class="bi bi-trash"></i>
                </button>

                 <button 
                  @click="goToLoanPage(user.id)" 
                  class="btn btn-success btn-sm"
                  :disabled="getActiveLoansForUser(user).length >= 3"
                  :title="getActiveLoansForUser(user).length >= 3 ? 'Usuário atingiu o limite de 3 empréstimos' : 'Registrar novo empréstimo'">
                  <i class="bi bi-book me-1"></i> Emprestar
                </button>

                <div v-if="userHasActiveLoan(user)" class="mt-2 border-top pt-2">
                  <small class="d-block mb-1 fw-bold">Devolver/Retornar:</small>

                  <div
                    v-for="loan in getActiveLoansForUser(user)"
                    :key="nextLoanId"
                    class="d-flex justify-content-around align-items-center bg-light p-2 rounded mb-1"
                  >
                    <span>Com: {{ loan.book.title }}</span>
                    <button @click="goToReturnPage(loan.loanId)" class="btn btn-outline-secondary btn-sm">
                      <i class="bi bi-arrow-return-left"></i>
                    </button>
                  </div>
                </div>
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
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { useUserStore } from '@/store/userStore'; 
import { useLoanStore } from '@/store/loanStore';
import PasswordModal from '@/components/PasswordModal.vue'; 

const route = useRoute();
const router = useRouter();
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

const userIdFromRoute = route.params.id;

const selectedUser = userStore.findUserById(userIdFromRoute);

const userHasActiveLoan = (user) => {
  return getActiveLoansForUser(user).length > 0;
};

const promptForDelete = (userId) => {
  const user = userStore.getUserById(userId);
  if (userHasActiveLoan(user)) {
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
      loanStore.logUserDeletion(user);
      userStore.deleteUser(userToDeleteId.value);
    }
    userToDeleteId.value = null;
  }
};

const goToLoanPage = (userId) => {
  console.log('Função goToLoanPage chamada com o ID do usuário:', userId);
  router.push({ name: 'register-loan', params: { id: userId } });
};

const goToReturnPage = (loanId) => {
  if (loanId) {
    router.push({ name: 'register-return', params: { loanId: loanId } });
  } else {
    console.error("Tentativa de devolução com um loanId inválido!");
  }
};

const getActiveLoansForUser = (user) => {
  if (!user) return [];
  const returnedLoanIds = new Set(loanStore.history
    .filter(event => event.type === 'Devolução')
    .map(event => event.loanId));

  return loanStore.history.filter(event => event.type === 'Empréstimo' && event.user.id === user.id && !returnedLoanIds.has(event.loanId));
};

</script>

<style scoped>
  .table {
    vertical-align: middle;
  }
</style>