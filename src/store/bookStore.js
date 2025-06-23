import { defineStore } from 'pinia';

export const useBookStore = defineStore('books', {
  // STATE: Onde os dados do nosso "banco de dados" de livros ficam guardados.
  state: () => ({
    books: [], // Começa como um array vazio.
    nextBookId: 1, // Um contador para gerar IDs únicos.
  }),

  // GETTERS: Para calcular dados derivados do state.
  getters: {
    // Calcula o número total de cópias, somando as quantidades.
    totalBookCopies: (state) => {
      return state.books.reduce((total, book) => total + book.quantity, 0);
    },
    // Calcula quantos livros estão emprestados (lógica a ser implementada).
    loanedBooksCount: (state) => {
      // Simples por enquanto, vamos melhorar isso depois.
      return state.books.filter(book => book.status === 'emprestado').length;
    }
  },

  // ACTIONS: Funções para modificar o state. São nossas "transações" com o banco de dados.
  actions: {
    registerBook(bookData) {
      const newBook = {
        id: this.nextBookId++,
        code: bookData.code,
        title: bookData.title,
        author: bookData.author,
        genre: bookData.genre,
        quantity: bookData.quantity,
        available: bookData.quantity, // Cópias disponíveis começam igual à quantidade total.
        status: 'disponível'
      };
      this.books.push(newBook);
    },
  },
});