import { defineStore } from 'pinia';
import { useBookStore } from './bookStore';

export const useLoanStore = defineStore('loans', {
  state: () => ({
    history: [],
    nextHistoryId: 1,
  }),

  getters: {
    totalLoans: (state) => {
      return state.history.filter(event => event.type === 'Empréstimo').length;
    },
    
    // NOVO GETTER: Conta o total de eventos de devolução.
    totalReturns: (state) => {
      return state.history.filter(event => event.type === 'Devolução').length;
    },

    // LÓGICA CORRIGIDA: Calcula quantos livros estão emprestados *agora*.
    currentlyLoanedCount: (state) => {
      const loanedIds = new Set();
      const returnedIds = new Set();

      // Mapeia todos os empréstimos e devoluções pelos seus IDs únicos.
      state.history.forEach(event => {
        if (event.type === 'Empréstimo') {
          loanedIds.add(event.loanId);
        } else if (event.type === 'Devolução') {
          returnedIds.add(event.loanId);
        }
      });

      // Remove os IDs que já foram devolvidos do conjunto de emprestados.
      returnedIds.forEach(id => {
        loanedIds.delete(id);
      });

      // O tamanho final do conjunto é o número de empréstimos ativos.
      return loanedIds.size;
    },
  },

  actions: {
    registerLoan(bookId, readerName) {
      const bookStore = useBookStore();
      const success = bookStore.updateBookStatus(bookId, 'loan');
      
      if (success) {
        const book = bookStore.getBookById(bookId);
        const loanEvent = {
          id: this.nextHistoryId++,
          loanId: `${bookId}-${new Date().getTime()}`,
          type: 'Empréstimo',
          book: { ...book },
          readerName: readerName,
          date: new Date(),
        };
        this.history.unshift(loanEvent);
        return true;
      }
      return false;
    },

    registerReturn(loanId) {
      const bookStore = useBookStore();
      const loanEvent = this.history.find(event => event.loanId === loanId && event.type === 'Empréstimo');
      
      if (loanEvent) {
        const success = bookStore.updateBookStatus(loanEvent.book.id, 'return');
        if (success) {
          const returnEvent = {
            id: this.nextHistoryId++,
            loanId: loanId,
            type: 'Devolução',
            book: { ...loanEvent.book },
            readerName: loanEvent.readerName,
            date: new Date(),
          };
          this.history.unshift(returnEvent);
          return true;
        }
      }
      return false;
    },
  },
});