import jwt from "jsonwebtoken";

const optionalAuthUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    
    console.log("Optional auth: Token verified. User ID:", req.userId);
    next();

  } catch (error) {
    console.error("Optional auth: Invalid token:", error.message);
    next();
  }
};

export default optionalAuthUser;