// Import the default export from the ImageKit Node.js SDK
const ImageKit = require("imagekit");

// Initialize the ImageKit instance with your credentials
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Function to upload a file to ImageKit
async function uploadFile(file, fileName) {
  try {
    const result = await imagekit.upload({
      file, // The file to upload (can be a base64 string, buffer, or URL)
      fileName, // The name to assign to the uploaded file
    });
    return result;
  } catch (err) {
    console.error("Upload failed:", err);
    throw err;
  }
}

module.exports = { uploadFile };
