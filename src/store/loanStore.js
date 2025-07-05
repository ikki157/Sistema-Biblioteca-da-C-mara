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
    
    registerLoan(book, user, dueDate) {
      const bookStore = useBookStore();
            
      if (book.available > 0) { 
        const loanEvent = {
          loanId: this.nextLoanId,
          type: 'Empréstimo',
          book: { id: book.id, title: book.title },
          user: { id: user.id, name: user.name },
          date: new Date().toISOString(),
          dueDate: dueDate,
        };

        this.history.push(loanEvent);
        this.nextLoanId++;
        bookStore.decreaseAvailability(book.id);
      } else {
        console.error('Livro não disponível para empréstimo');
        return false;
      }
    },

    
    registerReturn(loanId) {
      const bookStore = useBookStore();
      const loanEvent = this.history.find(e => e.loanId === loanId);
      
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