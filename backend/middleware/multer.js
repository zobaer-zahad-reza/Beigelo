import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { createRequire } from "module";

// লাইব্রেরি ইমপোর্ট করার জন্য সবচেয়ে নিরাপদ পদ্ধতি (Node v22 fix)
const require = createRequire(import.meta.url);
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary কনফিগারেশন
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// স্টোরেজ সেটআপ
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Beigelo_Products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

export default upload;