import { defineStore } from 'pinia';
import { useBookStore } from './bookStore';

export const useLoanStore = defineStore('loan', {
  state: () => ({
    history: [],
    nextLoanId: 1,
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
      const loanEvent = this.history.find(e => e.loanId === loanId && e.type === 'Empréstimo');
      
      if (loanEvent) {
        const returnEvent = {
          type: 'Devolução',
          loanId: loanId,
          book: loanEvent.book,
          user: loanEvent.user,
          date: new Date().toISOString(),
        };
        this.history.push(returnEvent);
        bookStore.increaseAvailability(loanEvent.book.id);
      }
    },
    
    logUserDeletion(user) {
      const deletionEvent = {
        id: this.nextLoanId++,
        type: 'Exclusão de Usuário',
        book: { title: `Usuário: ${user.name}` }, 
        readerName: `ID: ${user.id}`,
        date: new Date(),
      };
      this.history.unshift(deletionEvent);
    },

    extendDueDate(loanId, newDueDate) {
      const loanEvent = this.history.find(event => event.loanId === loanId && event.type === 'Empréstimo');
      
      if (loanEvent) {
        loanEvent.dueDate = newDueDate;

        const extensionEvent = {
          type: 'Renovação',
          loanId: loanId,
          book: loanEvent.book,
          user: loanEvent.user,
          date: new Date().toISOString(),
          newDueDate: newDueDate,
        };
        this.history.push(extensionEvent);
        return true;
      }
      return false;
    },

  },

  persist: true
});