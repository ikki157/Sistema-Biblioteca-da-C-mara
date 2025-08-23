import { defineStore } from 'pinia';

export const useBookStore = defineStore('books', {
  state: () => ({
    books: [],
    nextBookId: 1,
  }),

  getters: {
    totalBookCopies: (state) => state.books.reduce((total, book) => total + book.quantity, 0),
    getBookById: (state) => (bookId) => state.books.find(book => book.id === bookId),
    bookCodes: (state) => new Set(state.books.map(book => book.code)),
    systemIds: (state) => new Set(state.books.map(book => book.systemId)),
  },

  actions: {
    async registerBook(bookData) {

      const { useLoanStore } = await import('./loanStore');
      const loanStore = useLoanStore();

      const newBook = {
        id: this.nextBookId++,
        title: bookData.title,
        subtitle: bookData.subtitle,
        author: bookData.author,
        genre: bookData.genre,
        publisher: bookData.publisher,
        publicationPlace: bookData.publicationPlace,
        publicationYear: bookData.publicationYear,
        cdd: bookData.cdd,
        cutter: bookData.cutter,
        edition: bookData.edition,
        topicSubject: bookData.topicSubject,
        language: bookData.language,
        acquisitionType: bookData.acquisitionType,
        collectionSeries: bookData.collectionSeries,
        materialType: bookData.materialType,
        code: bookData.code,
        systemId: bookData.systemId,
        quantity: bookData.quantity,
        available: bookData.quantity,
        loanedOut: 0,
        bookImage: bookData.bookImage,
      };
      this.books.push(newBook);
      return newBook;
    },

    deleteBook(bookId) {

      const bookIndex = this.books.findIndex(book => book.id === bookId);
      if (bookIndex !== -1) {
        const bookToDelete = this.books[bookIndex];
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

    decreaseAvailability(bookId) {
      const book = this.getBookById(bookId);
      if (book && book.available > 0) {
        book.available--;
        book.loanedOut++;
      }
    },

    increaseAvailability(bookId) {
      const book = this.getBookById(bookId);
      if (book) {
        book.available++;
        book.loanedOut--;
      }
    },

    async editBook(bookId, updatedData) {

      const { useLoanStore } = await import('./loanStore');
      const loanStore = useLoanStore();
      const book = this.getBookById(bookId);
      if (book) {
        const quantityDifference = updatedData.quantity - book.quantity;
        book.available += quantityDifference;

        Object.assign(book, updatedData);
        loanStore.logBookUpdate(book);
      }
    },
  },

  persist: true,
});