import { ScoresRepository } from '../repositories/scoresRepository.js';
import { ApolloError } from 'apollo-server-errors';

export class ScoresController {
  /**
   * Retrieves all scores from the repository.
   *
   * @returns {Promise<Array>} An array of scores.
   */
  static async getAllScores() {
    return await ScoresRepository.getAllScores();
  }

  /**
   * Retrieves a score by its ID from the repository.
   *
   * @param {number} id - The ID of the score to retrieve.
   * @returns {Promise<Object>} The score.
   * @throws {ApolloError} If the score with the specified ID is not found.
   */
  static async getScoreById(id) {
    const score = await ScoresRepository.getScoreById(id);
    if (!score) {
      throw new ApolloError(`Score with ID ${id} not found`);
    }

    return score;
  }
}
