import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import pkg from "multer-storage-cloudinary";

dotenv.config();

// --- DEBUGGING BLOCK ---
// This safely finds the CloudinaryStorage class, wherever it is hiding.
const CloudinaryStorage =
  pkg.CloudinaryStorage || pkg.default?.CloudinaryStorage || pkg.default || pkg;

// Check if we actually found it
if (typeof CloudinaryStorage !== "function") {
  console.error("❌ LIBRARY ERROR: Could not find CloudinaryStorage.");
  console.log("📦 What we got instead:", pkg);
  process.exit(1); // Stop the server so you can see the log
}
// -----------------------

// Check if keys are loaded
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error(
    "❌ ENV ERROR: Cloudinary keys are missing! Check your .env file."
  );
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Beigelo_Products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage: storage });

export default upload;
