import { GamesRepository } from '../repositories/gamesRepository.js';
import { ApolloError, AuthenticationError } from 'apollo-server-errors';

export class GamesController {
  /**
   * Retrieves all games from the repository.
   *
   * @param {number} limit - The maximum number of games to retrieve.
   * @param {number} offset - The number of games to skip before starting to collect the result set.
   * @param {string} genre - Optional genre filter to retrieve games of a specific genre.
   * @returns {Promise<Array>} An array of games.
   */
  static async getAllGames(limit, offset, genre) {
    if (genre) {
      return await GamesRepository.findGamesByGenre(genre, limit, offset);
    }
    return await GamesRepository.findAllGames(limit, offset);
  }

  /**
   * Retrieves a game by its ID from the repository.
   *
   * @param {number} id - The ID of the game to retrieve.
   * @returns {Promise<Object>} The game.
   * @throws {ApolloError} If the game with the specified ID is not found.
   */
  static async getGameById(id) {
    const game = await GamesRepository.findGameById(id);
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
  static async getTotalGamesCount(genre) {
    return await GamesRepository.getTotalGamesCount(genre);
  }

  /**
   * Creates a new game in the repository.
   *
   * @param {Object} gameData - The data for the game to be created.
   * @param {Object} user - The authenticated user performing the update.
   * @returns {Promise<Object>} The created game.
   * @throws {ApolloError} If the game title is missing.
   */
  static async createGame(gameData, user) {
    if (!user) {
      throw new AuthenticationError(
        'You are not authenticated to perform this action',
        'UNAUTHENTICATED',
      );
    }

    if (!gameData) {
      throw new ApolloError('Game data is required', 'GAME_DATA_REQUIRED');
    }

    return await GamesRepository.insertGame({
      metacritic_id: gameData.metacriticId,
      title: gameData.title,
      release_date: gameData.releaseDate,
      rating: gameData.rating,
      genres: gameData.genres,
      description: gameData.description,
      developer: gameData.developer,
      publisher: gameData.publisher,
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
  static async updateGame(id, gameData, user) {
    if (!user) {
      throw new AuthenticationError(
        'You are not authenticated to perform this action',
        'UNAUTHENTICATED',
      );
    }

    const updatedGame = await GamesRepository.updateGame(id, {
      metacritic_id: gameData.metacriticId,
      title: gameData.title,
      release_date: gameData.releaseDate,
      rating: gameData.rating,
      genres: gameData.genres,
      description: gameData.description,
      developer: gameData.developer,
      publisher: gameData.publisher,
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
  static async deleteGame(id, user) {
    if (!user) {
      throw new AuthenticationError(
        'You are not authenticated to perform this action',
      );
    }

    const status = await GamesRepository.deleteGame(id);
    if (!status) {
      throw new ApolloError(`Game with ID ${id} not found`, 'GAME_NOT_FOUND');
    }

    return {
      message: `Game with ID ${id} has been deleted successfully`,
      success: true,
    };
  }
}
