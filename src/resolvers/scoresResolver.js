import { ScoresController } from '../controller/scoresController.js';
import { getPagination, getPaginationMeta } from '../utils/pagination.js';

export default {
  Query: {
    /**
     * Retrieves all scores.
     *
     * @returns {Promise<Array>} An array of scores.
     */
    scores: async (_, { page, limit }) => {
      const pagination = getPagination(page, limit);

      const items = await ScoresController.getAllScores(pagination.limit, pagination.offset);

      const totalCount = await ScoresController.getTotalScoresCount();

      return { 
        items,
        ...getPaginationMeta(totalCount, page, limit),
      };
    },

    /**
     * Retrieves a score object.
     *
     * @param {*} _ - The parent object.
     * @param {*} gameId - The gameID of the score.
     * @returns {Promise<Object>} The score object.
     */
    score: async (_, { gameId }) => {
      return await ScoresController.getScoreByGameId(gameId);
    },
  },
};
