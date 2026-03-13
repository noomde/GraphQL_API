import { ScoresRepository } from '../repositories/scoresRepository.js';
import { ApolloError } from 'apollo-server-errors';

export class ScoresController {
  /**
   * Retrieves all scores from the repository.
   *
   * @returns {Promise<Array>} An array of scores.
   */
  static async getAllScores(limit, offset) {
    return await ScoresRepository.findAllScores(limit, offset);
  }

  /**
   * Retrieves the total count of scores in the repository.
   *
   * @returns {Promise<number>} The total count of scores.
   */
  static async getTotalScoresCount() {
    return await ScoresRepository.getTotalScoresCount();
  }

  /**
   * Retrieves a score by its ID from the repository.
   *
   * @param {number} id - The ID of the score to retrieve.
   * @returns {Promise<Object>} The score.
   * @throws {ApolloError} If the score with the specified ID is not found.
   */
  static async getScoreByGameId(id) {
    const score = await ScoresRepository.findScoreByGameId(id);
    if (!score) {
      throw new ApolloError(`Score with Game ID ${id} not found`);
    }

    return score;
  }
}
