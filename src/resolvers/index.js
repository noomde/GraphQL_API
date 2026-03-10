import gamesResolver from './gamesResolver.js';
import gamePlatformResolver from './gamePlatformResolver.js';
import platformResolver from './platformsResolver.js';
import userResolver from './usersResolver.js';
import scoresResolver from './scoresResolver.js';

export default {
  Query: {
    ...gamesResolver.Query,
    ...gamePlatformResolver.Query,
    ...platformResolver.Query,
    ...userResolver.Query,
    ...scoresResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...gamesResolver.Mutation,
  },
  Game: {
    ...gamesResolver.Game,
  },
};
