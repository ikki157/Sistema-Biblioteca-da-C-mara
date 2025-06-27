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