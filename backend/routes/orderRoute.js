import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";
import optionalAuthUser from "../middleware/optionalAuthUser.js";

const orderRouter = express.Router();


orderRouter.get("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);


orderRouter.post("/place", optionalAuthUser, placeOrder);

orderRouter.post("/stripe", optionalAuthUser, placeOrderStripe);
orderRouter.post("/razorpay", optionalAuthUser, placeOrderRazorpay);
orderRouter.post("/verifyStripe", optionalAuthUser, verifyStripe);


orderRouter.get("/userorders", authUser, userOrders);

export default orderRouter;