import UsersController from '../controller/usersController.js';

const usersController = new UsersController();

export default {
  Mutation: {
    /**
     * Registers a new user.
     *
     * @param {object} _ - The parent object.
     * @param {string} username - The username.
     * @param {string} password - The password.
     * @returns {Promise<Object>} The new user object.
     */
    registerUser: async (_, { username, password }) => {
      return await usersController.registerUser(username, password);
    },

    /**
     * Logs in a user.
     *
     * @param {object} _ - The parent object.
     * @param {string} username - The username.
     * @param {string} password - The password.
     * @returns {Promise<Object>} The user object.
     */
    loginUser: async (_, { username, password }) => {
      return await usersController.loginUser(username, password);
    },

    /**
     * Logs in a user using OAuth.
     * @param {object} _ - The parent object.
     * @param {string} provider - The OAuth provider (example github).
     * @param {string} providerId - The unque id from the OAuth provider (example github id).
     * @param {string} username - The username.
     * @returns {Promise<Object>} The user object.
     */
    oauthLoginUser: async (_, { provider, providerId, username }) => {
      return await usersController.oauthLoginUser(
        provider,
        providerId,
        username,
      );
    },
  },
};
