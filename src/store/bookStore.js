import { defineStore } from 'pinia';
import { useLoanStore } from './loanStore';

export const useBookStore = defineStore('books', {
  state: () => ({
    books: [],
    nextBookId: 1,
  }),

  getters: {
    totalBookCopies: (state) => state.books.reduce((total, book) => total + book.quantity, 0),
    getBookById: (state) => (bookId) => state.books.find(book => book.id === bookId),
  },

  actions: {
    registerBook(bookData) {
      const newBook = {
        id: this.nextBookId++,
        code: bookData.code,
        title: bookData.title,
        author: bookData.author,
        genre: bookData.genre,
        quantity: bookData.quantity,
        available: bookData.quantity,
        loanedOut: 0,
      };
      this.books.push(newBook);
    },

    deleteBook(bookId) {
      const loanStore = useLoanStore();
      const bookIndex = this.books.findIndex(book => book.id === bookId);
      if (bookIndex !== -1) {
        const bookToDelete = this.books[bookIndex];
        loanStore.logBookDeletion(bookToDelete);
        this.books.splice(bookIndex, 1);
      }
    },

    /**
     * Ação central e crucial para mudar o status de um livro.
     * Esta é a única função que deve alterar a disponibilidade.
     */
    updateBookStatus(bookId, actionType) {
      const book = this.getBookById(bookId);
      if (!book) return false;

      // Se a ação é um empréstimo E há livros disponíveis
      if (actionType === 'loan' && book.available > 0) {
        book.available--;
        book.loanedOut++;
        return true; // Sucesso
      } 
      // Se a ação é uma devolução E há livros emprestados para devolver
      else if (actionType === 'return' && book.loanedOut > 0) {
        book.available++;
        book.loanedOut--;
        return true; // Sucesso
      }

      // Se nenhuma condição for atendida, a ação falha.
      return false;
    },
  },
});