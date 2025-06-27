import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    nextUserId: 1,
  }),

getters: {
    getUserById: (state) => (userId) => {
      return state.users.find(user => user.id === userId);
    }
  },

  actions: {
    registerUser(userData) {
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
    }
  },

   deleteUser(userId) {
    const userIndex = this.users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
    }
   },

   editUser(userId, updatedData) {
    const user = this.getUserById(userId);
    if (user) {
      Object.assign(user, updatedData);
    }
  },

});