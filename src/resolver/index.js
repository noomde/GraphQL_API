import gamePlatformResolver from './gamePlatformResolver.js';
import gamesResolver from './gamesResolver.js';
import platformResolver from './platformsResolver.js';
import scoresResolver from './scoresResolver.js';
import userResolver from './usersResolver.js';
import statisticsResolver from './statisticsResolver.js';

export default {
  Query: {
    ...gamesResolver.Query,
    ...gamePlatformResolver.Query,
    ...platformResolver.Query,
    ...userResolver.Query,
    ...scoresResolver.Query,
    ...statisticsResolver.Query
  },
  Mutation: {
    ...userResolver.Mutation,
    ...gamesResolver.Mutation,
  },
  Game: {
    ...gamesResolver.Game,
  },
};
