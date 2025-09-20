// middleware/authUser.js
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    // 1️⃣ Authorization header check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Authorization header missing or invalid:", authHeader);
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized, Login Again" });
    }

    // 2️⃣ Extract token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("Token missing after Bearer");
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized, Login Again" });
    }

    // 3️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // set userId for controllers

    console.log("Token verified. User ID:", req.userId);
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid Token, Login Again" });
  }
};

export default authUser;
