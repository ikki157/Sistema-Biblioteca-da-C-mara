import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    nextUserId: 1,
  }),

  getters: {
    totalUsers: (state) => state.users.length,
    getUserById: (state) => (userId) => {
      return state.users.find(user => user.id === userId);
    }
  },

  actions: {
    async registerUser(userData) {

      const { useLoanStore } = await import('./loanStore');
      const loanStore = useLoanStore();
      const newUser = {
        id: this.nextUserId++,
        name: userData.name,
        numIdent: userData.numIdent,
        dateNasc: userData.dateNasc,
        address: userData.address,
        phone: userData.phone,
        email: userData.email,
      };
      this.users.push(newUser);
      loanStore.logUserCreation(newUser);
      return newUser;
    },

    deleteUser(userId) {
      const userIndex = this.users.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        this.users.splice(userIndex, 1);
      }
    },

    async editUser(userId, updatedData) {

      const { useLoanStore } = await import('./loanStore');
      const loanStore = useLoanStore();
      const user = this.getUserById(userId);
      if (user) {
        Object.assign(user, updatedData);
        loanStore.logUserUpdate(user);
      }
    },

    findUserById(userId) {
      return this.users.find(user => user.id === parseInt(userId));
    },
  },

  persist: true,
});