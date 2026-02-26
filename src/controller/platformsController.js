import { PlatformsRepository } from '../repositories/platformsRepository.js';
import { ApolloError } from 'apollo-server-errors';

export class PlatformsController {
  /**
   * Retrieves all platforms from the repository.
   *
   * @returns {Promise<Array>} An array of platforms.
   */
  static async getAllPlatforms() {
    return await PlatformsRepository.getAllPlatforms();
  }

  /**
   * Retrieves a platform by its ID from the repository.
   *
   * @param {number} id - The ID of the platform to retrieve.
   * @returns {Promise<Object>} The platform.
   * @throws {ApolloError} If the platform with the specified ID is not found.
   */
  static async getPlatformById(id) {
    const platform = await PlatformsRepository.getPlatformById(id);
    if (!platform) {
      throw new ApolloError(`Platform with ID ${id} not found`);
    }

    return platform;
  }
}
