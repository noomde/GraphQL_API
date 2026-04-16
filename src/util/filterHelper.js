/**
 * Helps to define the query depending on what kind of filter is sent as an argument.
 *
 * @param {object} filter - The different filters to be sent (platforms, genre, developer and publisher)
 * @returns - SQl that helps define the query.
 */
export function gameFilterQuery(filter = {}) {
  const conditions = [];
  const values = [];
  let joins = '';

  if (filter.genre) {
    values.push(`%${filter.genre}%`);
    conditions.push(`games.genres ILIKE $${values.length}`);
  }

  if (filter.developer) {
    values.push(`%${filter.developer}%`);
    conditions.push(`games.developer ILIKE $${values.length}`);
  }

  if (filter.publisher) {
    values.push(`%${filter.publisher}%`);
    conditions.push(`games.publisher ILIKE $${values.length}`);
  }

  if (filter.platform) {
    joins += `
      LEFT JOIN game_platforms
        ON games.id = game_platforms.game_id
      LEFT JOIN platforms
        ON game_platforms.platform_id = platforms.id
    `;
    values.push(filter.platform);
    conditions.push(`platforms.name ILIKE $${values.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  return { joins, whereClause, values };
}
