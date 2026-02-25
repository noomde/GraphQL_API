import { pool } from '../config/database.js';

/**
 * Finds platforms associated with a specific game ID.
 *
 * @param {number} gameId - The ID of the game for which to find platforms.
 * @returns {Promise<Array>} An array of platform objects associated with the game.
 */
export const findGamePlatformsByGameId = async (gameId) => {
    const { rows } = await pool.query(
        `SELECT 
            platforms.id, 
            platforms.name,
            game_platforms.platform_metascore
         FROM game_platforms
         JOIN platforms ON platforms.id = game_platforms.platform_id
         WHERE game_platforms.game_id = $1`,
        [gameId]
    )
    return rows
}