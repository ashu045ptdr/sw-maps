const { S3Client } = require("@aws-sdk/client-s3");
require("dotenv").config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.AWS_REGION;

/**
 * Generate the S3 public URL for a given key (file path)
 * Note: Bucket and objects must be publicly accessible for this URL to work.
 * @param {string} key
 * @returns {string} Full S3 URL
 */
function getS3FileUrl(key) {
  // Use encodeURIComponent for safe URLs if key may contain spaces or special chars
  return `https://${bucketName}.s3.${region}.amazonaws.com/${encodeURIComponent(key)}`;
}

module.exports = { s3Client, bucketName, getS3FileUrl };
