import { getPool } from '../config/database.js';

/**
 * Repository for handling database interactions related to users.
 */
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

  /**
   * Finds or creates a user based on OAuth provider and provider ID.
   *
   * @param {string} provider - The OAuth provider (example github).
   * @param {string} providerId - The unque id from the OAuth provider (example github id).
   * @param {string} username - The username of the user to be created if not found.
   * @returns {Promise<object>} The user object found or created based on the OAuth provider and provider ID.
   */
  async findOrCreateOAuthUser(provider, providerId, username) {
    await getPool().query(
      `INSERT INTO users (provider, provider_id, username, password_hash)
        VALUES ($1, $2, $3, NULL)
        ON CONFLICT (provider, provider_id) DO NOTHING`,
      [provider, providerId, username],
    );

    const { rows } = await getPool().query(
      `SELECT id,
        username,
        provider,
        provider_id AS "providerId",
        password_hash AS "passwordHash"
      FROM users
      WHERE provider = $1 AND provider_id = $2`,
      [provider, providerId],
    );

    return rows[0];
  }
}
