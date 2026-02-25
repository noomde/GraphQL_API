import { GamesRepository } from "../repositories/gamesRepository";
import { ApolloError } from "apollo-server-errors";

export class GamesController {
  /**
   * Retrieves all games from the repository.
   *
   * @returns {Promise<Array>} An array of games.
   */
  static async getAllGames() {
    return await GamesRepository.getAllGames();
  }

  /**
   * Retrieves a game by its ID from the repository.
   *
   * @param {number} id - The ID of the game to retrieve.
   * @returns {Promise<Object>} The game.
   * @throws {ApolloError} If the game with the specified ID is not found.
   */
  static async getGameById(id) {
    const game = await GamesRepository.getGameById(id);
    if (!game) {
      throw new ApolloError(`Game with ID ${id} not found`);
    }

    return game;
  }

  /**
   * Creates a new game in the repository.
   *
   * @param {Object} gameData - The data for the game to be created.
   * @returns {Promise<Object>} The created game.
   * @throws {ApolloError} If the game title is missing.
   */
  static async createGame(gameData) {
    if (!gameData.title) {
      throw new ApolloError("Game title is required");
    }

    return await GamesRepository.createGame(gameData);
  }

  /**
   * Updates an existing game in the repository.
   *
   * @param {number} id - The ID of the game to update.
   * @param {Object} gameData - The data for the game to be updated.
   * @returns {Promise<Object>} The updated game.
   * @throws {ApolloError} If the game with the specified ID is not found.
   */
  static async updateGame(id, gameData) {
    const updatedGame = await GamesRepository.updateGame(id, gameData);
    if (!updatedGame) {
      throw new ApolloError(`Game with ID ${id} not found`);
    }

    return updatedGame;
  }

  /**
   * Deletes a game from the repository.
   *
   * @param {number} id - The ID of the game to delete.
   * @returns {Promise<Object>} A success message if the game was deleted.
   * @throws {ApolloError} If the game with the specified ID is not found.
   */
  static async deleteGame(id) {
    const status = await GamesRepository.deleteGame(id);
    if (!status) {
      throw new ApolloError(`Game with ID ${id} not found`);
    }

    return {
      message: `Game with ID ${id} has been deleted successfully`,
      success: true,
    };
  }
}
