// uploadToGoogle.js
import { Storage } from "@google-cloud/storage";

// Initializes a client using the environment variable.
const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucketName = process.env.BUCKET_NAME;

/**
 * Uploads a file to Google Cloud Storage.
 * @param {string} filePath - The local file path to upload.
 * @returns {Promise<string>} - The public URL of the uploaded file.
 */
async function uploadFile(filePath) {
  try {
    // Ensure your bucket permissions are set for public access if you use public URLs,
    // or implement appropriate access control.
    const [file] = await storage.bucket(bucketName).upload(filePath, {
      gzip: true,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });

    console.log(`${filePath} uploaded to ${bucketName}.`);

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${file.name}`;
    return publicUrl;
  } catch (error) {
    console.error(`Failed to upload ${filePath}:`, error);
    throw error; // Rethrow the error for handling in the calling function
  }
}

// ES Module export
export { uploadFile };
