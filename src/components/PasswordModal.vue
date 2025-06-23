<template>
  <div v-if="modelValue" class="modal-backdrop fade show"></div>
  <div 
    v-if="modelValue" 
    class="modal fade show" 
    tabindex="-1" 
    style="display: block;"
    @click.self="$emit('update:modelValue', false)"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirmar Ação com Senha</h5>
          <button type="button" class="btn-close" @click="$emit('update:modelValue', false)"></button>
        </div>
        <div class="modal-body">
          <p>Para sua segurança, por favor, insira sua senha novamente.</p>
          <form @submit.prevent="confirm">
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
             <div class="modal-footer pb-0">
              <button @click="$emit('update:modelValue', false)" type="button" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">Confirmar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// O script permanece exatamente o mesmo da versão anterior
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';

const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(['update:modelValue', 'success']);

const auth = useAuthStore();
const password = ref('');
const error = ref('');

function confirm() {
  if (auth.verifyPassword(password.value)) {
    emit('success');
    emit('update:modelValue', false);
    password.value = '';
    error.value = '';
  } else {
    error.value = 'Senha incorreta. Tente novamente.';
  }
}
</script>