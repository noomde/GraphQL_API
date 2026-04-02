import { getPool } from '../config/database.js';

export class UsersRepository {
  /**
   * Finds a user by their username.
   *
   * @param {string} username - The username of the user to find.
   * @returns {Promise<object|null>} The user object if found, otherwise null.
   */
  async findUserByUsername(username) {
    const { rows } = await getPool().query(
      `SELECT id,
          username,
          password_hash AS "passwordHash"
        FROM users
        WHERE username = $1`,
      [username],
    );
    return rows[0] || null;
  }

  /**
   * Inserts a new user into the database.
   *
   * @param {string} username - The username of the new user.
   * @param {string} passwordHash - The hashed password of the new user.
   * @returns {Promise<object>} The inserted user object.
   */
  async insert(username, passwordHash) {
    const { rows } = await getPool().query(
      `INSERT INTO users (username, password_hash)
         VALUES ($1, $2)
         RETURNING id, username, password_hash AS "passwordHash"`,
      [username, passwordHash],
    );
    return rows[0];
  }
}
