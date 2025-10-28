import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Authorization header missing or invalid:", authHeader);
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized, Login Again" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("Token missing after Bearer");
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized, Login Again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; 

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
