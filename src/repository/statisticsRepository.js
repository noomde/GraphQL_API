import { getPool } from '../config/database.js';

/**
 * Function for decreasing repetetiveness.
 *
 * @param {string} table - The table of the query.
 * @param {string} nameColumn - The name column of the query.
 * @param {string} scoreColumn - The score column of the query.
 * @param {string} countColumn - The count column of the query.
 * @returns {string} - The select part of the statistics query.
 */
function STATISTICS_COLUMNS({ table, nameColumn, scoreColumn, countColumn }) {
  return `
    SELECT
      ${nameColumn} AS name,
      ROUND(AVG(${scoreColumn})::numeric, 2)::float AS "averageMetascore",

      ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ${scoreColumn})::numeric, 2
      )::float AS "medianMetascore",
      
      COUNT(${countColumn})::int AS "gameCount"
    FROM ${table}
  `;
}

/**
 * Repository for handling database interactions related to statistics.
 */
export class StatisticsRepository {
  /**
   * Finds all platforms and calculates the average score of each.
   *
   * @returns - The average score of each platform.
   */
  async findAverageScorePerPlatform() {
    const query = `
      ${STATISTICS_COLUMNS({
        table: `platforms JOIN game_platforms ON game_platforms.platform_id = platforms.id`,
        nameColumn: 'platforms.name',
        scoreColumn: 'game_platforms.platform_metascore',
        countColumn: 'game_platforms.game_id',
      })}
      WHERE game_platforms.platform_metascore IS NOT NULL
      GROUP BY platforms.id, platforms.name
      ORDER BY "averageMetascore" DESC, platforms.name ASC;
    `;

    const { rows } = await getPool().query(query);

    return rows;
  }

  /**
   * Finds all developers and calculates the average score of each.
   *
   * @returns - The average score of each developer.
   */
  async findAverageScorePerDeveloper() {
    const query = `
      ${STATISTICS_COLUMNS({
        table: `games JOIN scores ON scores.game_id = games.id`,
        nameColumn: 'games.developer',
        scoreColumn: 'scores.metascore',
        countColumn: 'games.id',
      })}
      WHERE games.developer IS NOT NULL
        AND TRIM(games.developer) <> ''
        AND scores.metascore IS NOT NULL
      GROUP BY games.developer
      ORDER BY "averageMetascore" DESC, games.developer ASC;
    `;

    const { rows } = await getPool().query(query);

    return rows;
  }
  /**
   * Finds all publishers and calculates the average score of each.
   *
   * @returns - The average score of each publisher.
   */
  async findAverageScorePerPublisher() {
    const query = `
    ${STATISTICS_COLUMNS({
      table: `games
        JOIN scores ON scores.game_id = games.id
        CROSS JOIN LATERAL unnest(string_to_array(games.publisher, ',')) AS publisher_name`,
      nameColumn: 'TRIM(publisher_name)',
      scoreColumn: 'scores.metascore',
      countColumn: 'games.id',
    })}
      WHERE games.publisher IS NOT NULL
        AND TRIM(games.publisher) <> ''
        AND scores.metascore IS NOT NULL
        AND TRIM(publisher_name) <> ''
      GROUP BY TRIM(publisher_name)
      ORDER BY "averageMetascore" DESC, name ASC;
  `;

    const { rows } = await getPool().query(query);

    return rows;
  }
}
