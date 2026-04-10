/**
 * Class responsible for running SQL transformations on the database using provided SQL files and a SQL loader.
 */
export class SqlTransformRunner {

  /**
   * Creates an instance of the SQLTransformRunner class.
   *
   * @param {Object} database - The database connection object.
   * @param {Object} sqlLoader - The SQL loader instance.
   */
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
   * @param {Function} callback - The function containing the database operations to be executed.
   */
  async transaction(callback) {
    await this.database.query('BEGIN');
    try {
      await callback();
      await this.database.query('COMMIT');
    } catch (e) {
      await this.database.query('ROLLBACK');
      throw e;
    }
  }

  /**
   * Executes multiple SQL files in sequence within a transaction.
   *
   * @param {string[]} fileNames An array of SQL file names to be executed in sequence.
   */
  async runFromFiles(fileNames) {
    return this.transaction(() => this.runSqlFiles(fileNames));
  }
}
