/**
 * Calculates pagination parameters based on the provided page and limit values.
 *
 * @param {number} page 
 * @param {number} limit 
 * @returns {Object} An object containing the safe page, limit, and offset values.
 */
export function getPagination (page, limit) {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 100);

    const offset = (safePage - 1) * safeLimit;

    return { 
        page: safePage,
        limit: safeLimit, 
        offset };
}

/**
 * Returns pagination metadata.
 *
 * @param {number} totalCount 
 * @param {number} page 
 * @param {number} limit 
 * @returns {Object} An object containing pagination metadata.
 */
export function getPaginationMeta (totalCount, page, limit) {
    return {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
    }
}