import { defineStore } from 'pinia';

export const useBookStore = defineStore('books', {
  state: () => ({
    books: [],
    nextBookId: 1,
  }),

  getters: {
    totalBookCopies: (state) => state.books.reduce((total, book) => total + book.quantity, 0),
    getBookById: (state) => (bookId) => state.books.find(book => book.id === bookId),
    // Adiciona um getter para livros emprestados baseado em um array interno
    getLoanedBookEvents(state) {
      const loanStore = useLoanStore(); // Dependência do outro store
      return loanStore.getActiveLoans();
    }
  },

  actions: {
    registerBook(bookData) {
      const newBook = {
        id: this.nextBookId++,
        code: bookData.code, title: bookData.title, author: bookData.author,
        genre: bookData.genre, quantity: bookData.quantity,
        available: bookData.quantity, loanedOut: 0,
      };
      this.books.push(newBook);
    },
    deleteBook(bookId) {
      const bookIndex = this.books.findIndex(book => book.id === bookId);
      if (bookIndex !== -1) this.books.splice(bookIndex, 1);
    },
    // Ação central para mudar o status de um livro
    updateBookStatus(bookId, actionType) {
      const book = this.getBookById(bookId);
      if (!book) return false;

      if (actionType === 'loan' && book.available > 0) {
        book.available--;
        book.loanedOut++;
        return true;
      } else if (actionType === 'return' && book.loanedOut > 0) {
        book.available++;
        book.loanedOut--;
        return true;
      }
      return false;
    },
  },
});