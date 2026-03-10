import { getPool } from '../config/database.js';

export class GamesRepository {
  /**
   * Inserts a new game into the database.
   *
   * @param {Object} gameData - The game data to be inserted.
   * @returns {Promise<object>} The inserted game object.
   */
  static async insertGame({
    metacritic_id,
    title,
    release_date,
    rating,
    genres,
    description,
    developer,
    publisher,
  }) {
    const { rows } = await getPool().query(
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
      RETURNING
        id,
        metacritic_id AS "metacriticId",
        title,
        release_date::text AS "releaseDate",
        rating,
        genres,
        description,
        developer,
        publisher
      `,
      [
        metacritic_id,
        title,
        release_date,
        rating,
        genres,
        description,
        developer,
        publisher,
      ],
    );
    return rows[0];
  }

  static async findGameById(id) {
    const { rows } = await getPool().query(
      `
      SELECT
        id,
        metacritic_id AS "metacriticId",
        title,
        release_date::text AS "releaseDate",
        rating,
        genres,
        description,
        developer,
        publisher
      FROM games
      WHERE id = $1
      `,
      [id],
    );
    return rows[0] || null;
  }

  static async findAllGames(limit, offset) {
    const { rows } = await getPool().query(
      `
      SELECT
        id,
        metacritic_id AS "metacriticId",
        title,
        release_date::text AS "releaseDate",
        rating,
        genres,
        description,
        developer,
        publisher
      FROM games
      ORDER BY id ASC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset],
    );
    return rows;
  }

  static async updateGame(id, gameData) {
    const { rows } = await getPool().query(
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
      RETURNING
        id,
        metacritic_id AS "metacriticId",
        title,
        release_date::text AS "releaseDate",
        rating,
        genres,
        description,
        developer,
        publisher
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
        gameData.publisher,
      ],
    );
    return rows[0] || null;
  }

  static async deleteGame(id) {
    const { rowCount } = await getPool().query(`DELETE FROM games WHERE id = $1`, [
      id,
    ]);
    return rowCount > 0;
  }
}
