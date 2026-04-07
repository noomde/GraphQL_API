import { ApolloError } from 'apollo-server-errors';
import bcrypt from 'bcryptjs';

import { hashAndSaltPassword } from '../lib/hashAndSalt.js';
import { JsonWebToken } from '../lib/jsonWebToken.js';
import { UsersRepository } from '../repository/usersRepository.js';
import { checkUsernameRegex } from '../util/sanitize.js';

/**
 * Responsible for handling business logic for users.
 */
export default class UsersController {
  #usersRepository;

  /**
   * Creates an instance of UsersController.
   *
   * @param {UsersRepository} usersRepository - The repository for handling user data interactions.
   */
  constructor(usersRepository = new UsersRepository()) {
    this.#usersRepository = usersRepository;
  }
  /**
   * Registers a new user in the repository.
   *
   * @param {string} username - The username of the user to be registered.
   * @param {string} password - The password of the user to be registered.
   * @returns {Promise<Object>} The newly created user object.
   */
  async registerUser(username, password) {
    checkUsernameRegex(username);

    const existingUser =
      await this.#usersRepository.findUserByUsername(username);
    if (existingUser) {
      throw new ApolloError('User already exists', 'USER_ALREADY_EXISTS');
    }

    // salt and hash the password before storing it in the database
    const passwordHash = await hashAndSaltPassword(password);

    return await this.#usersRepository.insert(username, passwordHash);
  }

  /**
   * Logs in a user by verifying their credentials and generating a JWT token.
   *
   * @param {string} username - The username of the user to be logged in.
   * @param {string} password - The password of the user to be logged in.
   * @returns {Promise<Object>} The authentication payload containing the JWT token.
   */
  async loginUser(username, password) {
    const user = await this.#usersRepository.findUserByUsername(username);
    if (!user) {
      throw new ApolloError('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new ApolloError('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const token = await JsonWebToken.encodeUser(user, '1h');

    return { token };
  }
}
