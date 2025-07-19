<template>
 <div class="card">

    <div class="card-header">
      <h2 class="h4">Gerenciar Empréstimo</h2>
    </div>

    <div class="card-footer">
        <RouterLink to="/pesquisar-livro" class="btn btn-outline-secondary">Voltar</RouterLink>
    </div>

    <div class="card-body" v-if="loan">
      <h4>Detalhes do Empréstimo</h4>
      <p><strong>Livro:</strong> {{ loan.book.title }}</p>
      <p><strong>Leitor:</strong> {{ loan.user.name }}</p>
      <p><strong>Data de Devolução Atual:</strong> {{ new Date(loan.dueDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) }}</p>
      <button @click="promptForPasswordConfirmationReturn" class="btn btn-success">Confirmar Devolução</button>

      <hr class="my-4">

      <h4>Estender Prazo de Devolução</h4>
      <div class="mb-3">
        <label for="newDueDate" class="form-label">Nova Data de Devolução:</label>
        <input type="date" id="newDueDate" class="form-control" v-model="newDueDate">
      </div>
      <button @click="promptForPasswordConfirmationRenovar" class="btn btn-primary">Confirmar Renovação</button>

    </div>
  </div>

  <PasswordModal v-model="showPasswordModalReturn" @success="handleReturn" />
  <PasswordModal v-model="showPasswordModalRenovar" @success="handleExtension" />
  <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
  <div v-if="!loan" class="alert alert-danger">Empréstimo não encontrado ou inválido.</div>
  
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useLoanStore } from '@/store/loanStore';
import { useToast } from 'vue-toastification';
import PasswordModal from '@/components/PasswordModal.vue';

const route = useRoute();
const router = useRouter();
const loanStore = useLoanStore();
const toast = useToast();

const loanEvent = ref(null);
const showPasswordModalReturn = ref(false);
const showPasswordModalRenovar = ref(false);
const successMessage = ref('');

const loanId = parseInt(route.params.loanId);
const loan = computed(() => loanStore.history.find(e => e.loanId === loanId && e.type === 'Empréstimo'));
const newDueDate = ref('');

onMounted(() => {
  if (loan.value) {
    const suggestedDueDate = new Date(loan.value.date);
    suggestedDueDate.setDate(suggestedDueDate.getDate() + 7);
    newDueDate.value = suggestedDueDate.toISOString().split('T')[0];
  }
});

const promptForPasswordConfirmationReturn = () => showPasswordModalReturn.value = true;
const promptForPasswordConfirmationRenovar = () => showPasswordModalRenovar.value = true;


const handleReturn = () => {
  loanStore.registerReturn(loanId);
  toast.success(`Livro "${loan.value.book.title}" devolvido com sucesso!`);
  router.push('/pesquisar-livro');
};

const handleExtension = () => {
  if (loanStore.extendDueDate(loanId, newDueDate.value)) {
    toast.success(`Prazo de devolução estendido até ${new Date(newDueDate.value).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}.`);
    router.push('/pesquisar-livro');
  } else {
    toast.error('Não foi possível estender o prazo.');
  }
};
</script>