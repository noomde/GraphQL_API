import { getPool } from '../config/database.js';

export class ScoresRepository {
  /**
   * Retrieves all scores from the database.
   *
   * @returns {Promise<Array>} An array of score objects.
   */
  static async findAllScores(limit, offset) {
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
      LIMIT $1 OFFSET $2
      `,
      [limit, offset],
    );
    return rows;
  }

  /**
   * Retrieves the total count of scores in the database.
   *
   * @returns {Promise<number>} The total count of scores.
   */
  static async getTotalScoresCount() {
    const { rows } = await getPool().query(
      `
      SELECT COUNT(*) FROM scores
      `,
    );
    return parseInt(rows[0].count);
  }

  /**
   * Finds a score by its game ID.
   *
   * @param {number} gameId - The ID of the game to find the score for.
   * @returns {Promise<Object>} The score object or null if not found.
   */
  static async findScoreByGameId(gameId) {
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

  /**
   * Finds scores by multiple game IDs (for dataloader).
   *
   * @param {number[]} gameIds - An array of game IDs for which to find scores.
   * @returns {Promise<Array>} An array of score objects associated with the games.
   */
  static async findScoreByGameIds(gameIds) {
    const { rows } = await getPool().query(
      `
      SELECT
        game_id AS "gameId",
        metascore,
        metascore_count AS "metascoreCount",
        metascore_sentiment AS "metascoreSentiment",
        userscore AS "userScore",
        userscore_count AS "userScoreCount",
        userscore_sentiment AS "userScoreSentiment"
      FROM scores
      WHERE game_id = ANY($1)
      `,
      [gameIds],
    );
    return rows;
  }
}
