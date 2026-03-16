import DataLoader from 'dataloader';

/**
 * Creates a DataLoader for batching and caching database requests for a single entity.
 *
 * @param {Function} batchFunction - A function that takes an array of keys and returns a promise that resolves to an array of results corresponding to those keys.
 * @returns {DataLoader} A DataLoader instance.
 */
export function createSingleLoader(batchFunction) {
  return new DataLoader(async (keys) => {
    const results = await batchFunction(keys);

    const resultMap = new Map(results.map((result) => [result.gameId, result]));

    return keys.map((key) => resultMap.get(key) || null);
  });
}
