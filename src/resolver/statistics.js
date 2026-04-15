import { StatisticsController } from '../controller/statisticsController.js';

const statisticsController = new StatisticsController();

export default {
  Query: {
    /**
     * Retrives the average score of all platforms.
     *
     * @returns {Promise<Object>} - The average score of platforms object.
     */
    averageScorePerPlatform: async () => {
      return await statisticsController.getAverageScorePerPlatform();
    },

    /**
     * Retrieves the average score of all developers.
     *
     * @returns {Promise<Object>} - The average score of developers object.
     */
    averageScorePerDeveloper: async () => {
      return await statisticsController.getAverageScorePerDeveloper();
    },

    /**
     * Retrieves the average score of all developers.
     *
     * @returns {Promise<Object>} - The average score of publisher objeckt.
     */
    averageScorePerPublisher: async () => {
      return await statisticsController.getAverageScorePerPublisher();
    },
  },
};
