import axios from 'axios';

// Configura uma instância base do axios.
// No futuro, você pode trocar 'http://localhost:3000/api' pela URL real do seu backend.
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Funções que representam cada endpoint da nossa API
export default {
  // === Livros ===
  registerBook(bookData) {
    // Envia um POST para http://localhost:3000/api/books
    return apiClient.post('/books', bookData);
  },

  // === Dashboard ===
  getDashboardStats() {
    // Busca os dados em http://localhost:3000/api/dashboard-stats
    // Como é uma simulação, retornamos dados falsos após um pequeno atraso.
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: {
            totalBooks: 1250,
            loanedBooks: 78,
            totalLoans: 4321,
            returnsToday: 12
          }
        });
      }, 500); // Simula 0.5s de espera da rede
    });
  }

  // ...aqui você adicionaria outras funções:
  // searchBooks(query) { ... }
  // registerLoan(loanData) { ... }
};