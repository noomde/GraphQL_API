export default {
  Query: {
    /**
     * Retrieves all platforms.
     *
     * @returns {Promise<Array>} An array of platforms.
     */
    platforms: async (_, __, context) => {
      return await context.controllers.platforms.getAllPlatforms();
    },

    /**
     * Retrieves a platform by its ID.
     *
     * @param {*} _ - The parent object.
     * @param {*} id - The ID of the platform.
     * @returns {Promise<Object>} The platform object.
     */
    platform: async (_, { id }, context) => {
      return await context.controllers.platforms.getPlatformById(id);
    },
  },
};
