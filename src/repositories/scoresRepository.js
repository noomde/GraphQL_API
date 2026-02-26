import { pool } from '../config/database.js';

export class ScoresRepository {
  /**
   * Retrieves all scores from the database.
   *
   * @returns {Promise<Array>} An array of score objects.
   */
  static async findAllScores() {
    const { rows } = await pool.query(
      `SELECT * FROM scores ORDER BY game_id ASC`,
    );
    return rows;
  }

  /**
   * Finds a score by its game ID.
   *
   * @param {number} gameId - The ID of the game to find the score for.
   * @returns {Promise<Object>} The score object or null if not found.
   */
  static async findScoreById(gameId) {
    const { rows } = await pool.query(
      `SELECT * FROM scores WHERE game_id = $1`,
      [gameId],
    );
    return rows[0] || null;
  }
}
