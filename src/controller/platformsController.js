import { PlatformsRepository } from '../repositories/platformsRepository.js';
import { ApolloError } from 'apollo-server-errors';

export default class PlatformsController {
  #platformsRepository;

  constructor(platformsRepository = new PlatformsRepository()) {
    this.#platformsRepository = platformsRepository;
  }
  /**
   * Retrieves all platforms from the repository.
   *
   * @returns {Promise<Array>} An array of platforms.
   */
  async getAllPlatforms() {
    return await this.#platformsRepository.findAllPlatforms();
  }

  /**
   * Retrieves a platform by its ID from the repository.
   *
   * @param {number} id - The ID of the platform to retrieve.
   * @returns {Promise<Object>} The platform.
   * @throws {ApolloError} If the platform with the specified ID is not found.
   */
  async getPlatformById(id) {
    const platform = await this.#platformsRepository.findPlatformById(id);
    if (!platform) {
      throw new ApolloError(`Platform with ID ${id} not found`);
    }

    return platform;
  }
}
