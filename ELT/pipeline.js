import { SqlTransformRunner } from './sqlTransformer.js';
import { SqlLoader } from './sqlLoader.js';
import { extractDataFromCSV } from './extractor.js';
import { database, paths } from './config.js';

const client = await database.connect();

try {
  const loader = new SqlLoader(paths.sql);
  const pipeline = new SqlTransformRunner(client, loader);

  const csvStream = await extractDataFromCSV(paths.csv);

  await pipeline.transaction(async () => {
    await pipeline.runSqlFiles(['truncate.sql']);
    await loader.copyToDatabase('gamesRaw.sql', csvStream, client);
    await pipeline.runSqlFiles([
      'platforms.sql',
      'games.sql',
      'scores.sql',
      'gamePlatforms.sql',
    ]);
  });

  console.log('Pipeline execution completed successfully.');
} finally {
  client.release();
  await database.end();
}
