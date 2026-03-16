import { GamesController } from '../controller/gamesController.js';
import { ScoresController } from '../controller/scoresController.js';
import { GamePlatformsController } from '../controller/gamePlatformsController.js';
import { getPagination, getPaginationMeta } from '../utils/pagination.js';
import { ensureAuthenticated } from '../middleware/auth.js';

export default {
  Query: {
    /**
     * Retrieves all games.
     *
     * @returns {Promise<Array>} An array of games.
     */
    games: async (_, { page, limit, genre }) => {
      const pagination = getPagination(page, limit);

      const items = await GamesController.getAllGames(pagination.limit, pagination.offset, genre);
      const totalCount = await GamesController.getTotalGamesCount(genre);

      return {
        items,
        ...getPaginationMeta(totalCount, page, limit),
      };
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
      ensureAuthenticated(context);
      return await GamesController.createGame(args);
    },

    /**
     * Updates an existing game.
     *
     * @param {*} _ - The parent object.
     * @param {*} id - The ID of the game to update.
     * @param {*} gameData - The data for the game to be updated.
     * @returns {Promise<Object>} The updated game object.
     */
    updateGame: async (_, args, context) => {
      ensureAuthenticated(context);
      return await GamesController.updateGame(args.id, args);
    },

    /**
     * Deletes a game by its ID.
     *
     * @param {*} _ - The parent object.
     * @param {*} id - The ID of the game to delete.
     * @returns {boolean} True if the game was successfully deleted, false otherwise.
     */
    deleteGame: async (_, { id }, context) => {
      ensureAuthenticated(context);
      return await GamesController.deleteGame(id);
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
     * @param {*} _ - The arguments (not used in this resolver).
     * @param {object} context - The context object containing loaders and other shared data.
     * @returns {Promise<Array>} An array of platforms associated with the game.
     */
    platforms: async (parent, _, context) => {
      return await context.loaders.gamePlatformsLoader.load(parent.id);
    },
  },
};
