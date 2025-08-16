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
              <th>Detalhes</th>
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
                  <i :class="getIconClass(event.type)" class="me-1"></i>
                  {{ event.type }}
                </span>
              </td>
                            <td>{{ event.book.title }} <span v-if="event.book.code" class="text-muted small">(Cód: {{ event.book.code }})</span></td>

              <td>{{ event.user.name !== 'N/A' ? event.user.name : '—' }}</td>
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

const getBadgeClass = (eventType) => {
  switch (eventType) {
    case 'Empréstimo': return 'bg-warning text-dark';
    case 'Devolução': return 'bg-success';
    case 'Exclusão de Livro':
    case 'Exclusão de Usuário': return 'bg-danger';
    case 'Renovação': return 'bg-info text-dark';
    case 'Cadastro de Livro':
    case 'Cadastro de Usuário': return 'bg-primary';
    case 'Edição de Livro':
    case 'Edição de Usuário': return 'bg-secondary';
    default: return 'bg-light text-dark';
  }
};

const getIconClass = (eventType) => {
    switch (eventType) {
        case 'Empréstimo': return 'bi bi-box-arrow-up-right';
        case 'Devolução': return 'bi bi-box-arrow-in-down';
        case 'Exclusão de Livro':
        case 'Exclusão de Usuário': return 'bi bi-trash';
        case 'Renovação': return 'bi bi-calendar-plus';
        case 'Cadastro de Livro':
        case 'Cadastro de Usuário': return 'bi bi-plus-circle';
        case 'Edição de Livro':
        case 'Edição de Usuário': return 'bi bi-pencil-square';
        default: return 'bi bi-info-circle';
    }
}
</script>

<style scoped>
  .table {
    vertical-align: middle;
  }
</style>