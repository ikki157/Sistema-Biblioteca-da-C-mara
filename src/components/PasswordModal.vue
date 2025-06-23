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
import { ref, watch } from 'vue';
import { useAuthStore } from '@/store/auth';

// Define as propriedades e os eventos que o componente pode receber e emitir
const props = defineProps({
  modelValue: Boolean, // Controla se o modal está visível (usado com v-model)
});
const emit = defineEmits(['update:modelValue', 'success']);

const auth = useAuthStore();
const password = ref('');
const error = ref('');

// Função chamada pelo botão "Confirmar"
function confirmAction() {
  // Verifica a senha usando o authStore
  if (auth.verifyPassword(password.value)) {
    // Se a senha estiver correta:
    // 1. Emite o evento 'success', que a página SearchBookView está ouvindo.
    emit('success');
    // 2. Fecha o modal.
    closeModal();
  } else {
    // Se a senha estiver incorreta, mostra uma mensagem de erro.
    error.value = 'Senha incorreta. Tente novamente.';
  }
}

function closeModal() {
  // Reseta os campos ao fechar
  password.value = '';
  error.value = '';
  // Emite o evento para fechar o modal (atualiza o v-model na página pai)
  emit('update:modelValue', false);
}

// Observa a propriedade 'modelValue'. Se ela mudar para 'false' (ou seja, o modal for fechado),
// reseta os campos de erro e senha.
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    password.value = '';
    error.value = '';
  }
});
</script>