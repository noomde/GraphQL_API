import { pool } from '../config/database.js'

/**
 * Finds a user by their username.
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<object|null>} The user object if found, otherwise null.
 */
export const findUserByUsername = async (username) => {
    const { rows } = await pool.query(
        `SELECT id, username, password_hash
         FROM users
         WHERE username = $1`,
        [username]
    )
    return rows[0] || null
}

/**
 * Inserts a new user into the database.
 *
 * @param {string} username - The username of the new user.
 * @param {string} passwordHash - The hashed password of the new user.
 * @returns {Promise<object>} The inserted user object.
 */
export const insert = async (username, passwordHash) => {
    const { rows } = await pool.query(
        `INSERT INTO users (username, password_hash)
         VALUES ($1, $2)
         RETURNING id, username`,
        [username, passwordHash]
    )
    return rows[0]
}