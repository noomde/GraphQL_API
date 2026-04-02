import UsersController from '../controller/usersController.js';

const usersController = new UsersController();

export default {
  Mutation: {
    /**
     * Registers a new user.
     *
     * @param {*} _ - The parent object.
     * @param {*} userData - The data for the user to be registered.
     * @returns {Promise<Object>} The new user object.
     */
    registerUser: async (_, { username, password }) => {
      return await usersController.registerUser(username, password);
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
      return await usersController.loginUser(username, password);
    },
  },
};
