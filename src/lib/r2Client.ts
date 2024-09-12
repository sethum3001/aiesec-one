import { S3Client } from "@aws-sdk/client-s3"; // Import the S3 client from AWS SDK

// Create a new instance of the S3Client for Cloudflare R2
export const r2Client = new S3Client({
  region: "auto", // Set the region to "auto" as Cloudflare R2 handles region internally
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, // Use the R2-specific endpoint for Cloudflare, constructed using the account ID from environment variables
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "", // Access key for R2, fetched from environment variables
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "" // Secret access key for R2, also fetched from environment variables
  }
});
