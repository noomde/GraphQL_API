import { getPool } from '../config/database.js';

export class GamePlatformsRepository {
  /**
   * Finds platforms associated with a specific game ID.
   *
   * @param {number} gameId - The ID of the game for which to find platforms.
   * @returns {Promise<Array>} An array of platform objects associated with the game.
   */
  static async findGamePlatformsByGameId(gameId) {
    const { rows } = await getPool().query(
      `SELECT 
            platforms.id, 
            platforms.name,
            game_platforms.platform_metascore AS "platformMetascore"
         FROM game_platforms
         JOIN platforms ON platforms.id = game_platforms.platform_id
         WHERE game_platforms.game_id = $1`,
      [gameId],
    );
    return rows;
  }

  /**
   * Finds platforms associated with multiple game IDs (for dataloader).
   *
   * @param {number[]} gameIds - An array of game IDs for which to find platforms.
   * @returns {Promise<Array>} An array of platform objects associated with the games.
   */
  static async findGamePlatformsByGameIds(gameIds) {
    const { rows } = await getPool().query(
      `SELECT
            game_platforms.game_id AS "gameId",
            platforms.id, 
            platforms.name,
            game_platforms.platform_metascore AS "platformMetascore"
         FROM game_platforms
         JOIN platforms ON platforms.id = game_platforms.platform_id
         WHERE game_platforms.game_id = ANY($1)`,
      [gameIds],
    );
    return rows;
  }
}
