import { getPagination, getPaginationMeta } from '../util/pagination.js';

export default {
  Query: {
    /**
     * Retrieves all scores.
     *
     * @returns {Promise<Array>} An array of scores.
     */
    scores: async (_, { page, limit }, context) => {
      const pagination = getPagination(page, limit);

      const items = await context.controllers.scores.getAllScores(pagination.limit, pagination.offset);

      const totalCount = await context.controllers.scores.getTotalScoresCount();

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
    score: async (_, { gameId }, context) => {
      return await context.controllers.scores.getScoreByGameId(gameId);
    },
  },
};
