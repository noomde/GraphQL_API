import { UsersController } from '../controller/usersController.js';

export default {
  Mutation: {
    /**
     * Registers a new user.
     *
     * @param {*} _ - The parent object.
     * @param {*} userData - The data for the user to be registered.
     * @returns {Promise<Object>} The new user object.
     */
    registerUser: async (_, { userData }) => {
      return await UsersController.registerUser(userData);
    },

    /**
     * Logs in a user.
     *
     * @param {*} _ - The parent object.
     * @param {*} username - The username.
     * @param {*} password - The password.
     * @returns {Promise<Object>} The user object.
     */
    loginUser: async (_, { username, password }) => {
      return await UsersController.loginUser(username, password);
    },
  },
};
