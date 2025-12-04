import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

// .env ফাইল থেকে কনফিগারেশন লোড করা
dotenv.config();

// ১. Cloudinary কনফিগারেশন
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ২. Cloudinary স্টোরেজ সেটআপ
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Beigelo_Products", // Cloudinary-তে এই নামে ফোল্ডার তৈরি হবে
    allowed_formats: ["jpg", "png", "jpeg", "webp"], // এই ফরম্যাটগুলো সাপোর্ট করবে
  },
});

const upload = multer({ storage: storage });

export default upload;
