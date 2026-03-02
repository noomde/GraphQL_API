import { UsersRepository } from '../repositories/usersRepository.js';
import { ApolloError } from 'apollo-server-errors';
import bcrypt from 'bcrypt';
import { JsonWebToken } from '../lib/jsonWebToken.js';

export class UsersController {
  /**
   * Registers a new user in the repository.
   *
   * @param {string} username - The username of the user to be registered.
   * @param {string} password - The password of the user to be registered.
   * @returns {Promise<Object>} The newly created user object.
   */
  static async registerUser(username, password) {
    const existingUser = await UsersRepository.findUserByUsername(
      username,
    );
    if (existingUser) {
      throw new ApolloError('User already exists');
    }

    // salt and hash the password before storing it in the database
    const passwordHash = await this.hashAndSaltPassword(password);

    return await UsersRepository.insert(username, passwordHash);
  }

  /**
   * Logs in a user by verifying their credentials and generating a JWT token.
   *
   * @param {string} username - The username of the user to be logged in.
   * @param {string} password - The password of the user to be logged in.
   * @returns {Promise<Object>} The authentication payload containing the JWT token.
   */
  static async loginUser(username, password) {
    const user = await UsersRepository.findUserByUsername(username);
    if (!user) {
      throw new ApolloError('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new ApolloError('Invalid credentials');
    }

    const token = await JsonWebToken.encodeUser(user, '1h');

    return { token };
  }

  static async hashAndSaltPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}
