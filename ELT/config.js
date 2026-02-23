import 'dotenv/config';
import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const database = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export const paths = {
    sql: path.join(__dirname, 'sql'),
    csv: path.join(__dirname, '../data/metacritic_games.csv'),
};