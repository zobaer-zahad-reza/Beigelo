import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Authorization denied, no token" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role && decoded.role === "admin") {
            req.adminId = decoded.id; 
            next();
        } else {
            return res.status(403).json({ success: false, message: "Forbidden: Admin access only" });
        }
    } catch (error) {
        res.status(401).json({ success: false, message: "Token is not valid or has expired" });
    }
};

export default adminAuth;