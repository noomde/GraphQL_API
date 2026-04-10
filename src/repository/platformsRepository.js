import { getPool } from '../config/database.js';

/**
 * Repository for handling database interactions related to platforms.
 */
export class PlatformsRepository {
  /**
   * Retrieves all platforms from the database.
   *
   * @returns {Promise<Array>} An array of platform objects.
   */
  async findAllPlatforms() {
    const { rows } = await getPool().query(
      `SELECT * FROM platforms ORDER BY id ASC`,
    );
    return rows;
  }

  /**
   * Finds a platform by its ID.
   *
   * @param {number} id - The ID of the platform to find.
   * @returns {Promise<Object>} The platform object or null if not found.
   */
  async findPlatformById(id) {
    const { rows } = await getPool().query(
      `SELECT * FROM platforms WHERE id = $1`,
      [id],
    );
    return rows[0] || null;
  }
}
