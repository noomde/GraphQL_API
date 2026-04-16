import { StatisticsRepository } from '../repository/statisticsRepository.js';

/**
 * Resposible for handling business logic for statistics.
 */
export default class StatisticsController {
  #statisticsRepository;

  /**
   * Creats an instance of statisticsController.
   *
   * @param {StatisticsRepository} statisticsRepository  - The repository for handling statistics data interactions.
   */
  constructor(statisticsRepository = new StatisticsRepository()) {
    this.#statisticsRepository = statisticsRepository;
  }

  /**
    Gets the average score per platform
   *
   * @returns {Promise<object[]>} - Platform statistics.
   */
  async getAverageScorePerPlatform() {
    return await this.#statisticsRepository.findAverageScorePerPlatform();
  }

  /**
   * Gets the average score per developer.
   *
   * @returns {Promise<object[]>} - Developer statistics.
   */
  async getAverageScorePerDeveloper() {
    return await this.#statisticsRepository.findAverageScorePerDeveloper();
  }

  /**
   * Gets the average score per publisher.
   *
   * @returns {Promise<object[]>} - Publisher statistics.
   */
  async getAverageScorePerPublisher() {
    return await this.#statisticsRepository.findAverageScorePerPublisher();
  }
}
