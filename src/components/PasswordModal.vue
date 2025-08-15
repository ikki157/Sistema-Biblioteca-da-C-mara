<template>
  <div v-if="modelValue" class="modal-backdrop fade show"></div>
  
  <div 
    v-if="modelValue" 
    class="modal fade show" 
    tabindex="-1" 
    style="display: block;"
    @click.self="closeModal"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirmar Ação com Senha</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p class="text-muted">Para sua segurança, por favor, insira sua senha novamente.</p>
          
          <form @submit.prevent="confirmAction">
            <div class="mb-3">
              <label for="password-confirm" class="form-label">Senha</label>
              <input 
                ref="passwordInput"
                v-model="password"
                type="password" 
                id="password-confirm"
                class="form-control"
                :class="{ 'is-invalid': error }"
                required
              />
              <div v-if="error" class="invalid-feedback">
                {{ error }}
              </div>
            </div>
            <div class="modal-footer pb-0 px-0">
              <button @click="closeModal" type="button" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">Confirmar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { useAuthStore } from '@/store/auth';

const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(['update:modelValue', 'success']);

const auth = useAuthStore();
const password = ref('');
const error = ref('');
const passwordInput = ref(null); // Referência para o campo de input

function confirmAction() {
  console.log('1. Botão "Confirmar" do modal foi clicado.');

  if (auth.verifyPassword(password.value)) {
    console.log('2. Senha correta! O modal vai emitir o sinal de "success".');
    emit('success');
    closeModal();
  } else {
    console.log('ERRO: A senha digitada está incorreta.');
    error.value = 'Senha incorreta. Tente novamente.';
  }
}

function closeModal() {
  emit('update:modelValue', false);
}

// Observa a visibilidade do modal
watch(() => props.modelValue, (newValue) => {
  // Se o modal se tornou visível
  if (newValue) {
    // nextTick garante que o DOM foi atualizado ANTES de tentarmos focar no input
    nextTick(() => {
      passwordInput.value?.focus();
    });
  } else {
    // Se o modal foi fechado, limpa os campos
    password.value = '';
    error.value = '';
  }
});
</script>