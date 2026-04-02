import { GamePlatformsRepository } from '../repositories/gamePlatformsRepository.js';
import { ApolloError } from 'apollo-server-errors';

export default class GamePlatformsController {
  #gamePlatformsRepository;

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
