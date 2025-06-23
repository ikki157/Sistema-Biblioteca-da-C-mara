<template>
  <div class="d-flex flex-column min-vh-100 bg-light">
    <AppHeader v-if="auth.isAuthenticated" />
    <main class="flex-grow-1">
      <div class="container py-4">
        <RouterView />
      </div>
    </main>
    <AppFooter v-if="auth.isAuthenticated" />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useAuthStore } from '@/store/auth'
const auth = useAuthStore()
</script>