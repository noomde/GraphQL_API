import pg from 'pg';
const { Pool } = pg;

let pool = null;

export const connectToDatabase = async (connectionString) => {
  pool = new Pool({
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
        } finally {
          process.exit(0)
        }
      })()
    })
  }

  return pool;
};


export const getPool = () => pool;
