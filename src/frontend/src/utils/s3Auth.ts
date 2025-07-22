// AWS S3 Authentication Utilities
import { SHA256 } from "crypto-js";
import hmacSHA256 from "crypto-js/hmac-sha256";
import enc from "crypto-js/enc-hex";

export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  endpoint?: string;
}

export function generateAuthHeaders(
  config: S3Config,
  method: string,
  objectKey: string,
  contentType: string,
  date: Date = new Date(),
): { [key: string]: string } {
  // Create date stamps
  const amzDate = date.toISOString().replace(/[:\-]|\.\d{3}/g, "");
  const dateStamp = amzDate.substr(0, 8);

  // Create credential scope
  const credentialScope = `${dateStamp}/${config.region}/s3/aws4_request`;

  // Create canonical headers
  const host = config.endpoint
    ? new URL(config.endpoint).host
    : `${config.bucket}.s3.${config.region}.amazonaws.com`;

  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:UNSIGNED-PAYLOAD\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";

  // Create canonical request
  const canonicalRequest = [
    method,
    `/${objectKey}`,
    "", // query string
    canonicalHeaders,
    signedHeaders,
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  // Create string to sign
  const algorithm = "AWS4-HMAC-SHA256";
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    SHA256(canonicalRequest).toString(),
  ].join("\n");

  // Create signing key
  const kDate = hmacSHA256(dateStamp, "AWS4" + config.secretAccessKey);
  const kRegion = hmacSHA256(config.region, kDate);
  const kService = hmacSHA256("s3", kRegion);
  const kSigning = hmacSHA256("aws4_request", kService);

  // Calculate signature
  const signature = hmacSHA256(stringToSign, kSigning).toString(enc);

  // Create authorization header
  const authorization = `${algorithm} Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    Authorization: authorization,
    "x-amz-content-sha256": "UNSIGNED-PAYLOAD",
    "x-amz-date": amzDate,
    "Content-Type": contentType,
  };
}

export function generateS3UploadUrl(
  config: S3Config,
  objectKey: string,
): string {
  if (config.endpoint) {
    return `${config.endpoint.replace(/\/$/, "")}/${config.bucket}/${objectKey}`;
  }
  return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${objectKey}`;
}
