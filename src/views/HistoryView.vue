<template>
  <div class="collapse" id="collapseFilters">
    <div class="card-body border-bottom">
      <div class="row g-3 align-items-end mb-3">
        <div class="col-md-auto">
          <label for="filterAction" class="form-label">Ação</label>
          <select id="filterAction" class="form-select" v-model="actionTypeFilter">
            <option value="">Todas</option>
            <option v-for="type in uniqueActionTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>

        <div class="col-md-auto">
          <label for="dateFilterType" class="form-label">Período</label>
          <select id="dateFilterType" class="form-select" v-model="dateFilterType">
            <option value="">Qualquer Data</option>
            <option value="day">Dia Específico</option>
            <option value="week">Semana Específica</option>
            <option value="month">Mês Específico</option>
            <option value="year">Ano Específico</option>
          </select>
        </div>

        <div v-if="dateFilterType === 'day'" class="col-md-auto">
          <label for="filterDate" class="form-label">Selecione o Dia</label>
          <input type="date" id="filterDate" class="form-control" v-model="specificDateValue">
        </div>
        <div v-if="dateFilterType === 'week'" class="col-md-auto">
          <label for="filterWeek" class="form-label">Selecione a Semana</label>
          <input type="week" id="filterWeek" class="form-control" v-model="specificWeekValue">
        </div>
        <div v-if="dateFilterType === 'month'" class="col-md-auto">
          <label for="filterMonth" class="form-label">Selecione o Mês</label>
          <input type="month" id="filterMonth" class="form-control" v-model="specificMonthValue">
        </div>
        <div v-if="dateFilterType === 'year'" class="col-md-auto">
          <label for="filterYear" class="form-label">Digite o Ano</label>
          <input type="number" id="filterYear" class="form-control" v-model.number="specificYearValue" placeholder="Ex: 2024">
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
      <div>
        <a class="btn btn-outline-primary me-2" data-bs-toggle="collapse" href="#collapseFilters" role="button" aria-expanded="false" aria-controls="collapseFilters">
          <i class="bi bi-funnel me-1"></i>
          Filtros
        </a>
        <RouterLink to="/" class="btn btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i> Voltar</RouterLink>
      </div>
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
            <tr v-if="filteredHistory.length === 0">
              <td colspan="4" class="text-center text-muted py-4">Nenhuma movimentação encontrada para os filtros aplicados.</td>
            </tr>
            <tr v-for="event in filteredHistory" :key="event.id">
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
import { ref, computed, watch } from 'vue';
import { useLoanStore } from '@/store/loanStore';

const loanStore = useLoanStore();

// Refs para os filtros
const actionTypeFilter = ref('');
const sortOrder = ref('desc');
const dateFilterType = ref('');

// Refs para os valores dos inputs de data específicos
const specificDateValue = ref('');
const specificWeekValue = ref('');
const specificMonthValue = ref('');
const specificYearValue = ref(null);

// Função auxiliar para obter o número da semana de uma data (padrão ISO 8601)
const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return [d.getUTCFullYear(), weekNo];
};

// Limpa os valores dos inputs de data quando o tipo de filtro muda
watch(dateFilterType, () => {
  specificDateValue.value = '';
  specificWeekValue.value = '';
  specificMonthValue.value = '';
  specificYearValue.value = null;
});

const clearFilters = () => {
  actionTypeFilter.value = '';
  dateFilterType.value = '';
};

const isAnyFilterActive = computed(() => {
  return actionTypeFilter.value || dateFilterType.value;
});

// Lógica principal de filtragem e ordenação
const filteredHistory = computed(() => {
  let history = [...loanStore.history];

  // 1. Filtrar por tipo de ação
  if (actionTypeFilter.value) {
    history = history.filter(event => event.type === actionTypeFilter.value);
  }

  // 2. Filtrar por período de data
  if (dateFilterType.value) {
    history = history.filter(event => {
      const eventDate = new Date(event.date);

      switch (dateFilterType.value) {
        case 'day':
          if (!specificDateValue.value) return false;
          const filterDate = new Date(specificDateValue.value + 'T00:00:00');
          return eventDate.toDateString() === filterDate.toDateString();

        case 'week':
          if (!specificWeekValue.value) return false;
          const [yearW, weekW] = specificWeekValue.value.split('-W').map(Number);
          const [eventYearW, eventWeekW] = getWeekNumber(eventDate);
          return eventYearW === yearW && eventWeekW === weekW;

        case 'month':
          if (!specificMonthValue.value) return false;
          const [yearM, monthM] = specificMonthValue.value.split('-').map(Number);
          return eventDate.getFullYear() === yearM && (eventDate.getMonth() + 1) === monthM;

        case 'year':
          if (!specificYearValue.value) return false;
          return eventDate.getFullYear() === specificYearValue.value;

        default:
          return true;
      }
    });
  }

  // 3. Ordenar o resultado
  return history.sort((a, b) => {
    if (sortOrder.value === 'alpha') {
      return a.book.title.localeCompare(b.book.title);
    }
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA;
  });
});


// Funções de formatação (sem alterações)
const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};

const getBadgeClass = (eventType) => {
  const classMap = { 'Empréstimo': 'bg-warning text-dark', 'Devolução': 'bg-success', 'Exclusão de Livro': 'bg-danger', 'Exclusão de Usuário': 'bg-danger', 'Renovação': 'bg-info text-dark', 'Cadastro de Livro': 'bg-primary', 'Cadastro de Usuário': 'bg-primary', 'Edição de Livro': 'bg-secondary', 'Edição de Usuário': 'bg-secondary' };
  return classMap[eventType] || 'bg-light text-dark';
};

const getIconClass = (eventType) => {
    const iconMap = { 'Empréstimo': 'bi bi-box-arrow-up-right', 'Devolução': 'bi bi-box-arrow-in-down', 'Exclusão de Livro': 'bi bi-trash', 'Exclusão de Usuário': 'bi bi-trash', 'Renovação': 'bi bi-calendar-plus', 'Cadastro de Livro': 'bi bi-plus-circle', 'Cadastro de Usuário': 'bi bi-plus-circle', 'Edição de Livro': 'bi bi-pencil-square', 'Edição de Usuário': 'bi bi-pencil-square' };
    return iconMap[eventType] || 'bi bi-info-circle';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const formatDetails = (event) => {
  const title = `${event.book.title} ${event.book.code ? `<span class="text-muted small">(Cód: ${event.book.code})</span>` : ''}`;
  switch (event.type) {
    case 'Empréstimo': return `${title}<br><small class="text-muted">Devolver em: ${formatDate(event.dueDate)}</small>`;
    case 'Devolução': return event.loanDate ? `${title}<br><small class="text-muted">Emprestado em: ${formatDate(event.loanDate)}</small>` : title;
    case 'Renovação': return `${title}<br><small class="text-muted">De: ${formatDate(event.previousDueDate)} → Para: ${formatDate(event.newDueDate)}</small>`;
    default: return title;
  }
};

const uniqueActionTypes = computed(() => {
  const types = loanStore.history.map(event => event.type);
  return [...new Set(types)].sort();
});
</script>

<style scoped>
.table {
  vertical-align: middle;
}
</style>