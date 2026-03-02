import express from "express";
import {
  trackVisitor,
  getVisitors,
  deleteVisitor,
  deleteAllVisitors,
} from "../controllers/visitorController.js";

const router = express.Router();

router.post("/track", trackVisitor);      
router.get("/all", getVisitors);          
router.delete("/:id", deleteVisitor);    
router.delete("/", deleteAllVisitors);   

export default router;