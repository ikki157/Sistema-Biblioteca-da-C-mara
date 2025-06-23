<template>
  <footer class="bg-dark text-white mt-auto py-3">
    <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center">
      <div class="d-flex align-items-center mb-2 mb-md-0">
        <img src="@/assets/logo-camara.svg" alt="Logo Câmara" width="24" height="24" class="me-2">
        <span class="text-muted">&copy; {{ new Date().getFullYear() }} Biblioteca da Câmara</span>
      </div>
      <div class="text-center text-md-end">
        <small>Endereço: Rua Fictícia, 123 | Contato:
          <a href="https://wa.me/5511999999999" target="_blank" class="text-white">WhatsApp</a>
        </small>
      </div>
    </div>
  </footer>
</template>