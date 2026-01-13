import Visitor from "../models/Visitor.js";
import geoip from "geoip-lite";

const trackVisitor = async (req, res, next) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    const geo = geoip.lookup(ip);

    const { utm_source, utm_medium, utm_campaign } = req.query;

    await Visitor.create({
      ip,
      country: geo?.country || "Unknown",

      source: utm_source || "Direct",
      medium: utm_medium || "-",
      campaign: utm_campaign || "-",

      page: req.originalUrl,
      userAgent: req.headers["user-agent"],
    });
  } catch (error) {
    console.log("Tracking error:", error.message);
  }

  next();
};

export default trackVisitor;
