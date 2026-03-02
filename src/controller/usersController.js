import { UsersRepository } from '../repositories/usersRepository.js';
import { ApolloError } from 'apollo-server-errors';
import bcrypt from 'bcrypt';
import { JsonWebToken } from '../lib/jsonWebToken.js';

export class UsersController {
  /**
   * Registers a new user in the repository.
   *
   * @param {object} userData - The data for the user to be registered, including username and password.
   * @returns
   */
  static async registerUser(userData) {
    const existingUser = await UsersRepository.findUserByUsername(
      userData.username,
    );
    if (existingUser) {
      throw new ApolloError('User already exists');
    }

    // salt and hash the password before storing it in the database
    const passwordHash = await this.hashAndSaltPassword(userData.password);

    return await UsersRepository.insert(userData.username, passwordHash);
  }

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
