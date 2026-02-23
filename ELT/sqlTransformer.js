import { from as copyFrom } from "pg-copy-streams";

/**
 * Class responsible for running SQL transformations on the database using provided SQL files and a SQL loader.
 */
export class SqlTransformRunner {
  constructor(database, sqlLoader) {
    this.database = database;
    this.sqlLoader = sqlLoader;
  }

  /**
   * Runs a single SQL file against the database.
   *
   * @param {string} fileName The name of the SQL file to be executed.
   */
  async runSqlFile(fileName) {
    console.log(`Running file: ${fileName}`);
    await this.database.query(this.sqlLoader.read(fileName));
  }

  /**
   * Runs multiple SQL files in sequence against the database.
   *
   * @param {string[]} fileNames An array of SQL file names to be executed in sequence.
   */
  async runSqlFiles(fileNames) {
    for (const fileName of fileNames) {
      await this.runSqlFile(fileName);
    }
  }

  /**
   * Executes a series of database operations within a transaction. If any operation fails, the transaction is rolled back.
   *
   * @param {Function} callback 
   */
  async transaction(callback) {
    await this.database.query("BEGIN");
    try {
      await callback();
      await this.database.query("COMMIT");
    } catch (e) {
      await this.database.query("ROLLBACK");
      throw e;
    }
  }

  /**
   * Executes multiple SQL files in sequence within a transaction.
   *
   * @param {string[]} fileNames An array of SQL file names to be executed in sequence.
   */
  async runFromFiles(fileNames) {
    await this.transaction(() => {
      this.runSqlFiles(fileNames);
    });
  }

  /**
   * Executes a SQL COPY command to copy data from a CSV stream into the database using the specified SQL file.
   *
   * @param {string} fileName The name of the SQL file containing the COPY command.
   * @param {ReadableStream} csvStream A readable stream of the CSV data to be copied into the database.
   */
  async copyToDatabase(fileName, csvStream) {
    console.log(`Copying data from CSV using file: ${fileName}`);
    const sql = this.sqlLoader.read(fileName);

    const client = await this.database.connect();
    try {
      await new Promise((resolve, reject) => {
        const dbStream = client.query(copyFrom(sql));
        csvStream
          .pipe(dbStream)
          .on("finish", resolve)
          .on("error", reject);
      });
    } finally {
      client.release();
    }
  }
}
