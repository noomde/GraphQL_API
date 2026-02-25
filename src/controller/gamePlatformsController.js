import { findGamePlatformsByGameId } from'../repositories/gamePlatformsRepository.js';
import { ApolloError } from 'apollo-server-errors';

export const getPlatformsByGameId = async (gameId) => {
    const gamePlatform = await findGamePlatformsByGameId(gameId);

    if (!gamePlatform.length) {
        throw new ApolloError(`No platforms found for game with ID ${gameId}`);
    }

    return gamePlatform
}