import { NIL_UUID } from "../constants";
import { getDBInstance } from "../database/instance";
import { OTABundlesService } from "../database/queries";

type GetUpdateInfoArgs = {
  platform: "ios" | "android";
  appVersion: string;
  bundleId: string;
  minBundleId?: string;
  channel?: string;
};

// Support enabled boolean?
interface UpdateInfo {
  id: string;
  shouldForceUpdate: boolean;
  message: string | null;
  status: "ROLLBACK" | "UPDATE";
  s3Key: string;
}

const $OTABundlesService = new OTABundlesService(getDBInstance());

export const getUpdateInfo = async ({
  platform,
  appVersion,
  bundleId,
  minBundleId,
  channel = "production",
}: GetUpdateInfoArgs): Promise<UpdateInfo | null> => {
  const currentBundle = await $OTABundlesService.getBundleById(bundleId);

  const bundleIdToEvaluate =
    !currentBundle || currentBundle.status === "ROLLBACK"
      ? minBundleId ?? NIL_UUID
      : currentBundle.id;

  const relevantBundles = await $OTABundlesService.getRelevantBundles(
    platform,
    channel,
    appVersion
  );

  // 2. Sort in descending UUIDv7 order
  const latestUpdate = relevantBundles.sort((a, b) =>
    a.id < b.id ? 1 : -1
  )[0];

  // 3. Only return if the new bundleId is greater than the current one
  if (latestUpdate && latestUpdate.id > bundleIdToEvaluate) {
    return {
      id: latestUpdate.id,
      shouldForceUpdate: latestUpdate.shouldForceUpdate,
      message: latestUpdate.message,
      status: latestUpdate.status,
      s3Key: latestUpdate.s3Key,
    };
  }
  return null;
};
