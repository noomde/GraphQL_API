import pg from 'pg';
const { Pool } = pg;

let pool = null;

export const connectToDatabase = async (connectionString) => {
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  for (const signalEvent of ['SIGINT', 'SIGTERM']) {
    process.on(signalEvent, () => {
      ;(async () => {
        try {
          await pool.end()
          logger.info(`PostgreSQL disconnected through ${signalEvent}.`)
        } finally {
          process.exit(0)
        }
      })()
    })
  }

  return pool;
};


export const getPool = () => pool;
