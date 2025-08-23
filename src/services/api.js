import axios from 'axios';


const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  registerBook(bookData) {
    return apiClient.post('/books', bookData);
  },

  getDashboardStats() {
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: {
            totalBooks: 1250,
            loanedBooks: 78,
            totalLoans: 4321,
            returnsToday: 12
          }
        });
      }, 500);
    });
  }

};