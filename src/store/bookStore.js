import { defineStore } from 'pinia';

export const useBookStore = defineStore('books', {
  state: () => ({
    books: [],
    nextBookId: 1,
  }),

  getters: {
    totalBookCopies: (state) => {
      return state.books.reduce((total, book) => total + book.quantity, 0);
    },
    loanedBooksCount: (state) => {
      return state.books.filter(book => book.status === 'emprestado').length;
    },
    // Novo getter para encontrar um livro pelo ID
    getBookById: (state) => {
      return (bookId) => state.books.find(book => book.id === bookId);
    }
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
        status: 'disponível'
      };
      this.books.push(newBook);
    },
    // NOVA AÇÃO: Excluir um livro
    deleteBook(bookId) {
      const bookIndex = this.books.findIndex(book => book.id === bookId);
      if (bookIndex !== -1) {
        this.books.splice(bookIndex, 1);
      }
    },
    // NOVA AÇÃO: Registrar um empréstimo (atualiza a disponibilidade)
    registerLoan(bookId) {
      const book = this.getBookById(bookId);
      if (book && book.available > 0) {
        book.available--;
        // Futuramente, podemos mudar o status se available for 0
        return true; // Sucesso
      }
      return false; // Falha (livro não encontrado ou indisponível)
    },
  },
});