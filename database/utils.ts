import { InferSelectModel } from "drizzle-orm";
import { otaBundles as DBBundle } from "./schema";
import { OTABundle } from "./providers/types";
type OTABundleRow = InferSelectModel<typeof DBBundle>;

export function normalizeBundle(row: OTABundleRow): OTABundle {
  return {
    id: row.id,
    version: row.version,
    platform: row.platform as "ios" | "android",
    channel: row.channel,
    status: row.status as "UPDATE" | "ROLLBACK",
    s3Key: row.s3Key,
    message: row.message || "",
    shouldForceUpdate: row.shouldForceUpdate ? true : false,
  };
}
