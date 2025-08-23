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
            date: new Date().toISOString() 
        });
        const book = bookStore.getBookById(loanEvent.book.id);
        if (book) {
          bookStore.increaseAvailability(loanEvent.book,id);
        } else {
          console.warn(`Devolução registrada para um livro que não existe mais no acervo (ID: ${loanEvent.book.id}). O empréstimo foi finalizado no histórico.`)
        }
        bookStore.increaseAvailability(loanEvent.book.id);
      }
    },

    extendDueDate(loanId, newDueDate) {
      const loanEvent = this.history.find(event => event.loanId === loanId && event.type === 'Empréstimo');
      if (loanEvent) {
        loanEvent.dueDate = newDueDate;
        this.history.unshift({ 
            id: this.nextEventId++, 
            type: 'Renovação', 
            loanId: loanId, 
            book: loanEvent.book, 
            user: loanEvent.user, 
            date: new Date().toISOString(), 
            newDueDate: newDueDate 
        });
        return true;
      }
      return false;
    },
  },

  persist: true,
});