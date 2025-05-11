import { InferSelectModel } from "drizzle-orm";
import { otaBundles as OTABundle } from "./schema";

type OTABundleRow = InferSelectModel<typeof OTABundle>;

export function normalizeBundle(row: OTABundleRow): Record<string, any> {
  return {
    id: row.id,
    version: row.version,
    platform: row.platform,
    channel: row.channel,
    status: row.status,
    s3Key: row.s3Key,
    message: row.message,
    shouldForceUpdate: row.shouldForceUpdate ? true : false,
  };
}
