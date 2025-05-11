// import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/* const s3 = new S3Client({
  region: "us-east-1", // replace with your region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
}); */

export const getSignedUrlFromS3 = async (key: string): Promise<string> => {
  /* const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });
    // return getSignedUrl(s3, command, { expiresIn: 300 }); */
  return `https://mock-bucket.s3.amazonaws.com/${key}`;
};
