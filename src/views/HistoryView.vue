<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
      <h2 class="h4 mb-0">Histórico de Movimentações</h2>
      <RouterLink to="/" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i> Voltar</RouterLink>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-light">
            <tr>
              <th>Data/Hora</th>
              <th>Tipo</th>
              <th>Livro</th>
              <th>Leitor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loanStore.history.length === 0">
              <td colspan="4" class="text-center text-muted py-4">Nenhuma movimentação registrada.</td>
            </tr>
            <tr v-for="event in loanStore.history" :key="event.id">
              <td>{{ formatDateTime(event.date) }}</td>
              <td>
                <span class="badge" :class="getBadgeClass(event.type)">
                  {{ event.type }}
                </span>
              </td>
              <td>{{ event.book.title }} (Cód: {{ event.book.code }})</td>
              <td>{{ event.readerName !== 'N/A' ? event.readerName : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useLoanStore } from '@/store/loanStore';

const loanStore = useLoanStore();

const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

// NOVA FUNÇÃO: Retorna a classe CSS correta para cada tipo de evento.
const getBadgeClass = (eventType) => {
  switch (eventType) {
    case 'Empréstimo':
      return 'bg-warning text-dark';
    case 'Devolução':
      return 'bg-success';
    case 'Exclusão':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
};
</script>

<style scoped>
  .table {
    vertical-align: middle;
  }
</style>