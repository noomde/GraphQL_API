import { GamesController } from '../controller/gamesController.js';
import { ScoresController } from '../controller/scoresController.js';
import { GamePlatformsController } from '../controller/gamePlatformsController.js';
import { ensureAuthenticated } from '../middleware/auth.js';

export default {
  Query: {
    /**
     * Retrieves all games.
     *
     * @returns {Promise<Array>} An array of games.
     */
    games: async () => {
      return await GamesController.getAllGames();
    },

    /**
     * Retrieves a game by its ID.
     *
     * @param {*} _ - The parent object.
     * @param {*} id - The ID of the game to retrieve.
     * @returns {Promise<Object>} The game object.
     */
    game: async (_, { id }) => {
      return await GamesController.getGameById(id);
    },
  },

  Mutation: {
    /**
     * Creates a new game.
     *
     * @param {*} _ - The parent object.
     * @param {*} gameData - The data for the game to be created.
     * @returns {Promise<Object>} The created game object.
     */
    createGame: async (_, args, context) => {
      await ensureAuthenticated(context);
      return await GamesController.createGame(args, context.user);
    },

    /**
     * Updates an existing game.
     *
     * @param {*} _ - The parent object.
     * @param {*} id - The ID of the game to update.
     * @param {*} gameData - The data for the game to be updated.
     * @returns {Promise<Object>} The updated game object.
     */
    updateGame: async (_, { id, gameData }, context) => {
      await ensureAuthenticated(context);
      return await GamesController.updateGame(id, gameData, context.user);
    },

    /**
     * Deletes a game by its ID.
     *
     * @param {*} _ - The parent object.
     * @param {*} id - The ID of the game to delete.
     * @returns {boolean} True if the game was successfully deleted, false otherwise.
     */
    deleteGame: async (_, { id }, context) => {
      await ensureAuthenticated(context);
      return await GamesController.deleteGame(id, context.user);
    },
  },

  Game: {
    /**
     * Retrieves scores associated with a specific game ID.
     *
     * @param {object} parent - The parent game object.
     * @returns {Promise<Array>} An array of scores associated with the game.
     */
    scores: async (parent) => {
      return await ScoresController.getScoreByGameId(parent.id);
    },

    /**
     * Retrieves platforms associated with a specific game ID.
     *
     * @param {object} parent - The parent game object.
     * @returns {Promise<Array>} An array of platforms associated with the game.
     */
    platforms: async (parent) => {
      return await GamePlatformsController.getPlatformsByGameId(parent.id);
    },
  },
};
