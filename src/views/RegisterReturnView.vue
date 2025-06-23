<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
      <h2 class="h4 mb-0">Registrar Devolução</h2>
      <RouterLink to="/pesquisar-livro" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i> Voltar</RouterLink>
    </div>
    <div class="card-body p-4">
      <div v-if="loanEvent">
        <div class="alert alert-info">
          <h5 class="alert-heading">Devolvendo: {{ loanEvent.book.title }}</h5>
          <p class="mb-0"><strong>Emprestado para:</strong> {{ loanEvent.readerName }}</p>
        </div>

        <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
        
        <form @submit.prevent="promptForPasswordConfirmation" v-if="!successMessage">
          <p>Confirme a devolução deste item.</p>
          <button type="submit" class="btn btn-primary">Confirmar Devolução</button>
        </form>
      </div>
      <div v-else class="alert alert-danger">
        Registro de empréstimo não encontrado.
      </div>
    </div>
  </div>
  
  <PasswordModal v-model="showPasswordModal" @success="handleActualReturn" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useLoanStore } from '@/store/loanStore';
import PasswordModal from '@/components/PasswordModal.vue';

const route = useRoute();
const router = useRouter();
const loanStore = useLoanStore();

const loanEvent = ref(null);
const showPasswordModal = ref(false);
const successMessage = ref('');

onMounted(() => {
  const loanId = route.params.loanId;
  loanEvent.value = loanStore.history.find(e => e.loanId === loanId);
});

const promptForPasswordConfirmation = () => showPasswordModal.value = true;

const handleActualReturn = () => {
  if (loanEvent.value) {
    const success = loanStore.registerReturn(loanEvent.value.loanId);
    if (success) {
      successMessage.value = 'Devolução registrada com sucesso!';
      setTimeout(() => router.push('/pesquisar-livro'), 2000); // Redireciona após 2s
    } else {
      alert('Ocorreu um erro ao processar a devolução.');
    }
  }
};
</script>