import fs from 'fs';
import path from 'path';

import { from as copyFrom } from 'pg-copy-streams';

/**
 * The SqlLoader is responsible for loading SQL files.
 */
export class SqlLoader {
  /**
   * Creates an instance of sqlLoader.
   *
   * @param {string} sqlPath - The path to the directory containing SQL files.
   */
  constructor(sqlPath) {
    this.sqlPath = sqlPath;
  }

  /**
   * Resolves the absolute path to the SQL file based on the provided file name.
   *
   * @param {string} fileName Name of the SQL file to resolve.
   * @returns {String} Absolute path to the SQL file.
   */
  resolve(fileName) {
    return path.join(this.sqlPath, fileName);
  }

  /**
   * Reads the contents of the specified SQL file and returns it as a string.
   *
   * @param {string} fileName Name of the SQL file to read.
   * @returns {string} Contents of the SQL file as a string.
   */
  read(fileName) {
    return fs.readFileSync(this.resolve(fileName), 'utf8');
  }

  /**
   * Executes a SQL COPY command to copy data from a CSV stream into the database using the specified SQL file.
   *
   * @param {string} fileName The name of the SQL file containing the COPY command.
   * @param {ReadableStream} csvStream A readable stream of the CSV data to be copied into the database.
   */
  async copyToDatabase(fileName, csvStream, database) {
    console.log(`Copying data from CSV using file: ${fileName}`);
    const sql = this.read(fileName);

    await new Promise((resolve, reject) => {
      const dbStream = database.query(copyFrom(sql));
      csvStream.pipe(dbStream).on('finish', resolve).on('error', reject);
    });
  }
}
