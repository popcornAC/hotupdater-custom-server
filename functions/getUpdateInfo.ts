import { NIL_UUID } from "../constants";
import { OTABundlesProviderFactory } from "../database/providers/factory/OTABundlesProviderFactory";

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
  fileHash: string;
  s3Key: string;
}

const provider = OTABundlesProviderFactory.createProvider("sqlite");

export const getUpdateInfo = async ({
  platform,
  appVersion,
  bundleId,
  minBundleId,
  channel = "production",
}: GetUpdateInfoArgs): Promise<UpdateInfo | null> => {
  const currentBundle = await provider.getBundleById(bundleId);

  const bundleIdToEvaluate =
    !currentBundle || currentBundle.status === "ROLLBACK"
      ? minBundleId ?? NIL_UUID
      : currentBundle.id;

  const relevantBundles = await provider.getRelevantBundles(
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
      message: latestUpdate.message ?? "",
      s3Key: latestUpdate.s3Key,
      fileHash: latestUpdate.fileHash,
    };
  }
  return null;
};
