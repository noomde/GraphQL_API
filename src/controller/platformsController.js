import { ApolloError } from 'apollo-server-errors';

import { PlatformsRepository } from '../repositories/platformsRepository.js';

/**
 * Responsible for handling business logic for platforms.
 */
export default class PlatformsController {
  #platformsRepository;

  /**
   * Creates an instance of PlatformsController.
   *
   * @param {PlatformsRepository} platformsRepository - The repository for handling platform data interactions.
   */
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
