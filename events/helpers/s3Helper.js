const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

// Initialize S3 client using env credentials
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Helper to convert stream to buffer
async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

/**
 * Download file from S3 bucket and return buffer and content type
 * @param {string} key - the S3 object key
 * @returns {Promise<{buffer: Buffer, contentType: string}>}
 */
async function downloadFileFromS3(key) {
  try {
    const bucketName = process.env.S3_BUCKET_NAME;
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const response = await s3Client.send(command);
    const buffer = await streamToBuffer(response.Body);
    const contentType = response.ContentType || "application/octet-stream";
    return { buffer, contentType };
  } catch (error) {
    console.error("S3 download error:", error);
    throw error;
  }
}

module.exports = { downloadFileFromS3 };
