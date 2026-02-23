import { from as copyFrom } from "pg-copy-streams";

export class SqlTransformRunner {
  constructor(database, sqlLoader) {
    this.database = database;
    this.sqlLoader = sqlLoader;
  }

  async runSqlFile(fileName) {
    console.log(`Running file: ${fileName}`);
    await this.database.query(this.sqlLoader.read(fileName));
  }

  async runSqlFiles(fileNames) {
    for (const fileName of fileNames) {
      await this.runSqlFile(fileName);
    }
  }

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

  async runFromFiles(fileNames) {
    await this.transaction(() => this.runSqlFiles(fileNames));
  }

  async copyToDatabase(fileName, csvStream) {
    console.log(`Copying data from CSV using file: ${fileName}`);
    const sql = this.sqlLoader.read(fileName);

    const client = await this.database.connect();
    try {
      await new Promise((resolve, reject) => {
        const dbStream = client.query(copyFrom(sql));
        csvStream.pipe(dbStream).on("finish", resolve).on("error", reject);
      });
    } finally {
      client.release();
    }
  }
}
