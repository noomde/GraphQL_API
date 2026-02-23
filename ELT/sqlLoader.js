import fs from "fs";
import path from "path";

export class SqlLoader {
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
    return fs.readFileSync(this.resolve(fileName), "utf8");
  }
}
