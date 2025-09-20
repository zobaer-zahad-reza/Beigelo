import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  getProfile,
} from "../controllers/userController.js";

import protect from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.get("/profile", protect, getProfile);
export default userRouter;
