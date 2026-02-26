import { findGamePlatformsByGameId } from '../repositories/gamePlatformsRepository.js';
import { ApolloError } from 'apollo-server-errors';

export class GamePlatformsController {
  /**
   * Retrieves platforms associated with a specific game ID.
   *
   * @param {number} gameId - The ID of the game for which to retrieve platforms.
   * @returns {Promise<Array>} An array of platform objects associated with the game.
   */
  static async getPlatformsByGameId(gameId) {
    const gamePlatform = await findGamePlatformsByGameId(gameId);

    if (!gamePlatform.length) {
      throw new ApolloError(`No platforms found for game with ID ${gameId}`);
    }

    return gamePlatform;
  }
}
