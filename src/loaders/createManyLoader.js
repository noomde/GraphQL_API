import DataLoader from 'dataloader';

/**
 * Creates a DataLoader for batching and caching database requests for multiple entities.
 *
 * @param {Function} batchFunction - A function that takes an array of keys and returns a promise that resolves to an array of results corresponding to those keys.
 * @returns {DataLoader} A DataLoader instance.
 */
export function createManyLoader(batchFunction) {
  return new DataLoader(async (keys) => {
    const results = await batchFunction(keys);

    const resultMap = new Map();

    // Initialize the result map with empty arrays for each key (example one game can have multiple platforms)
    for (const key of keys) {
      resultMap.set(key, []);
    }

    // Group results by their corresponding keys
    for (const result of results) {
      const key = result.gameId;

      if (resultMap.has(key)) {
        resultMap.get(key).push(result);
      }
    }

    return keys.map((key) => resultMap.get(key));
  });
}
