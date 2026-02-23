import fs from "fs";
import path from "path";

export class SqlLoader {
  constructor(sqlPath) {
    this.sqlPath = sqlPath;
  }

  resolve(fileName) {
    return path.join(this.sqlPath, fileName);
  }

  read(fileName) {
    return fs.readFileSync(this.resolve(fileName), "utf8");
  }
}
