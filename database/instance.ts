import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import Database from "better-sqlite3";

import * as schema from "./schema";

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export const getDBInstance = () => {
  if (db) {
    return db;
  }

  db = drizzle(new Database("./database/db.sqlite"), { schema });
  return db;
};
