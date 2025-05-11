import { desc, eq, and, not } from "drizzle-orm";
import { getDBInstance } from "./instance";
import { otaBundles } from "./schema";
import { normalizeBundle } from "./utils";

export class OTABundlesService {
  constructor(private db: ReturnType<typeof getDBInstance>) {}

  async getBundleById(id: string) {
    const results = await this.db
      .select()
      .from(otaBundles)
      .where(eq(otaBundles.id, id))
      .limit(1);

    const bundle = results[0] ?? null;

    if (!bundle) return null;

    return normalizeBundle(bundle);
  }

  async getRelevantBundles(
    platform: "ios" | "android",
    channel: string,
    appVersion: string
  ) {
    const results = await this.db
      .select()
      .from(otaBundles)
      .where(
        and(
          eq(otaBundles.platform, platform),
          eq(otaBundles.channel, channel),
          eq(otaBundles.version, appVersion),
          not(eq(otaBundles.status, "ROLLBACK"))
        )
      )
      .orderBy(desc(otaBundles.id));
    return results.map((bundle) => normalizeBundle(bundle));
  }
}
