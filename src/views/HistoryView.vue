<template>

    <div class="collapse" id="collapseFilters">
      <div class="card-body border-bottom">
        <div class="row g-3 align-items-end mb-3">
          <div class="col-md-auto">
            <label for="filterAction" class="form-label">Filtrar por Ação</label>
            <select id="filterAction" class="form-select" v-model="actionTypeFilter">
              <option value="">Todas as Ações</option>
              <option v-for="type in uniqueActionTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
          <div class="col-md-auto">
              <label for="dateFilterType" class="form-label">Filtrar por Período</label>
              <select id="dateFilterType" class="form-select" v-model="dateFilterType">
                <option value="">Qualquer Data</option>
                <option value="day">Data Específica</option>
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="year">Este Ano</option>
              </select>
            </div>
            <div v-if="dateFilterType === 'day'" class="col-md-auto">
                <label for="filterDate" class="form-label">Selecione o Dia</label>
                <input type="date" id="filterDate" class="form-control" v-model="dateFilterValue">
            </div>
          <div class="col-md-auto">
            <label for="sortOrder" class="form-label">Ordenar Por</label>
            <select id="sortOrder" class="form-select" v-model="sortOrder">
              <option value="desc">Mais Recentes</option>
              <option value="asc">Mais Antigos</option>
              <option value="alpha">Alfabético (Livro)</option>
            </select>
          </div>
          <div class="col-md-auto ms-auto">
              <button @click="clearFilters" class="btn btn-outline-secondary w-100" v-if="isAnyFilterActive">
                  Limpar
              </button>
          </div>
        </div>
      </div>
    </div>

  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
      <h2 class="h4 mb-0">Histórico de Movimentações</h2>

          <a class="btn btn-outline-primary me-2" data-bs-toggle="collapse" href="#collapseFilters" role="button" aria-expanded="false" aria-controls="collapseFilters">
              <i class="bi bi-funnel me-1"></i>
              Filtros
          </a>

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
const sortOrder = ref('desc');
const isFilterVisible = ref(false);
const dateFilterType = ref(''); 
const dateFilterValue = ref('');

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
  dateFilterType.value = '';
  dateFilterValue.value = '';  
};

const isAnyFilterActive = computed(() => actionTypeFilter.value || dateFilterType.value);


const filteredHistory = computed(() => {
  let history = [...loanStore.history];

  if (actionTypeFilter.value) {
    history = history.filter(event => event.type === actionTypeFilter.value);
  }

  if (dateFilterType.value) {
      const now = new Date();
      history = history.filter(event => {
          const eventDate = new Date(event.date);

          switch (dateFilterType.value) {
              case 'day':
                  if (!dateFilterValue.value) return false;
                  const filterDate = new Date(dateFilterValue.value + 'T00:00:00');
                  return eventDate.getFullYear() === filterDate.getFullYear() &&
                        eventDate.getMonth() === filterDate.getMonth() &&
                        eventDate.getDate() === filterDate.getDate();

              case 'week':
                  const startOfWeek = new Date(now);
                  startOfWeek.setDate(now.getDate() - now.getDay()); 
                  startOfWeek.setHours(0, 0, 0, 0);

                  const endOfWeek = new Date(startOfWeek);
                  endOfWeek.setDate(startOfWeek.getDate() + 7);

                  return eventDate >= startOfWeek && eventDate < endOfWeek;

              case 'month':
                  return eventDate.getMonth() === now.getMonth() &&
                        eventDate.getFullYear() === now.getFullYear();

              case 'year':
                  return eventDate.getFullYear() === now.getFullYear();

              default:
                  return true;
          }
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