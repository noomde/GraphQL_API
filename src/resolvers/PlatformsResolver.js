import { PlatformsController } from '../controller/platformsController.js';

export default {
  Query: {
    /**
     * Retrieves all platforms.
     *
     * @returns {Promise<Array>} An array of platforms.
     */
    platforms: async () => {
      return await PlatformsController.getAllPlatforms();
    },

    /**
     * Retrieves a platform by its ID.
     *
     * @param {*} _ - The parent object.
     * @param {*} id - The ID of the platform.
     * @returns {Promise<Object>} The platform object.
     */
    platform: async (_, { id }) => {
      return await PlatformsController.getPlatformById(id);
    },
  },
};
