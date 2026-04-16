export default {
  Query: {
    /**
     * Retrives the average score of all platforms.
     *
     * @returns {Promise<Object>} - The average score of platforms object.
     */
    averageScorePerPlatform: async (_, __, context) => {
      return await context.controllers.statistics.getAverageScorePerPlatform();
    },

    /**
     * Retrieves the average score of all developers.
     *
     * @returns {Promise<Object>} - The average score of developers object.
     */
    averageScorePerDeveloper: async (_, __, context) => {
      return await context.controllers.statistics.getAverageScorePerDeveloper();
    },

    /**
     * Retrieves the average score of all developers.
     *
     * @returns {Promise<Object>} - The average score of publisher objeckt.
     */
    averageScorePerPublisher: async (_, __, context) => {
      return await context.controllers.statistics.getAverageScorePerPublisher();
    },
  },
};
