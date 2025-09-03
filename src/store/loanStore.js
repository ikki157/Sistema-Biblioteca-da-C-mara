import { defineStore } from 'pinia';

export const useLoanStore = defineStore('loan', {
  state: () => ({
    history: [],
    nextLoanId: 1,
    nextEventId: 1,
  }),

  getters: {
    totalLoans: (state) => state.history.filter(e => e.type === 'Empréstimo').length,

    totalReturns: (state) => state.history.filter(e => e.type === 'Devolução').length,
    
    currentlyLoanedCount: (state) => {
      const returnedLoanIds = new Set(
        state.history
          .filter(event => event.type === 'Devolução')
          .map(event => event.loanId)
      );

      const activeLoanCount = state.history.filter(event => 
        event.type === 'Empréstimo' && !returnedLoanIds.has(event.loanId)
      ).length;

      return activeLoanCount;
    },
  },

  actions: {
    
    
     // FUNÇÕES DE LOG
    logBookCreation(book) {
      this.history.unshift({ id: this.nextEventId++, type: 'Cadastro de Livro', book: { title: book.title, code: book.code }, user: { name: 'N/A' }, date: new Date().toISOString() });
    },
    logBookUpdate(book) {
      this.history.unshift({ id: this.nextEventId++, type: 'Edição de Livro', book: { title: book.title, code: book.code }, user: { name: 'N/A' }, date: new Date().toISOString() });
    },
    logBookDeletion(book) {
      this.history.unshift({ id: this.nextEventId++, type: 'Exclusão de Livro', book: { title: book.title, code: book.code }, user: { name: 'N/A' }, date: new Date().toISOString() });
    },
    logUserCreation(user) {
      this.history.unshift({ id: this.nextEventId++, type: 'Cadastro de Usuário', book: { title: `Usuário: ${user.name}` }, user: { name: user.name }, date: new Date().toISOString() });
    },
    logUserUpdate(user) {
      this.history.unshift({ id: this.nextEventId++, type: 'Edição de Usuário', book: { title: `Usuário: ${user.name}` }, user: { name: user.name }, date: new Date().toISOString() });
    },
    logUserDeletion(user) {
      this.history.unshift({ id: this.nextEventId++, type: 'Exclusão de Usuário', book: { title: `Usuário Excluído: ${user.name}` }, user: { name: 'N/A' }, date: new Date().toISOString() });
    },

// FUNÇÕES DE EMPRÉSTIMO
    async registerLoan(book, user, dueDate) {
      const { useBookStore } = await import('./bookStore');
      const bookStore = useBookStore();
            
      if (book.available > 0) { 
        const loanEvent = {
          loanId: this.nextLoanId,
          id: this.nextEventId++,
          type: 'Empréstimo',
          book: { id: book.id, title: book.title },
          user: { id: user.id, name: user.name },
          date: new Date().toISOString(),
          dueDate: dueDate,
        };

        this.history.unshift(loanEvent);
        this.nextLoanId++;
        bookStore.decreaseAvailability(book.id);

      } else {
        console.error('Livro não disponível para empréstimo');
        return false;
      }
    },

    async registerReturn(loanId) {
      const { useBookStore } = await import('./bookStore');
      const bookStore = useBookStore();
      const loanEvent = this.history.find(e => e.loanId === loanId && e.type === 'Empréstimo');
      if (loanEvent) {
        this.history.unshift({ 
            id: this.nextEventId++, 
            type: 'Devolução', 
            loanId: loanId, 
            book: loanEvent.book, 
            user: loanEvent.user, 
            date: new Date().toISOString(),
            loanDate: loanEvent.date,
        });
        const book = bookStore.getBookById(loanEvent.book.id);
        if (book) {
          bookStore.increaseAvailability(loanEvent.book.id);
        } else {
          console.warn(`Devolução registrada para um livro que não existe mais no acervo (ID: ${loanEvent.book.id}). O empréstimo foi finalizado no histórico.`)
        }
      }
    },

     extendDueDate(loanId, newDueDate) {
      
      const originalLoan = this.history.find(e => e.loanId === loanId && e.type === 'Empréstimo');
      if (!originalLoan) {
        return false;
      }

      const latestRenewal = this.history.find(e => e.loanId === loanId && e.type === 'Renovação');
      
      
      const previousDueDate = latestRenewal ? latestRenewal.newDueDate : originalLoan.dueDate;

      this.history.unshift({ 
          id: this.nextEventId++, 
          type: 'Renovação', 
          loanId: loanId, 
          book: originalLoan.book, 
          user: originalLoan.user, 
          date: new Date().toISOString(), 
          previousDueDate: previousDueDate, 
          newDueDate: newDueDate,
      });

      return true;
    },

  },

  persist: true,
});