import pg from 'pg';
const { Pool } = pg;

let pool = null;

/**
 * Connects to the PostgreSQL database using the provided connection string.
 *
 * @param {string} connectionString - The connection string for the PostgreSQL database.
 * @returns {Promise<Pool>} A promise resolving to the database pool.
 */
export const connectToDatabase = async (connectionString) => {
  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  for (const signalEvent of ['SIGINT', 'SIGTERM']) {
    process.on(signalEvent, () => {
      (async () => {
        try {
          await pool.end();
        } finally {
          process.exit(0);
        }
      })();
    });
  }

  return pool;
};

export const getPool = () => pool;
