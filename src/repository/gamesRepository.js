import { getPool } from '../config/database.js';
import { gameFilterQuery } from '../util/filterHelper.js';

const GAME_COLUMNS = `
  games.id,
  games.metacritic_id AS "metacriticId",
  games.title,
  games.release_date::text AS "releaseDate",
  games.rating,
  games.genres,
  games.description,
  games.developer,
  games.publisher
`;

/**
 * Repository for handling database interactions related to games.
 */
export class GamesRepository {
  /**
   * Inserts a new game into the database.
   *
   * @param {Object} gameData - The game data to be inserted.
   * @returns {Promise<object>} The inserted game object.
   */
  async insertGame({
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
      RETURNING ${GAME_COLUMNS}
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

  /**
   * Finds a game by its ID.
   *
   * @param {number} id - The ID of the game to find.
   * @returns {Promise<object|null>} The game object if found, otherwise null.
   */
  async findGameById(id) {
    const { rows } = await getPool().query(
      `
      SELECT ${GAME_COLUMNS}
      FROM games
      WHERE id = $1
      `,
      [id],
    );
    return rows[0] || null;
  }

  /**
   * Finds all games with pagination.
   *
   * @param {number} limit - The maximum number of games to return.
   * @param {number} offset - The number of games to skip before starting to return results.
   * @returns {Promise<object[]>} A list of games.
   */
  async findAllGames(limit, offset, filter = {}) {
    const { joins, whereClause, values } = gameFilterQuery(filter);

    values.push(limit);
    const limitIndex = values.length;

    values.push(offset);
    const offsetIndex = values.length;

    const { rows } = await getPool().query(
      `
      SELECT DISTINCT ${GAME_COLUMNS}
      FROM games
      ${joins}
      ${whereClause}
      ORDER BY games.id ASC
      LIMIT $${limitIndex} OFFSET $${offsetIndex}
      `,
      values,
    );

    return rows;
  }

  /**
   * Gets the total count of games, if a genre is specified only count games of that genre.
   *
   * @param {string|null} genre - The genre to filter games by, or undefined to count all games.
   * @returns {Promise<number>} The total count of games.
   */
  async getTotalGamesCount(filter = {}) {
    const { joins, whereClause, values } = gameFilterQuery(filter);

    const { rows } = await getPool().query(
      `
      SELECT COUNT(DISTINCT games.id)
      FROM games
      ${joins}
      ${whereClause}
      `,
      values,
    );

    return Number(rows[0].count);
  }

  /**
   * Updates a game by its ID.
   *
   * @param {number} id - The ID of the game to update.
   * @param {object} gameData - The updated game data.
   * @returns {Promise<object|null>} The updated game object if successful, otherwise null.
   */
  async updateGame(id, gameData) {
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
      RETURNING ${GAME_COLUMNS}
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

  /**
   * Deletes a game by its ID.
   *
   * @param {number} id - The ID of the game to delete.
   * @returns {Promise<boolean>} True if the game was deleted, otherwise false.
   */
  async deleteGame(id) {
    const { rowCount } = await getPool().query(
      `DELETE FROM games WHERE id = $1`,
      [id],
    );
    return rowCount > 0;
  }
}
