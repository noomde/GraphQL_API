import { createSingleLoader } from './createSingleLoader.js';
import { ScoresRepository } from '../repository/scoresRepository.js';

const scoreRepository = new ScoresRepository();

/**
 * Creates a DataLoader for batching and caching database requests for scores based on game IDs.
 *
 * @returns {DataLoader} A DataLoader instance for scores.
 */
export function createScoresLoader() {
  return createSingleLoader((gameIds) =>
    scoreRepository.findScoreByGameIds(gameIds),
  );
}
