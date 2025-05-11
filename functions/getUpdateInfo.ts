import { NIL_UUID } from "../constants";

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

const hardcodedBundles = [
  {
    id: "018f71d6-1111-7000-a1b2-111111111111",
    version: "2.1.0",
    platform: "ios",
    channel: "production",
    shouldForceUpdate: false,
    message: "",
    status: "UPDATE",
    s3Key: "prod/ios/2.1.0/018f71d6-1111-7000-a1b2-111111111111.js",
  },
  {
    id: "018f71d5-0000-7000-b2c3-222222222222", // Older UUIDv7
    version: "2.1.0",
    platform: "ios",
    channel: "production",
    shouldForceUpdate: true,
    message: "",
    status: "ROLLBACK",
    s3Key: "prod/ios/2.1.0/018f71d5-0000-7000-b2c3-222222222222.js",
  },
] as const;

export const getUpdateInfo = async ({
  platform,
  appVersion,
  bundleId,
  minBundleId,
  channel = "production",
}: GetUpdateInfoArgs): Promise<UpdateInfo | null> => {
  // future PG query:
  // select * from mobile_ota_updates where platform = $1 and channel = $2 and version = $3 sort by id desc limit

  const currentBundle = hardcodedBundles.find((b) => b.id === bundleId);

  const bundleIdToEvaluate =
    !currentBundle || currentBundle.status === "ROLLBACK"
      ? minBundleId ?? NIL_UUID
      : currentBundle.id;

  // 1. Filter bundles matching platform, channel, and exact native app version
  const relevantBundles = hardcodedBundles.filter(
    (b) =>
      b.platform === platform &&
      b.channel === channel &&
      b.version === appVersion &&
      b.status !== "ROLLBACK"
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
