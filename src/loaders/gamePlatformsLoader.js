import { createManyLoader } from './createManyLoader.js';
import { GamePlatformsRepository } from '../repositories/gamePlatformsRepository.js';

/**
 * Creates a DataLoader for batching and caching database requests for game platforms based on game IDs.
 *
 * @returns {DataLoader} A DataLoader instance for game platforms.
 */
export function createGamePlatformsLoader() {
  return createManyLoader((gameIds) =>
    GamePlatformsRepository.findGamePlatformsByGameIds(gameIds),
  );
}
