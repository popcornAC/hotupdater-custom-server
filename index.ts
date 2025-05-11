import fastify from "fastify";
import { z } from "zod";

import { getUpdateInfo } from "./functions/getUpdateInfo";
import { getSignedUrlFromS3 } from "./functions/getSignedUrlFromS3";
import { NIL_UUID } from "./constants";

const server = fastify();

interface CheckUpdateResponse {
  id: string;
  message: string;
  shouldForceUpdate: boolean;
  fileUrl: string;
}


const checkUpdateHeadersSchema = z.object({
  "x-bundle-id": z.string().min(1),
  "x-app-platform": z.enum(["ios", "android"]),
  "x-app-version": z.string().min(1),
  "x-min-bundle-id": z.string().optional().default(NIL_UUID),
  "x-channel": z.string().optional().default("production"),
});


const parseHeaders = (rawHeaders: Record<string, unknown>) => {
  const normalized: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(rawHeaders)) {
    normalized[key.toLowerCase()] = Array.isArray(val) ? val[0] : val;
  }
  return checkUpdateHeadersSchema.safeParse(normalized);
};

server.get("/api/check-update", async (request, reply) => {
  const result = parseHeaders(request.headers);

  if (!result.success) {
    return reply.status(400).send({ error: "Invalid or missing headers." });
  }

  const {
    "x-bundle-id": bundleId,
    "x-app-platform": platform,
    "x-app-version": appVersion,
    "x-min-bundle-id": minBundleId,
    "x-channel": channel,
  } = result.data;

  const updateInfo = await getUpdateInfo({
    platform,
    bundleId,
    appVersion,
    minBundleId,
    channel,
  });

  if (!updateInfo) {
    return reply.status(200).send(null);
  }

  const signedUrl = await getSignedUrlFromS3(updateInfo.s3Key);

  return reply.send({
    fileUrl: signedUrl,
    message: updateInfo.message ?? "",
    shouldForceUpdate: updateInfo.shouldForceUpdate,
    id: updateInfo.id,
  });
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
