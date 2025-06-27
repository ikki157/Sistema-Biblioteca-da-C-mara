import { defineStore } from 'pinia';

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
        if (event.type === 'Empréstimo') activeLoans.add(event.loanId);
        else if (event.type === 'Devolução') activeLoans.delete(event.loanId);
      });
      return activeLoans.size;
    },
  },

  actions: {
    registerLoan(book, readerName) {
      const loanEvent = {
        id: this.nextHistoryId++,
        loanId: `${book.id}-${new Date().getTime()}`,
        type: 'Empréstimo',
        book: { ...book },
        readerName: readerName,
        date: new Date(),
      };
      this.history.unshift(loanEvent);
    },

    registerReturn(loanId) {
      const loanEvent = this.history.find(e => e.loanId === loanId);
      if (loanEvent) {
        const returnEvent = {
          id: this.nextHistoryId++,
          loanId: loanId,
          type: 'Devolução',
          book: { ...loanEvent.book },
          readerName: loanEvent.readerName,
          date: new Date(),
        };
        this.history.unshift(returnEvent);
      }
    },
    
    // Ação para registrar a exclusão de um usuário no histórico.
    logUserDeletion(user) {
      const deletionEvent = {
        id: this.nextHistoryId++,
        type: 'Exclusão de Usuário',
        // Não temos um livro aqui, então guardamos os dados do usuário.
        book: { title: `Usuário: ${user.name}` }, 
        readerName: `ID: ${user.id}`, // Guardamos o ID para referência
        date: new Date(),
      };
      this.history.unshift(deletionEvent);
    }
  },
});