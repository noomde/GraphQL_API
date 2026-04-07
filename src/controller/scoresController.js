import { ApolloError } from 'apollo-server-errors';

import { ScoresRepository } from '../repositories/scoresRepository.js';

/**
 * Responisble for handling business logic for scores.
 */
export default class ScoresController {
  #scoresRepository;

  /**
   * Creates an instance of ScoresController.
   *
   * @param {ScoresRepository} scoresRepository - The repository for handling score data interactions.
   */
  constructor(scoresRepository = new ScoresRepository()) {
    this.#scoresRepository = scoresRepository;
  }

  /**
   * Retrieves all scores from the repository.
   *
   * @returns {Promise<Array>} An array of scores.
   */
  async getAllScores(limit, offset) {
    return await this.#scoresRepository.findAllScores(limit, offset);
  }

  /**
   * Retrieves the total count of scores in the repository.
   *
   * @returns {Promise<number>} The total count of scores.
   */
  async getTotalScoresCount() {
    return await this.#scoresRepository.getTotalScoresCount();
  }

  /**
   * Retrieves a score by its ID from the repository.
   *
   * @param {number} id - The ID of the score to retrieve.
   * @returns {Promise<Object>} The score.
   * @throws {ApolloError} If the score with the specified ID is not found.
   */
  async getScoreByGameId(id) {
    const score = await this.#scoresRepository.findScoreByGameId(id);
    if (!score) {
      throw new ApolloError(
        `Score with Game ID ${id} not found`,
        'SCORE_NOT_FOUND',
      );
    }

    return score;
  }
}
