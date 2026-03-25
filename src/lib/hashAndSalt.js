import bcrypt from 'bcryptjs';

/**
 * Hashes and salts a password using bcrypt.
 *
 * @param {string} password - The password to be hashed and salted.
 * @returns {Promise<string>} The hashed and salted password.
 */
export async function hashAndSaltPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
