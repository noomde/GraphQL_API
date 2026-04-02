import { GamesRepository } from '../repositories/gamesRepository.js';
import { ApolloError } from 'apollo-server-errors';
import { sanitize } from '../utils/sanitize.js';

export default class GamesController {
  #gamesRepository;

  constructor(gamesRepository = new GamesRepository()) {
    this.#gamesRepository = gamesRepository;
  }
  /**
   * Retrieves all games from the repository.
   *
   * @param {number} limit - The maximum number of games to retrieve.
   * @param {number} offset - The number of games to skip before starting to collect the result set.
   * @param {string} genre - Optional genre filter to retrieve games of a specific genre.
   * @returns {Promise<Array>} An array of games.
   */
  async getAllGames(limit, offset, genre) {
    if (genre) {
      return await this.#gamesRepository.findGamesByGenre(genre, limit, offset);
    }
    return await this.#gamesRepository.findAllGames(limit, offset);
  }

  /**
   * Retrieves a game by its ID from the repository.
   *
   * @param {number} id - The ID of the game to retrieve.
   * @returns {Promise<Object>} The game.
   * @throws {ApolloError} If the game with the specified ID is not found.
   */
  async getGameById(id) {
    const game = await this.#gamesRepository.findGameById(id);
    if (!game) {
      throw new ApolloError(`Game with ID ${id} not found`, 'GAME_NOT_FOUND');
    }

    return game;
  }

  /**
   * Retrieves the total count of games in the repository.
   *
   * @returns {Promise<number>} The total count of games.
   */
  async getTotalGamesCount(genre) {
    return await this.#gamesRepository.getTotalGamesCount(genre);
  }

  /**
   * Creates a new game in the repository.
   *
   * @param {Object} gameData - The data for the game to be created.
   * @returns {Promise<Object>} The created game.
   * @throws {ApolloError} If the game title is missing.
   */
  async createGame(gameData) {
    if (!gameData) {
      throw new ApolloError('Game data is required', 'GAME_DATA_REQUIRED');
    }

    const sanitizedGameData = sanitize(gameData);

    return await this.#gamesRepository.insertGame({
      metacritic_id: sanitizedGameData.metacriticId,
      title: sanitizedGameData.title,
      release_date: sanitizedGameData.releaseDate,
      rating: sanitizedGameData.rating,
      genres: sanitizedGameData.genres,
      description: sanitizedGameData.description,
      developer: sanitizedGameData.developer,
      publisher: sanitizedGameData.publisher,
    });
  }

  /**
   * Updates an existing game in the repository.
   *
   * @param {number} id - The ID of the game to update.
   * @param {Object} gameData - The data for the game to be updated.
   * @param {Object} user - The authenticated user performing the update.
   * @returns {Promise<Object>} The updated game.
   * @throws {ApolloError} If the game with the specified ID is not found.
   */
  async updateGame(id, gameData) {
    const sanitizedGameData = sanitize(gameData);

    const updatedGame = await this.#gamesRepository.updateGame(id, {
      metacritic_id: sanitizedGameData.metacriticId,
      title: sanitizedGameData.title,
      release_date: sanitizedGameData.releaseDate,
      rating: sanitizedGameData.rating,
      genres: sanitizedGameData.genres,
      description: sanitizedGameData.description,
      developer: sanitizedGameData.developer,
      publisher: sanitizedGameData.publisher,
    });

    if (!updatedGame) {
      throw new ApolloError(`Game with ID ${id} not found`, 'GAME_NOT_FOUND');
    }

    return updatedGame;
  }

  /**
   * Deletes a game from the repository.
   *
   * @param {number} id - The ID of the game to delete.
   * @param {Object} user - The authenticated user performing the update.
   * @returns {Promise<Object>} A success message if the game was deleted.
   * @throws {ApolloError} If the game with the specified ID is not found.
   */
  async deleteGame(id) {
    const status = await this.#gamesRepository.deleteGame(id);
    if (!status) {
      throw new ApolloError(`Game with ID ${id} not found`, 'GAME_NOT_FOUND');
    }

    return {
      message: `Game with ID ${id} has been deleted successfully`,
      success: true,
    };
  }
}
