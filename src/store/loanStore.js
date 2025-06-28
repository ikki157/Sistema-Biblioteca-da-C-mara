import { defineStore } from 'pinia';
import { useBookStore } from './bookStore';

export const useLoanStore = defineStore('loans', {
  state: () => ({
    history: [],
    nextHistoryId: 1,
  }),

  getters: {
    totalLoans: (state) => state.history.filter(e => e.type === 'Empréstimo').length,
    totalReturns: (state) => state.history.filter(e => e.type === 'Devolução').length,
    currentlyLoanedCount: (state) => {
      const activeLoans = new Set();
      state.history.forEach(event => {
        if (event.type === 'Empréstimo') {
          activeLoans.add(event.loanId);
        } else if (event.type === 'Devolução') {
          activeLoans.delete(event.loanId);
        }
      });
      return activeLoans.size;
    },
  },

  actions: {
    /**
     * Lógica de Empréstimo Corrigida
     */
    registerLoan(bookId, readerName) {
      const bookStore = useBookStore();
      
      // 1. Pergunta ao Acervo se o livro pode ser emprestado.
      const success = bookStore.updateBookStatus(bookId, 'loan');
      
      // 2. Só se o Acervo permitir, o empréstimo é registado no histórico.
      if (success) {
        const book = bookStore.getBookById(bookId);
        const loanEvent = {
          id: this.nextHistoryId++,
          loanId: `${book.id}-${new Date().getTime()}`,
          type: 'Empréstimo',
          book: { ...book },
          readerName: readerName,
          date: new Date(),
        };
        this.history.unshift(loanEvent);
        return true;
      }
      return false; // Se o Acervo negar, a operação falha.
    },

    /**
     * Lógica de Devolução Corrigida
     */
    registerReturn(loanId) {
      const bookStore = useBookStore();
      const loanEvent = this.history.find(e => e.loanId === loanId);
      
      if (loanEvent) {
        // 1. Avisa o Acervo que um livro está a ser devolvido.
        const success = bookStore.updateBookStatus(loanEvent.book.id, 'return');

        // 2. Só se o Acervo confirmar, a devolução é registada no histórico.
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
    
    logUserDeletion(user) {
      const deletionEvent = {
        id: this.nextHistoryId++,
        type: 'Exclusão de Usuário',
        book: { title: `Usuário: ${user.name}` }, 
        readerName: `ID: ${user.id}`,
        date: new Date(),
      };
      this.history.unshift(deletionEvent);
    }
  },
});