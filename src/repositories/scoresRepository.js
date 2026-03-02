import { getPool } from '../config/database.js';

export class ScoresRepository {
  /**
   * Retrieves all scores from the database.
   *
   * @returns {Promise<Array>} An array of score objects.
   */
  static async findAllScores() {
    const { rows } = await getPool().query(
      `
      SELECT
        metascore,
        metascore_count AS "metascoreCount",
        metascore_sentiment AS "metascoreSentiment",
        userscore AS "userScore",
        userscore_count AS "userScoreCount",
        userscore_sentiment AS "userScoreSentiment"
      FROM scores
      ORDER BY game_id ASC
      `,
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
    const { rows } = await getPool().query(
      `
      SELECT
        metascore,
        metascore_count AS "metascoreCount",
        metascore_sentiment AS "metascoreSentiment",
        userscore AS "userScore",
        userscore_count AS "userScoreCount",
        userscore_sentiment AS "userScoreSentiment"
      FROM scores
      WHERE game_id = $1
      `,
      [gameId],
    );
    return rows[0] || null;
  }
}
