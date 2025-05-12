export interface OTABundle {
  id: string;
  platform: "ios" | "android";
  channel: string;
  version: string;
  status: "UPDATE" | "ROLLBACK";
  s3Key: string;
  message?: string;
  shouldForceUpdate: boolean;
}
