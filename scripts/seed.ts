import { sql } from "drizzle-orm";
import {
  getSQLiteInstance,
  resetSQLiteInstance,
} from "../database/providers/sqlite/instance";
import { otaBundles } from "../database/schema";

async function seed() {
  try {
    resetSQLiteInstance();
    const db = getSQLiteInstance();

    await new Promise<void>((resolve) => {
      db.run(sql`
        CREATE TABLE IF NOT EXISTS ota_bundles (
          id TEXT PRIMARY KEY,
          version TEXT NOT NULL,
          platform TEXT NOT NULL,
          channel TEXT NOT NULL,
          status TEXT NOT NULL,
          s3_key TEXT NOT NULL,
          message TEXT,
          should_force_update INTEGER NOT NULL
        );
      `);
      resolve();
    });

    await db.delete(otaBundles);

    await db.insert(otaBundles).values([
      {
        id: "0196c25b-955a-7c7e-85c8-19e0f9cb4379",
        platform: "ios",
        channel: "production",
        version: "1.1.0",
        status: "UPDATE",
        s3Key: "prod/ios/1.1.0/0196c25b-955a-7c7e-85c8-19e0f9cb4379.js",
        message: "Initial release",
        shouldForceUpdate: 0,
      },
      {
        id: "0196c25b-b07e-70e1-a7ae-42d4b81d8cca",
        platform: "android",
        channel: "production",
        version: "1.1.0",
        status: "UPDATE",
        s3Key: "prod/android/1.1.0/0196c25b-b07e-70e1-a7ae-42d4b81d8cca.js",
        message: "Updated release",
        shouldForceUpdate: 1,
      },
    ] as any);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
