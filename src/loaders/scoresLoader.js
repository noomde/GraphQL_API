import { createSingleLoader } from './createSingleLoader.js';
import { ScoresRepository } from '../repositories/scoresRepository.js';

/**
 * Creates a DataLoader for batching and caching database requests for scores based on game IDs.
 *
 * @returns {DataLoader} A DataLoader instance for scores.
 */
export function createScoresLoader() {
  return createSingleLoader((gameIds) =>
    ScoresRepository.findScoreByGameIds(gameIds),
  );
}
