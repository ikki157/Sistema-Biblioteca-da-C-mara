import { defineStore } from 'pinia';
import { useBookStore } from './bookStore';

export const useLoanStore = defineStore('loans', {
  // STATE: Onde guardamos o histórico de todas as transações.
  state: () => ({
    history: [],
    nextHistoryId: 1,
  }),

  // GETTERS: Para calcular dados.
  getters: {
    // Retorna o número total de eventos de empréstimo.
    totalLoans: (state) => {
      return state.history.filter(event => event.type === 'Empréstimo').length;
    },
    // Calcula quantos livros estão atualmente emprestados.
    currentlyLoanedCount: (state) => {
      const loanedBooks = new Set();
      // Itera sobre o histórico de trás para frente para performance.
      for (let i = state.history.length - 1; i >= 0; i--) {
        const event = state.history[i];
        if (event.type === 'Empréstimo' && !loanedBooks.has(event.loanId)) {
          loanedBooks.add(event.loanId);
        }
      }
      return loanedBooks.size;
    },
  },

  // ACTIONS: Funções que modificam o estado.
  actions: {
    registerLoan(bookId, readerName) {
      const bookStore = useBookStore();
      // Tenta atualizar o status do livro no bookStore primeiro.
      const success = bookStore.updateBookStatus(bookId, 'loan');
      
      if (success) {
        const book = bookStore.getBookById(bookId);
        const loanEvent = {
          id: this.nextHistoryId++,
          loanId: `${bookId}-${new Date().getTime()}`, // ID único para este empréstimo específico
          type: 'Empréstimo',
          book: { ...book }, // Salva uma cópia dos dados do livro no momento do empréstimo
          readerName: readerName,
          date: new Date(),
        };
        this.history.unshift(loanEvent); // Adiciona no início do array
        return true;
      }
      return false;
    },

    registerReturn(loanId) {
      const bookStore = useBookStore();
      const loanEvent = this.history.find(event => event.loanId === loanId && event.type === 'Empréstimo');
      
      if (loanEvent) {
        // Atualiza o status do livro original
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