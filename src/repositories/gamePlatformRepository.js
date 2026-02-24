import { pool } from '../config/database.js';

export const findPlatformByGameId = async (gameId) => {
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