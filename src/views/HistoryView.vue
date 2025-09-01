<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
      <h2 class="h4 mb-0">Histórico de Movimentações</h2>

      <div class="mb-3">
          <a class="btn btn-outline-primary" data-bs-toggle="collapse" href="#collapseFilters" role="button" aria-expanded="false" aria-controls="collapseFilters">
              <i class="bi bi-funnel me-1"></i>
              Mostrar/Ocultar Filtros
          </a>
      </div>

      <div class="collapse" id="collapseFilters">
        <div class="row g-3 mb-4 p-3 bg-light border rounded">
          <div class="col-md-4">
            <label for="filterAction" class="form-label">Filtrar por Ação</label>
            <select id="filterAction" class="form-select" v-model="actionTypeFilter">
              <option value="">Todas as Ações</option>
            <option v-for="type in uniqueActionTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
        <div class="col-md-4">
          <label for="filterDate" class="form-label">Filtrar por Data</label>
          <input type="date" id="filterDate" class="form-control" v-model="dateFilter">
        </div>
        <div class="col-md-4">
          <label for="sortOrder" class="form-label">Ordenar Por</label>
          <select id="sortOrder" class="form-select" v-model="sortOrder">
            <option value="desc">Mais Recentes</option>
            <option value="asc">Mais Antigos</option>
            <option value="alpha">Alfabético (Livro)</option>
          </select>
        </div>
        <div class="col-12 text-end" v-if="isAnyFilterActive">
          <button @click="clearFilters" class="btn btn-sm btn-outline-secondary">
            <i class="bi bi-x-circle me-1"></i> Limpar Filtros
          </button>
        </div>
      </div>
      </div>

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
                <td v-html="formatDetails(event)"></td>

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
import { ref, computed } from 'vue';
import { useLoanStore } from '@/store/loanStore';

const loanStore = useLoanStore();
const actionTypeFilter = ref('');
const dateFilter = ref('');
const sortOrder = ref('desc');
const isFilterVisible = ref(false);


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
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const formatDetails = (event) => {
  const title = `${event.book.title} ${event.book.code ? `<span class="text-muted small">(Cód: ${event.book.code})</span>` : ''}`;

  switch (event.type) {
    case 'Empréstimo':
      return `${title}<br><small class="text-muted">Devolver em: ${formatDate(event.dueDate)}</small>`;
    case 'Devolução':
      
      if (event.loanDate) {
        return `${title}<br><small class="text-muted">Emprestado em: ${formatDate(event.loanDate)}</small>`;
      }
      return title;
    case 'Renovação':
      return `${title}<br><small class="text-muted">De: ${formatDate(event.previousDueDate)} → Para: ${formatDate(event.newDueDate)}</small>`;
    default:
      return title;
  }
};

const uniqueActionTypes = computed(() => {
  const types = loanStore.history.map(event => event.type);
  return [...new Set(types)].sort();
});

const clearFilters = () => {
  actionTypeFilter.value = '';
  dateFilter.value = '';
};

const isAnyFilterActive = computed(() => actionTypeFilter.value || dateFilter.value);

const filteredHistory = computed(() => {
  let history = [...loanStore.history];

  if (actionTypeFilter.value) {
    history = history.filter(event => event.type === actionTypeFilter.value);
  }

  if (dateFilter.value) {
    history = history.filter(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return eventDate === dateFilter.value;
    });
  }

  history.sort((a, b) => {
    if (sortOrder.value === 'alpha') {
      return a.book.title.localeCompare(b.book.title);
    } else if (sortOrder.value === 'asc') {
      return new Date(a.date) - new Date(b.date);
    } else {
      return new Date(b.date) - new Date(a.date);
    }
  });

  return history;
});

</script>

<style scoped>
  .table {
    vertical-align: middle;
  }
</style>