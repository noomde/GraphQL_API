import 'dotenv/config';
import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuration for railway database.
 */
export const database = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

/**
 * Paths to SQL files and CSV file.
 */
export const paths = {
  sql: path.join(__dirname, 'sql'),
  csv: path.join(
    __dirname,
    process.env.CSV_PATH || '../data/metacritic_games_test_data.csv',
  ),
};
