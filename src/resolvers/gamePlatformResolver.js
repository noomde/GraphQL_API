import GamePlatformsController from '../controller/gamePlatformsController.js';

const gamePlatformController = new GamePlatformsController();

export default {
  Query: {
    /**
     * Retrieves platforms associated with a specific game ID.
     *
     * @param {*} _ - The parent object.
     * @param {*} gameId - The gameId argument.
     * @returns {Promise<Array>} An array of platform objects associated with the game.
     */
    gamePlatform: async (_, { gameId }) => {
      return await gamePlatformController.getPlatformsByGameId(gameId);
    },
  },
};
