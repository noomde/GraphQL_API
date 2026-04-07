import { ApolloError } from 'apollo-server-errors';

import { GamePlatformsRepository } from '../repositories/gamePlatformsRepository.js';

/**
 * Responsible for handling business logic for game platforms.
 */
export default class GamePlatformsController {
  #gamePlatformsRepository;

  /**
   * Creates an instance of GamePlatformsController.
   *
   * @param {GamePlatformsRepository} gamePlatformsRepository - The repository for interacting with game platforms data.
   */
  constructor(gamePlatformsRepository = new GamePlatformsRepository()) {
    this.#gamePlatformsRepository = gamePlatformsRepository;
  }

  /**
   * Retrieves platforms associated with a specific game ID.
   *
   * @param {number} gameId - The ID of the game for which to retrieve platforms.
   * @returns {Promise<Array>} An array of platform objects associated with the game.
   */
  async getPlatformsByGameId(gameId) {
    const gamePlatform =
      await this.#gamePlatformsRepository.findGamePlatformsByGameId(gameId);

    // Check if any platforms were found for the given game ID (length for array check)
    if (!gamePlatform || gamePlatform.length === 0) {
      throw new ApolloError(
        `No platforms found for game with ID ${gameId}`,
        'PLATFORMS_NOT_FOUND',
      );
    }

    return gamePlatform;
  }
}
