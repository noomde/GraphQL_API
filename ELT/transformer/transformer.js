import fs from "fs";
import path from "path";

/**
 * A class to run SQL files against a database.
 */
export class SqlTransformRunner {
    constructor(database, sqlPath) {
        this.database = database;
        this.sqlPath = sqlPath;
    }

    /**
     * Reads the contents of a SQL file given its name.
     *
     * @param {string} fileName - The name of the SQL file to read.
     * @returns {string} The contents of the SQL file.
     */
    readSqlFile(fileName) {
        const fullPath = path.join(this.sqlPath, fileName);
        return fs.readFileSync(fullPath, "utf8");
    }

    /**
     * Executes a SQL file against the database.
     *
     * @param {string} fileName - The name of the SQL file to run.
     */
    async runSqlFile(fileName) {
        console.log(`Running file: ${fileName}`);
        const sqlStatement = this.readSqlFile(fileName);
        await this.database.query(sqlStatement);
    }

    /**
     * Executes multiple SQL files against the database.
     *
     * @param {string[]} fileNames - The names of the SQL files to run.
     */
    async runSqlFiles(fileNames) {
        for (const fileName of fileNames) {
            await this.runSqlFile(fileName);
        }
    }

    /**
     * Executes a callback function inside a database transaction. If the callback function throws an error, the transaction will be rolled back. Otherwise, the transaction will be committed.
     *
     * @param {Function} callbackFunction - The function to run inside the transaction.
     */
    async databaseTransaction(callbackFunction) {
        await this.database.query("BEGIN");
        try {
            await callbackFunction();
            await this.database.query("COMMIT");
            } catch (error) {
            await this.database.query("ROLLBACK");
            throw error;
        }
    }

    /**
     * Executes multiple SQL files against the database.
     *
     * @param {string[]} fileNames 
     */
    async runFromFiles(fileNames) {
        await this.databaseTransaction(() =>
            this.runSqlFiles(fileNames)
        );
    }
}
