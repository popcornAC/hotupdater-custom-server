import fastify from "fastify";
import { getUpdateInfo } from "./functions/getUpdateInfo";
import { getSignedUrlFromS3 } from "./functions/getSignedUrlFromS3";

export const NIL_UUID = "00000000-0000-0000-0000-000000000000";

const server = fastify();

server.get("/api/check-update", async (request, reply) => {
  const getHeader = (key: string) => {
    const val = request.headers[key];
    return Array.isArray(val) ? val[0] : val?.toString();
  };

  const bundleId = getHeader("x-bundle-id");
  const appVersion = getHeader("x-app-version");
  const minBundleId = getHeader("x-min-bundle-id") ?? NIL_UUID;
  const channel = getHeader("x-channel") ?? "production";

  const appPlatform = (() => {
    const platform = getHeader("x-app-platform");
    return platform === "ios" || platform === "android" ? platform : undefined;
  })();

  if (!bundleId || !appPlatform || !appVersion) {
    return reply.status(400).send({ error: "Missing required headers." });
  }

  const updateInfo = await getUpdateInfo({
    platform: appPlatform,
    bundleId,
    appVersion,
    minBundleId,
    channel,
  });

  if (!updateInfo) {
    return reply.status(200).send(null);
  }

  const signedUrl = await getSignedUrlFromS3(updateInfo.s3Key);

  return reply.send({ fileUrl: signedUrl });
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
