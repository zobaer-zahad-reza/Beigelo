import express from "express";
import {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  updateQuantity,
  updateProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

// Add Product Route
productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
    { name: "image6", maxCount: 1 },
  ]),
  addProduct
);

// Remove Product Route
productRouter.post("/remove", adminAuth, removeProduct);

// Single Product Info Route
productRouter.post("/single", singleProduct);

// List Products Route
productRouter.get("/list", listProducts);

// Update Quantity Route
productRouter.post("/update-quantity", adminAuth, updateQuantity);

// Update Product Route
productRouter.post("/update", adminAuth, upload.array("image"), updateProduct);

export default productRouter;