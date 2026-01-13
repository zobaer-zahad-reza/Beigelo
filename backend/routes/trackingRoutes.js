import express from "express";
import {
  trackVisitor,
  getVisitors,
  deleteVisitor,
} from "../controllers/visitorController.js";
// পাথ ঠিক আছে কিনা চেক করে নেবেন

const router = express.Router();

router.post("/track", trackVisitor); // ডাটা সেভ করার জন্য POST মেথড
router.get("/all", getVisitors); // এডমিন প্যানেলে দেখার জন্য

// Delete Routes
router.delete("/delete/:id", deleteVisitor); // একটি ডিলিট করতে: /api/visitors/delete/ID_HERE

export default router;
