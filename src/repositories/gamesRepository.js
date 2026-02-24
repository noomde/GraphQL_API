import { pool } from '../config/database.js';

/**
 * Inserts a new game into the database.
 *
 * @param {Object} gameData - The game data to be inserted.
 * @returns {Promise<object>} The inserted game object.
 */
export const insertGame = async ({
    metacritic_id,
    title,
    release_date,
    rating,
    genres,
    description,
    developer,
    publisher
}) => {
    const { rows } = await pool.query(
        `INSERT INTO games (
            metacritic_id,
            title,
            release_date,
            rating,
            genres,
            description,
            developer,
            publisher
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
            metacritic_id,
            title, 
            release_date, 
            rating, genres, 
            description, 
            developer, 
            publisher
        ]
    )
    return rows[0]
}

export const findGameById = async (id) => {
    const { rows } = await pool.query(
        `SELECT * FROM games WHERE id = $1`,
        [id]
    )
    return rows[0] || null
}

export const findAllGames = async () => {
    const { rows } = await pool.query(
        `SELECT * FROM games ORDER BY id ASC`
    )
    return rows
}

export const updateGame = async (id, gameData) => {
    const { rows } = await pool.query(
        `UPDATE games SET
            metacritic_id = COALESCE($2, metacritic_id),
            title = COALESCE($3, title),
            release_date = COALESCE($4, release_date),
            rating = COALESCE($5, rating),
            genres = COALESCE($6, genres),
            description = COALESCE($7, description),
            developer = COALESCE($8, developer),
            publisher = COALESCE($9, publisher)
        WHERE id = $1
        RETURNING *
        `,
        [
            id,
            gameData.metacritic_id,
            gameData.title,
            gameData.release_date,
            gameData.rating,
            gameData.genres,
            gameData.description,
            gameData.developer,
            gameData.publisher
        ]
    )
    return rows[0] || null
}
    

export const deleteGame = async (id) => {
    const { rowCount } = await pool.query(
        `DELETE FROM games WHERE id = $1`,
        [id]
    )
    return rowCount > 0
}