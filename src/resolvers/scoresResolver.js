import { ScoresController } from '../controller/scoresController.js';

export default {
  Query: {
    /**
     * Retrieves all scores.
     *
     * @returns {Promise<Array>} An array of scores.
     */
    scores: async () => {
      return await ScoresController.getAllScores();
    },

    /**
     * Retrieves a score object.
     *
     * @param {*} _ - The parent object.
     * @param {*} id - The gameID of the score.
     * @returns {Promise<Object>} The score object.
     */
    score: async (_, { id }) => {
      return await ScoresController.getScoreById(id);
    },
  },
};
