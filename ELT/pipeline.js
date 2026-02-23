import { SqlTransformRunner } from './sqlTransformer.js';
import { SqlLoader } from './sqlLoader.js';
import { extractDataFromCSV } from './extractor.js';
import { database, paths } from './config.js';

const loader = new SqlLoader(paths.sql);
const pipeline = new SqlTransformRunner(database, loader);

const csvStream = await extractDataFromCSV(paths.csv);

await pipeline.runFromFiles(['truncate.sql']);

await pipeline.copyToDatabase('gamesRaw.sql', csvStream);

await pipeline.runFromFiles([
    'platforms.sql',
    'games.sql',
    'scores.sql',
    'gamePlatforms.sql'
]);

console.log('Pipeline execution completed successfully.');

await database.end();