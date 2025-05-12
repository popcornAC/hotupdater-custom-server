import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import path from "path";
import { otaBundles } from "./schema";

const DB_PATH =
  process.env.DB_PATH || path.join(process.cwd(), "database", "db.sqlite");

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDBInstance() {
  if (!dbInstance) {
    const sqlite = new Database(DB_PATH);
    dbInstance = drizzle(sqlite, { schema: { otaBundles } });
  }
  return dbInstance;
}

export function resetDBInstance() {
  dbInstance = null;
}
