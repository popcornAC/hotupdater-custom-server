import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";

import { otaBundles } from "../database/schema";

const hardcodedBundles = [
  {
    id: "018f71d6-1111-7000-a1b2-111111111111",
    version: "2.1.0",
    platform: "ios",
    channel: "production",
    shouldForceUpdate: 0,
    message: "",
    status: "UPDATE",
    s3Key: "prod/ios/2.1.0/018f71d6-1111-7000-a1b2-111111111111.js",
  },
  {
    id: "018f71d5-0000-7000-b2c3-222222222222",
    version: "2.1.0",
    platform: "ios",
    channel: "production",
    shouldForceUpdate: 1,
    message: "",
    status: "ROLLBACK",
    s3Key: "prod/ios/2.1.0/018f71d5-0000-7000-b2c3-222222222222.js",
  },
];

async function seed() {
  try {
    const rawDb = new Database("./database/db.sqlite");
    rawDb.exec(`
        CREATE TABLE IF NOT EXISTS ota_bundles (
          id TEXT PRIMARY KEY,
          version TEXT NOT NULL,
          platform TEXT NOT NULL,
          channel TEXT NOT NULL,
          status TEXT NOT NULL,
          s3_key TEXT NOT NULL,
          message TEXT,
          should_force_update INTEGER NOT NULL DEFAULT 0);
      `);
    const db = drizzle(rawDb);

    for (const bundle of hardcodedBundles) {
      const existing = await db
        .select()
        .from(otaBundles)
        .where(eq(otaBundles.id, bundle.id))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(otaBundles).values(bundle as any);
        console.log(`✅ Inserted bundle ${bundle.id}`);
      } else {
        console.log(`ℹ️  Skipped existing bundle ${bundle.id}`);
      }
    }
  } catch (error) {
    console.error("❌ Failed to seed OTA bundles:", error);
  }
}

seed();
