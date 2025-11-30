import express from "express";
import { addBrand, listBrands } from "../controllers/brandController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const brandRouter = express.Router();

brandRouter.post("/add", adminAuth, upload.single("image"), addBrand);

//  /api/brand/list
brandRouter.get("/list", listBrands);

export default brandRouter;
